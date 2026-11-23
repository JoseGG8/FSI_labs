export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || undefined;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Error de validación en los datos enviados';
    details = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Identificador inválido para el campo "${err.path}"`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'campo';
    message = `Ya existe un registro con ese valor de "${field}"`;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'El cuerpo de la petición contiene JSON inválido';
  }

  if (statusCode >= 500) {
    console.error('[ERROR]', err);
  }

  const payload = {
    ok: false,
    message
  };

  if (details) {
    payload.details = details;
  }

  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}
