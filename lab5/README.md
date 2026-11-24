# eBookStore — E-commerce Full-Stack de Libros Electrónicos (eBooks)

Aplicación web *full-stack* para la **venta de libros electrónicos (eBooks)**, gestión de catálogo digital, control atómico de stock en servidor, pagos verificados con **PayPal Sandbox** y seguimiento de pedidos y entregas digitales en tiempo real mediante **Socket.IO**.

---

## Enlaces de Producción (Railway)

- **Frontend (Next.js):** https://ebookstore-web-production-b30982b2.up.railway.app
- **Backend API + Socket.IO:** https://ebookstore-server-production.up.railway.app
- **Healthcheck:** https://ebookstore-server-production.up.railway.app/health

---

## Documentación del Proyecto

- [INFORME_LABORATORIO.md](./INFORME_LABORATORIO.md) — Informe final del laboratorio, resultados de TestSprite y reflexión individual.
- [ARQUITECTURA.md](./ARQUITECTURA.md) — Diagramas de arquitectura, flujos de secuencia y justificación técnica.
- [DOCUMENTACION_API.md](./DOCUMENTACION_API.md) — Colecciones Mongoose, endpoints REST, matriz RBAC y eventos Socket.IO.
- [AUDITORIA_SEGURIDAD.md](./AUDITORIA_SEGURIDAD.md) — Revisión OWASP Top 10 y endurecimientos aplicados.
- [PRD.md](./PRD.md) — Especificación de requisitos y casos de prueba E2E para TestSprite.

---

## Arquitectura y Stack Tecnológico

| Capa | Tecnología | Responsabilidad |
| :--- | :--- | :--- |
| **Frontend** (`web/`) | Next.js 15 (App Router) + Tailwind CSS | Catálogo de eBooks (`/`), autenticación (`/auth`), carrito y checkout con PayPal SDK (`/carrito`), biblioteca de compras (`/pedidos`) y panel administrativo (`/admin`). |
| **Backend** (`server/`) | Node.js + Express + Socket.IO | API REST segura (JWT, bcrypt, Helmet, rate limiting, sanitización NoSQL), control atómico de stock, integración PayPal Sandbox REST v2 y eventos WSS en tiempo real. |
| **Base de Datos** | MongoDB Atlas + Mongoose | Persistencia en colecciones `users`, `books`, `orders` y `payments`. |
| **Pasarela de Pagos** | PayPal Sandbox (REST API v2) | Creación y captura de órdenes con verificación de monto, moneda e idempotencia estricta en servidor. |
| **Despliegue y QA** | Railway + TestSprite | Despliegue en la nube (HTTPS/WSS) y pruebas automatizadas E2E guiadas por `PRD.md`. |

---

## Estructura del Monorepo

```text
lab5/
├── web/                     # Frontend Next.js (App Router + Tailwind CSS)
│   ├── src/                 # Páginas, componentes, contextos (Auth, Cart, Socket)
│   ├── railway.json         # Configuración de despliegue en Railway
│   └── .env.example         # Plantilla de variables del frontend
├── server/                  # Backend Express (API REST + Socket.IO + Mongoose)
│   ├── src/                 # Config, models, controllers, routes, services, realtime, seed
│   ├── railway.json         # Configuración de despliegue y healthcheck en Railway
│   └── .env.example         # Plantilla de variables del backend
├── .env.example             # Plantilla consolidada de variables de entorno
├── .gitignore               # Exclusión de secretos y artefactos de compilación
├── ARQUITECTURA.md          # Diagramas y justificación técnica
├── DOCUMENTACION_API.md     # Especificación de colecciones, REST y WebSockets
├── AUDITORIA_SEGURIDAD.md   # Reporte de auditoría OWASP
├── PRD.md                   # Documento de requisitos para TestSprite
├── INFORME_LABORATORIO.md   # Informe final consolidado
└── README.md                # Guía general del proyecto
```

---

## Ejecución Local

### 1. Configurar variables de entorno
```bash
cp server/.env.example server/.env
cp web/.env.example web/.env.local
```
Completa `MONGODB_URI`, `JWT_SECRET`, `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` en `server/.env`, y `NEXT_PUBLIC_PAYPAL_CLIENT_ID` en `web/.env.local`.

### 2. Instalar dependencias, poblar catálogo e iniciar Backend
```bash
cd server
npm install
npm run seed
npm run dev
```

### 3. Instalar dependencias e iniciar Frontend
```bash
cd web
npm install
npm run dev
```
Abre `http://localhost:3000` (el backend escucha en `http://localhost:4000`).

---

## Cuentas Demo del Seed

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@ebookstore.com` | `Admin123!` |
| **Cliente Demo** | `cliente@ebookstore.com` | `Cliente123!` |

> **Seguridad:** Ningún archivo `.env` o `.env.local` se versiona en Git (excluidos en `.gitignore` y `.railwayignore`).
