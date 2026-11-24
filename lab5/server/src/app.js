import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { getDbStatus } from './config/db.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { sanitizeNoSql, createRateLimiter } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);

  const allowedOrigins = env.corsOrigin
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        const normalized = origin ? origin.replace(/\/$/, '') : '';
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(normalized)) {
          return callback(null, true);
        }
        return callback(new Error(`Origen no permitido por CORS: ${origin}`));
      },
      credentials: true
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitizeNoSql);

  const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: 'Demasiados intentos de autenticación. Espera unos minutos.'
  });
  const apiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 300
  });

  if (env.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  app.get('/', (_req, res) => {
    res.json({
      ok: true,
      service: 'eBookStore API',
      version: '1.0.0',
      status: 'running'
    });
  });

  app.get('/health', (_req, res) => {
    const dbStatus = getDbStatus();
    const healthy = dbStatus === 'connected';
    res.status(healthy ? 200 : 503).json({
      ok: healthy,
      service: 'ebookstore-server',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api', apiLimiter);
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
