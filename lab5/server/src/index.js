import http from 'http';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import { initSocket } from './realtime/socket.js';

async function bootstrap() {
  try {
    await connectDB();

    const app = createApp();
    const server = http.createServer(app);
    initSocket(server);

    const host = '0.0.0.0';
    server.listen(env.port, host, () => {
      console.log(
        `[SERVER] eBookStore API + Socket.IO escuchando en http://${host}:${env.port} (${env.nodeEnv})`
      );
    });

    const shutdown = async (signal) => {
      console.log(`[SERVER] Señal ${signal} recibida, cerrando servidor...`);
      server.close(async () => {
        await mongoose.disconnect().catch(() => null);
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[BOOTSTRAP] No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

bootstrap();
