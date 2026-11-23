import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { AppError } from '../middleware/errorHandler.js';
import { sanitizeOrderForUser } from './ordersController.js';
import { emitOrderPaid } from '../realtime/socket.js';
import {
  createPaypalOrder,
  capturePaypalOrder,
  isPaypalConfigured
} from '../services/paypalService.js';

function assertOrderOwnership(order, user) {
  const ownerId = order.userId?._id ? order.userId._id.toString() : order.userId.toString();
  const isOwner = ownerId === user._id.toString();
  const isAdmin = user.role === 'administrador';
  if (!isOwner && !isAdmin) {
    throw new AppError('No tienes permiso para operar sobre este pedido', 403);
  }
}

export function getPaypalConfig(_req, res) {
  res.json({
    ok: true,
    provider: 'paypal',
    mode: env.paypalMode,
    currency: env.paypalCurrency,
    configured: isPaypalConfigured()
  });
}

export async function createPaypalPaymentOrder(req, res, next) {
  try {
    const { orderId } = req.body || {};

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Debes proporcionar un orderId válido', 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Pedido no encontrado', 404);
    }

    assertOrderOwnership(order, req.user);

    if (order.status === 'cancelado') {
      throw new AppError('No se puede iniciar un pago para un pedido cancelado', 400);
    }

    if (order.paymentStatus === 'pagado') {
      throw new AppError('Este pedido ya fue pagado anteriormente', 409);
    }

    // Idempotencia: si ya existe una orden PayPal creada para este pedido y monto, reutilizarla
    const existingPayment = await Payment.findOne({
      orderId: order._id,
      provider: 'paypal',
      status: { $in: ['creado', 'aprobado'] }
    }).sort({ createdAt: -1 });

    if (existingPayment && Math.abs(existingPayment.amount - order.total) <= 0.01) {
      return res.json({
        ok: true,
        idempotent: true,
        orderId: order._id,
        paypalOrderId: existingPayment.providerOrderId,
        amount: existingPayment.amount,
        currency: existingPayment.currency,
        status: existingPayment.status
      });
    }

    const currency = (env.paypalCurrency || 'USD').toUpperCase();
    // Siempre usamos order.total calculado en el servidor (nunca el monto del cliente)
    const paypalOrder = await createPaypalOrder({
      orderId: order._id.toString(),
      total: order.total,
      currency
    });

    const payment = await Payment.create({
      orderId: order._id,
      provider: 'paypal',
      providerOrderId: paypalOrder.id,
      amount: order.total,
      currency,
      status: 'creado',
      rawResponse: paypalOrder
    });

    res.status(201).json({
      ok: true,
      orderId: order._id,
      paypalOrderId: payment.providerOrderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      approveUrl: paypalOrder.links?.find((l) => l.rel === 'approve')?.href || null
    });
  } catch (error) {
    next(error);
  }
}

export async function capturePaypalPaymentOrder(req, res, next) {
  try {
    const orderId = req.body?.orderId;
    const paypalOrderId = req.body?.paypalOrderId || req.body?.providerOrderId;

    if (!paypalOrderId || typeof paypalOrderId !== 'string') {
      throw new AppError('Debes proporcionar el paypalOrderId para capturar el pago', 400);
    }

    const payment = await Payment.findOne({
      provider: 'paypal',
      providerOrderId: paypalOrderId.trim()
    });

    if (!payment) {
      throw new AppError('No existe un registro de pago asociado a ese paypalOrderId', 404);
    }

    if (orderId && payment.orderId.toString() !== String(orderId)) {
      throw new AppError('El paypalOrderId no corresponde al pedido indicado', 400);
    }

    const order = await Order.findById(payment.orderId);
    if (!order) {
      throw new AppError('El pedido asociado al pago no existe', 404);
    }

    assertOrderOwnership(order, req.user);

    // Idempotencia estricta: si ya fue capturado y el pedido está pagado, retornar éxito sin recobrar
    if (payment.status === 'capturado' && order.paymentStatus === 'pagado') {
      return res.json({
        ok: true,
        idempotent: true,
        message: 'El pago ya había sido capturado previamente',
        order: sanitizeOrderForUser(order, req.user.role),
        payment
      });
    }

    if (order.status === 'cancelado') {
      throw new AppError('No se puede capturar un pago sobre un pedido cancelado', 400);
    }

    const captureData = await capturePaypalOrder(payment.providerOrderId);

    const purchaseUnit = captureData?.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const captureStatus = capture?.status || captureData?.status;

    if (captureStatus !== 'COMPLETED' || !capture?.id) {
      payment.status = 'fallido';
      payment.rawResponse = captureData;
      await payment.save();

      order.paymentStatus = 'fallido';
      await order.save();

      throw new AppError(
        `El pago no fue completado en PayPal (estado: ${captureStatus || 'desconocido'})`,
        400
      );
    }

    // Verificación estricta de monto, moneda y referencia en servidor
    const capturedAmount = Number(capture.amount?.value);
    const capturedCurrency = String(capture.amount?.currency_code || '').toUpperCase();
    const expectedAmount = Number(order.total);
    const expectedCurrency = String(payment.currency || 'USD').toUpperCase();

    if (
      Number.isNaN(capturedAmount) ||
      Math.abs(capturedAmount - expectedAmount) > 0.01 ||
      capturedCurrency !== expectedCurrency
    ) {
      payment.status = 'fallido';
      payment.rawResponse = captureData;
      await payment.save();

      order.paymentStatus = 'fallido';
      await order.save();

      throw new AppError(
        `Discrepancia en el monto o moneda capturada (esperado ${expectedAmount.toFixed(2)} ${expectedCurrency}, recibido ${capturedAmount} ${capturedCurrency})`,
        400
      );
    }

    // Verificar que este captureId no haya sido usado en otro pedido
    const duplicateCapture = await Payment.findOne({
      captureId: capture.id,
      _id: { $ne: payment._id }
    });
    if (duplicateCapture) {
      throw new AppError('Esta captura de PayPal ya fue aplicada a otro pedido', 409);
    }

    payment.captureId = capture.id;
    payment.status = 'capturado';
    payment.rawResponse = captureData;
    await payment.save();

    order.paymentStatus = 'pagado';
    if (order.status === 'pendiente') {
      order.status = 'procesando';
    }
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate('userId', 'name email role');
    emitOrderPaid(populatedOrder || order, payment);

    res.json({
      ok: true,
      message: 'Pago capturado y verificado correctamente. Descargas digitales habilitadas.',
      order: sanitizeOrderForUser(order, req.user.role),
      payment
    });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentsByOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('orderId inválido', 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Pedido no encontrado', 404);
    }

    assertOrderOwnership(order, req.user);

    const payments = await Payment.find({ orderId: order._id })
      .select('-rawResponse')
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      payments
    });
  } catch (error) {
    next(error);
  }
}
