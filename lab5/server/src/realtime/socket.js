import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { verifyAuthToken } from '../middleware/auth.js';

let ioInstance = null;

function sanitizeOrderForClient(orderDoc) {
  const obj = orderDoc?.toJSON ? orderDoc.toJSON() : { ...orderDoc };
  const canDownload = obj.paymentStatus === 'pagado';
  if (Array.isArray(obj.items)) {
    obj.items = obj.items.map((item) => ({
      ...item,
      downloadUrl: canDownload ? item.downloadUrl : null
    }));
  }
  return obj;
}

function getOrderUserId(order) {
  if (!order?.userId) return null;
  return order.userId._id ? order.userId._id.toString() : order.userId.toString();
}

export function initSocket(httpServer) {
  const allowedOrigins = env.corsOrigin
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  ioInstance = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const normalized = origin ? origin.replace(/\/$/, '') : '';
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(normalized)) {
          return callback(null, true);
        }
        return callback(new Error(`Origen WebSocket no permitido: ${origin}`));
      },
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Handshake autenticado por JWT
  ioInstance.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers?.authorization || '';
      const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
      const rawToken =
        socket.handshake.auth?.token || headerToken || socket.handshake.query?.token || '';

      const token = String(rawToken).replace(/^Bearer\s+/i, '').trim();
      if (!token) {
        return next(new Error('UNAUTHORIZED: Token JWT requerido en el handshake'));
      }

      const payload = verifyAuthToken(token);
      const user = await User.findById(payload.sub);
      if (!user) {
        return next(new Error('UNAUTHORIZED: Usuario no encontrado'));
      }

      socket.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };

      return next();
    } catch {
      return next(new Error('UNAUTHORIZED: Token JWT inválido o expirado'));
    }
  });

  ioInstance.on('connection', (socket) => {
    const rooms = [`user:${socket.user.id}`];
    socket.join(`user:${socket.user.id}`);

    if (socket.user.role === 'administrador') {
      socket.join('admins');
      rooms.push('admins');
    }

    console.log(
      `[SOCKET] Conectado ${socket.user.email} (${socket.user.role}) -> salas: ${rooms.join(', ')}`
    );

    socket.emit('socket:ready', {
      userId: socket.user.id,
      role: socket.user.role,
      rooms,
      connectedAt: new Date().toISOString()
    });

    socket.on('disconnect', (reason) => {
      console.log(`[SOCKET] Desconectado ${socket.user.email} (${reason})`);
    });
  });

  return ioInstance;
}

export function getIO() {
  return ioInstance;
}

export function emitNewOrder(order) {
  if (!ioInstance || !order) return;
  const userId = getOrderUserId(order);
  const adminOrder = order.toJSON ? order.toJSON() : order;

  ioInstance.to('admins').emit('order:created', {
    type: 'NEW_ORDER',
    message: `Nuevo pedido recibido por $${Number(adminOrder.total).toFixed(2)}`,
    order: adminOrder,
    timestamp: new Date().toISOString()
  });

  if (userId) {
    ioInstance.to(`user:${userId}`).emit('order:created', {
      type: 'ORDER_CREATED',
      message: 'Tu pedido fue registrado correctamente',
      order: sanitizeOrderForClient(order),
      timestamp: new Date().toISOString()
    });
  }
}

export function emitOrderPaid(order, payment) {
  if (!ioInstance || !order) return;
  const userId = getOrderUserId(order);
  const adminOrder = order.toJSON ? order.toJSON() : order;

  const paymentSummary = payment
    ? {
        id: payment._id,
        provider: payment.provider,
        providerOrderId: payment.providerOrderId,
        captureId: payment.captureId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status
      }
    : null;

  ioInstance.to('admins').emit('order:paid', {
    type: 'NEW_SALE',
    message: `Nueva venta pagada por $${Number(adminOrder.total).toFixed(2)}`,
    order: adminOrder,
    payment: paymentSummary,
    timestamp: new Date().toISOString()
  });

  if (userId) {
    ioInstance.to(`user:${userId}`).emit('order:paid', {
      type: 'PAYMENT_CONFIRMED',
      message: 'Pago confirmado. Tus eBooks ya están disponibles para descarga.',
      order: sanitizeOrderForClient(order),
      payment: paymentSummary,
      timestamp: new Date().toISOString()
    });
  }
}

export function emitOrderStatusUpdated(order, previousStatus) {
  if (!ioInstance || !order) return;
  const userId = getOrderUserId(order);
  const adminOrder = order.toJSON ? order.toJSON() : order;

  const payloadBase = {
    type: 'ORDER_STATUS_UPDATED',
    orderId: adminOrder._id?.toString(),
    previousStatus,
    status: adminOrder.status,
    message: `El estado de tu pedido cambió de "${previousStatus}" a "${adminOrder.status}"`,
    timestamp: new Date().toISOString()
  };

  ioInstance.to('admins').emit('order:status_updated', {
    ...payloadBase,
    order: adminOrder
  });

  if (userId) {
    ioInstance.to(`user:${userId}`).emit('order:status_updated', {
      ...payloadBase,
      order: sanitizeOrderForClient(order)
    });
  }
}
