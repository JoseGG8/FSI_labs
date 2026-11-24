# Auditoría de Seguridad — eBookStore (`lab5`)

**Fecha:** 23 de Noviembre de 2026  
**Alcance:** Backend (`lab5/server`), Frontend (`lab5/web`), Base de Datos (MongoDB Atlas), Pasarela de Pagos (PayPal Sandbox), WebSockets (Socket.IO) y Despliegue (Railway).

---

## Resumen Ejecutivo

Se realizó una auditoría orientada a **OWASP Top 10 (2021)** y **OWASP API Security Top 10** sobre el código fuente y la configuración desplegada en Railway. Se confirmaron los controles críticos de autenticación, autorización, integridad de pagos y protección de descargas, y se aplicaron **3 endurecimientos adicionales en código** más **1 recomendación de configuración en Railway**.

---

## Matriz de Hallazgos y Controles Verificados

| # | Categoría OWASP | Evaluación | Estado / Acción |
| :--- | :--- | :--- | :--- |
| 1 | **A01 — Broken Access Control (RBAC y propiedad)** | Todas las rutas administrativas exigen `requireAuth` + `requireRole('administrador')`. El registro público fuerza `role: 'cliente'` ignorando cualquier rol enviado en el payload. Los pedidos y pagos validan propiedad (`order.userId === req.user._id`). | ✅ Verificado |
| 2 | **A01 — Descargas no autorizadas de eBooks** | `downloadUrl` se elimina en `GET /api/books` y `GET /api/books/:id` para usuarios no administradores, y se devuelve como `null` en pedidos/WebSockets mientras `paymentStatus !== 'pagado'`. | ✅ Verificado |
| 3 | **A02 — Cryptographic Failures (Secretos y contraseñas)** | Contraseñas hasheadas con `bcryptjs` (10 rondas), `passwordHash` excluido en `User.toJSON`. `JWT_SECRET` de 96 caracteres hex. `.env` y `.env.local` excluidos en `.gitignore` y `.railwayignore`. | ✅ Verificado |
| 4 | **A03 — Injection (NoSQL Injection y ReDoS)** | Se agregó middleware recursivo `sanitizeNoSql` ([security.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab5/server/src/middleware/security.js)) que elimina claves con `$` o `.` en `req.body` y `req.query`. Las búsquedas en catálogo escapan caracteres especiales de regex (`escapeRegex`). | ✅ Endurecido |
| 5 | **A03 — XSS mediante URLs en libros** | Se añadió validación de esquema `^https?:\/\/` en `coverImageUrl` y `downloadUrl` dentro de [Book.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab5/server/src/models/Book.js) para bloquear esquemas `javascript:` o `data:`. | ✅ Endurecido |
| 6 | **A04 — Insecure Design (Pagos e inventario)** | `POST /api/orders` recalcula `total` exclusivamente en servidor y descuenta stock con actualización atómica (`$gte` + `$inc`) y rollback compensatorio. PayPal valida `COMPLETED`, monto y moneda exactos, previene reutilización de `captureId` y garantiza idempotencia. | ✅ Verificado |
| 7 | **A05 — Security Misconfiguration (Cabeceras, CORS y `NODE_ENV`)** | `helmet` activo, `trust proxy` configurado, `CORS_ORIGIN` restringido a la URL pública de Railway (`https://ebookstore-web-production-b30982b2.up.railway.app`). **Hallazgo menor en Railway:** `ebookstore-server` tenía `NODE_ENV=development` (expone `stack` en errores 500). **Recomendación:** cambiar a `NODE_ENV=production` en Railway Variables. | ⚠️ Recomendado en Railway |
| 8 | **A07 — Brute Force / Abuso de API** | Se incorporó rate limiting en memoria ([security.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab5/server/src/middleware/security.js)): 60 req/15 min en `/api/auth` y 300 req/15 min en `/api`. | ✅ Endurecido |
| 9 | **WebSockets (Socket.IO)** | Handshake autenticado por JWT verificando existencia del usuario en MongoDB; separación estricta de salas `user:<id>` y `admins`; transporte seguro `WSS` sobre HTTPS en Railway. | ✅ Verificado |
| 10 | **Dependencias (`npm audit`)** | Backend `lab5/server`: `0` vulnerabilidades. Frontend `lab5/web`: 2 avisos de dependencias transitivas de desarrollo/Next.js sin exposición de secretos en cliente. | ✅ Documentado |
