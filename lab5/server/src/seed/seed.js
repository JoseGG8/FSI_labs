import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';

const initialBooks = [
  {
    title: 'Arquitectura Limpia en Node.js y Microservicios',
    author: 'Elena Morales',
    description:
      'Guía práctica para diseñar APIs escalables, desacopladas y mantenibles con Node.js, Express y patrones DDD aplicados a producción.',
    category: 'Arquitectura de Software',
    price: 19.99,
    stock: 25,
    coverImageUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/arquitectura-limpia-nodejs.pdf',
    format: 'PDF / EPUB',
    pages: 340
  },
  {
    title: 'Dominando Next.js App Router y React Moderno',
    author: 'Carlos Mendoza',
    description:
      'Construye aplicaciones web full-stack ultrarrápidas con Server Components, streaming, Tailwind CSS y optimización SEO avanzada.',
    category: 'Desarrollo Web',
    price: 24.5,
    stock: 30,
    coverImageUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/dominando-nextjs-app-router.pdf',
    format: 'PDF / EPUB',
    pages: 410
  },
  {
    title: 'Ingeniería de Prompts y Agentes de IA en Producción',
    author: 'Sofía Ramírez',
    description:
      'Aprende a diseñar, evaluar y desplegar sistemas agénticos confiables con LLMs, RAG, memoria persistente y herramientas externas.',
    category: 'Inteligencia Artificial',
    price: 29.0,
    stock: 18,
    coverImageUrl:
      'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/agentes-ia-produccion.pdf',
    format: 'PDF / EPUB',
    pages: 315
  },
  {
    title: 'MongoDB Atlas y Modelado NoSQL de Alto Rendimiento',
    author: 'Diego Salgado',
    description:
      'Domina índices compuestos, pipelines de agregación, transacciones distribuidas y patrones de modelado en Mongoose para apps reales.',
    category: 'Bases de Datos',
    price: 18.0,
    stock: 20,
    coverImageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/mongodb-nosql-alto-rendimiento.pdf',
    format: 'PDF / EPUB',
    pages: 280
  },
  {
    title: 'Seguridad en APIs REST: JWT, OAuth2 y OWASP Top 10',
    author: 'Laura Castaño',
    description:
      'Manual de defensa práctica para proteger aplicaciones web modernas contra inyecciones, abuso de pagos, CSRF y escalada de privilegios.',
    category: 'Ciberseguridad',
    price: 22.75,
    stock: 15,
    coverImageUrl:
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/seguridad-apis-rest-owasp.pdf',
    format: 'PDF / EPUB',
    pages: 295
  },
  {
    title: 'WebSockets y Sistemas en Tiempo Real con Socket.IO',
    author: 'Andrés Vallejo',
    description:
      'Implementa chats, tableros colaborativos y seguimiento en vivo de pedidos con autenticación en el handshake y reconexión resiliente.',
    category: 'Desarrollo Web',
    price: 16.5,
    stock: 12,
    coverImageUrl:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/websockets-tiempo-real-socketio.pdf',
    format: 'PDF / EPUB',
    pages: 240
  },
  {
    title: 'DevOps Pragmático: CI/CD, Contenedores y Despliegue Cloud',
    author: 'Mateo Restrepo',
    description:
      'De localhost a producción sin fricción: variables seguras, observabilidad, monitoreo de salud y despliegues continuos en la nube.',
    category: 'DevOps y Cloud',
    price: 21.0,
    stock: 10,
    coverImageUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/devops-pragmatico-cloud.pdf',
    format: 'PDF / EPUB',
    pages: 330
  },
  {
    title: 'Diseño de Sistemas de Pago y Comercio Electrónico Seguro',
    author: 'Valeria Duque',
    description:
      'Patrones de idempotencia, conciliación de órdenes, prevención de cobros duplicados e integración robusta con pasarelas como PayPal.',
    category: 'Arquitectura de Software',
    price: 26.0,
    stock: 5,
    coverImageUrl:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://downloads.ebookstore.local/ebooks/sistemas-pago-ecommerce-seguro.pdf',
    format: 'PDF / EPUB',
    pages: 365
  }
];

async function seed() {
  try {
    await connectDB();

    let insertedBooks = 0;
    for (const book of initialBooks) {
      const result = await Book.updateOne(
        { title: book.title },
        { $setOnInsert: book },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        insertedBooks += 1;
      }
    }

    const adminEmail = 'admin@ebookstore.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminHash = await bcrypt.hash('Admin123!', 10);
      await User.create({
        name: 'Administrador eBookStore',
        email: adminEmail,
        passwordHash: adminHash,
        role: 'administrador'
      });
      console.log(`[SEED] Usuario administrador creado: ${adminEmail} / Admin123!`);
    } else {
      console.log(`[SEED] Usuario administrador ya existía: ${adminEmail}`);
    }

    const clientEmail = 'cliente@ebookstore.com';
    const existingClient = await User.findOne({ email: clientEmail });
    if (!existingClient) {
      const clientHash = await bcrypt.hash('Cliente123!', 10);
      await User.create({
        name: 'Cliente Demo',
        email: clientEmail,
        passwordHash: clientHash,
        role: 'cliente'
      });
      console.log(`[SEED] Usuario cliente demo creado: ${clientEmail} / Cliente123!`);
    } else {
      console.log(`[SEED] Usuario cliente demo ya existía: ${clientEmail}`);
    }

    const totalBooks = await Book.countDocuments();
    console.log(`[SEED] Libros nuevos insertados: ${insertedBooks}. Total en catálogo: ${totalBooks}.`);
  } catch (error) {
    console.error('[SEED] Error ejecutando seed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
