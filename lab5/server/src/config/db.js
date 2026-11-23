import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.mongodbUri) {
    throw new Error(
      'Falta la variable de entorno MONGODB_URI en server/.env. Configúrala con la URI de tu clúster de MongoDB Atlas.'
    );
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(`[DB] Conectado a MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

export function getDbStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
}
