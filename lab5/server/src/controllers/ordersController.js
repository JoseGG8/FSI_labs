import mongoose from 'mongoose';
import { Book } from '../models/Book.js';
import { Order } from '../models/Order.js';
import { AppError } from '../middleware/errorHandler.js';
import { emitNewOrder, emitOrderStatusUpdated } from '../realtime/socket.js';

const VALID_ORDER_STATUSES = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

export function sanitizeOrderForUser(orderDoc, userRole) {
  const obj = orderDoc.toJSON ? orderDoc.toJSON() : { ...orderDoc };
  const canDownload = userRole === 'administrador' || obj.paymentStatus === 'pagado';

  if (Array.isArray(obj.items)) {
    obj.items = obj.items.map((item) => ({
      ...item,
      downloadUrl: canDownload ? item.downloadUrl : null
    }));
  }
  return obj;
}

export async function createOrder(req, res, next) {
  const decrementedItems = [];

  try {
    const { items, emailDelivery, shippingAddress } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('El pedido debe incluir al menos un eBook en "items"', 400);
    }

    // Consolidar cantidades si el cliente repite el mismo bookId
    const quantityByBookId = new Map();
    for (const rawItem of items) {
      const bookId = String(rawItem?.bookId || '').trim();
      const quantity = Number(rawItem?.quantity);

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new AppError(`ID de libro inválido: "${bookId}"`, 400);
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new AppError('Cada libro debe tener una cantidad entera mayor o igual a 1', 400);
      }

      quantityByBookId.set(bookId, (quantityByBookId.get(bookId) || 0) + quantity);
    }

    const bookIds = Array.from(quantityByBookId.keys());
    const books = await Book.find({ _id: { $in: bookIds } });

    if (books.length !== bookIds.length) {
      throw new AppError('Uno o más eBooks seleccionados no existen en el catálogo', 404);
    }

    const bookMap = new Map(books.map((b) => [b._id.toString(), b]));

    // Verificación previa de stock
    for (const [bookId, quantity] of quantityByBookId.entries()) {
      const book = bookMap.get(bookId);
      if (book.stock < quantity) {
        throw new AppError(
          `Stock insuficiente para "${book.title}". Disponible: ${book.stock}, solicitado: ${quantity}`,
          409
        );
      }
    }

    // Descuento atómico de stock por libro (evita sobreventa concurrente)
    const orderItems = [];
    let computedTotal = 0;

    for (const [bookId, quantity] of quantityByBookId.entries()) {
      const updatedBook = await Book.findOneAndUpdate(
        { _id: bookId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updatedBook) {
        const refBook = bookMap.get(bookId);
        throw new AppError(
          `Stock insuficiente al confirmar "${refBook?.title || bookId}". Intenta nuevamente.`,
          409
        );
      }

      decrementedItems.push({ bookId, quantity });

      const unitPrice = Number(updatedBook.price);
      computedTotal += unitPrice * quantity;

      orderItems.push({
        bookId: updatedBook._id,
        title: updatedBook.title,
        author: updatedBook.author,
        unitPrice,
        quantity,
        downloadUrl: updatedBook.downloadUrl
      });
    }

    // Recálculo estricto en servidor (nunca confiamos en el total del frontend)
    const total = Number(computedTotal.toFixed(2));
    const deliveryEmail =
      typeof emailDelivery === 'string' && emailDelivery.trim()
        ? emailDelivery.trim().toLowerCase()
        : req.user.email;

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      total,
      emailDelivery: deliveryEmail,
      shippingAddress: shippingAddress && typeof shippingAddress === 'object' ? shippingAddress : undefined,
      status: 'pendiente',
      paymentStatus: 'pendiente'
    });

    const populatedOrder = await Order.findById(order._id).populate('userId', 'name email role');
    emitNewOrder(populatedOrder || order);

    res.status(201).json({
      ok: true,
      message: 'Pedido creado correctamente. Completa el pago para habilitar las descargas.',
      order: sanitizeOrderForUser(order, req.user.role)
    });
  } catch (error) {
    // Rollback compensatorio si falló después de descontar algún libro
    if (decrementedItems.length > 0) {
      await Promise.all(
        decrementedItems.map(({ bookId, quantity }) =>
          Book.updateOne({ _id: bookId }, { $inc: { stock: quantity } }).catch(() => null)
        )
      );
    }
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      ok: true,
      total: orders.length,
      orders: orders.map((order) => sanitizeOrderForUser(order, req.user.role))
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const { status, paymentStatus } = req.query;
    const filter = {};
    if (status && VALID_ORDER_STATUSES.includes(status)) {
      filter.status = status;
    }
    if (paymentStatus && ['pendiente', 'pagado', 'fallido', 'reembolsado'].includes(paymentStatus)) {
      filter.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      total: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email role');
    if (!order) {
      throw new AppError('Pedido no encontrado', 404);
    }

    const ownerId = order.userId?._id ? order.userId._id.toString() : order.userId.toString();
    const isOwner = ownerId === req.user._id.toString();
    const isAdmin = req.user.role === 'administrador';

    if (!isOwner && !isAdmin) {
      throw new AppError('No tienes permiso para ver este pedido', 403);
    }

    res.json({
      ok: true,
      order: sanitizeOrderForUser(order, req.user.role)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body || {};

    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      throw new AppError(
        `Estado inválido. Valores permitidos: ${VALID_ORDER_STATUSES.join(', ')}`,
        400
      );
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new AppError('Pedido no encontrado', 404);
    }

    const previousStatus = order.status;
    if (previousStatus === 'cancelado' && status !== 'cancelado') {
      throw new AppError('No se puede reactivar un pedido ya cancelado', 400);
    }

    // Si pasa a cancelado, restauramos el stock de las licencias reservadas
    if (status === 'cancelado' && previousStatus !== 'cancelado') {
      await Promise.all(
        order.items.map((item) =>
          Book.updateOne({ _id: item.bookId }, { $inc: { stock: item.quantity } })
        )
      );
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate('userId', 'name email role');
    emitOrderStatusUpdated(populatedOrder || order, previousStatus);

    res.json({
      ok: true,
      message: `Estado del pedido actualizado de "${previousStatus}" a "${status}"`,
      order: populatedOrder || order
    });
  } catch (error) {
    next(error);
  }
}
