import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from './errorHandler.js';

export function signAuthToken(user) {
  if (!env.jwtSecret) {
    throw new AppError('JWT_SECRET no está configurado en el servidor', 500);
  }
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function verifyAuthToken(token) {
  if (!env.jwtSecret) {
    throw new AppError('JWT_SECRET no está configurado en el servidor', 500);
  }
  return jwt.verify(token, env.jwtSecret);
}

function extractBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice(7).trim() || null;
}

export async function requireAuth(req, _res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      throw new AppError('Autenticación requerida. Envía el token en Authorization: Bearer <token>', 401);
    }

    let payload;
    try {
      payload = verifyAuthToken(token);
    } catch {
      throw new AppError('Token inválido o expirado', 401);
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new AppError('El usuario asociado al token ya no existe', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return next();
    }
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);
    if (user) {
      req.user = user;
    }
  } catch {
    // Si el token opcional es inválido, se trata como visitante público
  }
  next();
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Autenticación requerida', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('No tienes permisos para realizar esta acción', 403));
    }
    return next();
  };
}
