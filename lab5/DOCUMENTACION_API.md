# Documentación de la API REST, Colecciones y WebSockets — eBookStore

- **Base URL Producción:** `https://ebookstore-server-production.up.railway.app`
- **Base URL Local:** `http://localhost:4000`
- **Formato:** JSON (`Content-Type: application/json`)
- **Autenticación:** Token JWT en cabecera `Authorization: Bearer <token>`

---

## 1. Colecciones en MongoDB Atlas (Mongoose)

### 1.1. `users` ([User.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab5/server/src/models/User.js))
| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK | Identificador único del usuario. |
| `name` | `String` | Requerido, 2–100 chars | Nombre completo. |
| `email` | `String` | Requerido, único, lowercase | Correo electrónico de acceso. |
| `passwordHash` | `String` | Requerido (oculto en JSON) | Hash generado con `bcryptjs` (10 rondas). |
| `role` | `String` | Enum: `cliente`, `administrador` | Rol de autorización (default: `cliente`). |
| `createdAt` / `updatedAt` | `Date` | Automático | Marcas de tiempo. |

### 1.2. `books` ([Book.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab5/server/src/models/Book.js))
| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK | Identificador único del eBook. |
| `title` | `String` | Requerido, índice texto | Título del libro electrónico. |
| `author` | `String` | Requerido, índice texto | Autor del eBook. |
| `description` | `String` | Requerido, índice texto | Sinopsis/descripción técnica. |
| `category` | `String` | Requerido, indexado | Categoría temática. |
| `price` | `Number` | Requerido, `>= 0` | Precio unitario en USD. |
| `stock` | `Number` | Requerido, `>= 0` | Licencias digitales disponibles. |
| `coverImageUrl` | `String` | Requerido, `http(s)://` | URL de imagen de portada. |
| `downloadUrl` | `String` | Requerido, `http(s)://` | Enlace privado de descarga (oculto al público). |
| `format` / `pages` | `String` / `Number` | Opcional | Formato (`PDF / EPUB`) y cantidad de páginas. |

### 1.3. `orders` ([Order.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab5/server/src/models/Order.js))
| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK | Identificador del pedido. |
| `userId` | `ObjectId` | Ref `User`, indexado | Propietario del pedido. |
| `items` | `Array` | Mínimo 1 elemento | Snapshot de `{ bookId, title, author, unitPrice, quantity, downloadUrl }`. |
| `total` | `Number` | Requerido, `>= 0` | Total recalculado estrictamente en el servidor. |
| `emailDelivery` | `String` | Requerido, email válido | Correo destino para entrega digital. |
| `shippingAddress` | `Object` | Opcional | `{ recipientName, street, city, country, postalCode }`. |
| `status` | `String` | Enum: `pendiente`, `procesando`, `enviado`, `entregado`, `cancelado` | Estado operativo del envío digital. |
| `paymentStatus` | `String` | Enum: `pendiente`, `pagado`, `fallido`, `reembolsado` | Estado de pago verificado. |

### 1.4. `payments` ([Payment.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab5/server/src/models/Payment.js))
| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK | Identificador interno del pago. |
| `orderId` | `ObjectId` | Ref `Order`, indexado | Pedido asociado. |
| `provider` | `String` | Enum: `paypal` | Pasarela utilizada. |
| `providerOrderId` | `String` | Requerido, único | ID de orden en PayPal REST API v2. |
| `captureId` | `String` | Único (`sparse`) | ID de captura definitiva de PayPal. |
| `amount` / `currency` | `Number` / `String` | Requerido / default `USD` | Monto y moneda verificados. |
| `status` | `String` | Enum: `creado`, `aprobado`, `capturado`, `fallido`, `reembolsado` | Estado del registro de pago. |
| `rawResponse` | `Mixed` | Opcional (oculto en GET) | Auditoría de respuesta de PayPal. |

---

## 2. Matriz de Endpoints y Permisos por Rol

| Método | Endpoint | Público | `cliente` | `administrador` | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `GET` | `/` | ✅ | ✅ | ✅ | Información básica del servicio. |
| `GET` | `/health` | ✅ | ✅ | ✅ | Estado del servidor y conectividad con MongoDB Atlas (`200` / `503`). |
| `POST` | `/api/auth/register` | ✅ | ✅ | ✅ | Registro de nuevo usuario (siempre asigna `role: "cliente"`). |
| `POST` | `/api/auth/login` | ✅ | ✅ | ✅ | Validación de credenciales (`bcrypt`) y emisión de JWT. |
| `GET` | `/api/auth/me` | ❌ | ✅ | ✅ | Retorna perfil del usuario autenticado. |
| `GET` | `/api/books` | ✅ | ✅ | ✅ | Catálogo con búsqueda insensible a tildes (`q`), `category`, `minPrice`, `maxPrice`, `inStock`, `sort`. Oculta `downloadUrl` salvo a `administrador`. |
| `GET` | `/api/books/:id` | ✅ | ✅ | ✅ | Detalle de un eBook (oculta `downloadUrl` salvo a `administrador`). |
| `POST` | `/api/books` | ❌ | ❌ (`403`) | ✅ | Crea un nuevo eBook en el catálogo. |
| `PATCH` | `/api/books/:id` | ❌ | ❌ (`403`) | ✅ | Actualiza stock, precio o metadatos de un eBook. |
| `DELETE` | `/api/books/:id` | ❌ | ❌ (`403`) | ✅ | Elimina un eBook del catálogo. |
| `POST` | `/api/orders` | ❌ | ✅ | ✅ | Crea pedido verificando stock atómico y recalculando `total` en servidor. |
| `GET` | `/api/orders/me` | ❌ | ✅ | ✅ | Lista los pedidos del usuario autenticado (`downloadUrl: null` si no está pagado). |
| `GET` | `/api/orders` | ❌ | ❌ (`403`) | ✅ | Lista global de pedidos (filtros `status`, `paymentStatus`). |
| `GET` | `/api/orders/:id` | ❌ | ✅ (dueño) | ✅ | Consulta detalle de un pedido específico. |
| `PATCH` | `/api/orders/:id/status` | ❌ | ❌ (`403`) | ✅ | Cambia estado de pedido, emite evento Socket.IO y restaura stock si pasa a `cancelado`. |
| `GET` | `/api/payments/config` | ✅ | ✅ | ✅ | Devuelve `provider`, `mode`, `currency` y `configured` (sin secretos). |
| `POST` | `/api/payments/paypal/order` | ❌ | ✅ (dueño) | ✅ | Crea (o reutiliza idempotentemente) orden PayPal Sandbox con `order.total`. |
| `POST` | `/api/payments/paypal/capture` | ❌ | ✅ (dueño) | ✅ | Captura pago en PayPal, valida monto/moneda/idempotencia y desbloquea descargas. |
| `GET` | `/api/payments/order/:orderId` | ❌ | ✅ (dueño) | ✅ | Consulta registros de pago de un pedido (sin `rawResponse`). |

---

## 3. Ejemplos de Payloads Clave

### Registro (`POST /api/auth/register`)
```json
{
  "name": "Ana López",
  "email": "ana@ejemplo.com",
  "password": "Password123!"
}
```
**Respuesta (`201 Created`):**
```json
{
  "ok": true,
  "message": "Cuenta creada correctamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "6b04...",
    "name": "Ana López",
    "email": "ana@ejemplo.com",
    "role": "cliente"
  }
}
```

### Crear Pedido (`POST /api/orders`)
```json
{
  "items": [
    { "bookId": "6b049b4e...", "quantity": 1 }
  ],
  "emailDelivery": "ana@ejemplo.com",
  "shippingAddress": {
    "recipientName": "Ana López",
    "city": "Medellín",
    "country": "Colombia"
  }
}
```

### Crear y Capturar Pago PayPal
1. `POST /api/payments/paypal/order` -> `{ "orderId": "6b04..." }`
2. `POST /api/payments/paypal/capture` -> `{ "orderId": "6b04...", "paypalOrderId": "4UY93820028915043" }`

### Actualizar Estado de Envío (`PATCH /api/orders/:id/status`, rol `administrador`)
```json
{
  "status": "enviado"
}
```

---

## 4. Eventos WebSocket (Socket.IO)

- **Endpoint:** `wss://ebookstore-server-production.up.railway.app` (transporte `websocket` + fallback `polling`).
- **Autenticación en Handshake:** `io(URL, { auth: { token: "<JWT>" } })`. Si falta o es inválido, se rechaza con `UNAUTHORIZED`.
- **Salas asignadas automáticamente:**
  - `user:<userId>`: todos los usuarios autenticados.
  - `admins`: exclusivamente usuarios con `role === "administrador"`.

| Evento | Dirección | Destinatarios | Payload principal |
| :--- | :--- | :--- | :--- |
| `socket:ready` | Servidor -> Cliente | Socket conectado | `{ userId, role, rooms, connectedAt }` |
| `order:created` | Servidor -> Cliente | `admins` y `user:<id>` | `{ type, message, order, timestamp }` |
| `order:paid` | Servidor -> Cliente | `admins` y `user:<id>` | `{ type, message, order, payment, timestamp }` |
| `order:status_updated` | Servidor -> Cliente | `admins` y `user:<id>` | `{ type, orderId, previousStatus, status, message, order, timestamp }` |

---

## 5. Códigos de Estado HTTP y Límites

- `200 OK` / `201 Created`: operación exitosa.
- `400 Bad Request`: validación fallida, ID inválido o discrepancia de monto PayPal.
- `401 Unauthorized`: JWT ausente, inválido o credenciales incorrectas.
- `403 Forbidden`: rol insuficiente o intento de acceso a pedido ajeno.
- `404 Not Found`: recurso inexistente.
- `409 Conflict`: correo duplicado, stock insuficiente o pedido ya pagado.
- `429 Too Many Requests`: límite de tasa excedido (`60 req/15 min` en `/api/auth`, `300 req/15 min` en `/api`).
- `502 Bad Gateway` / `503 Service Unavailable`: fallo de comunicación con PayPal o BD desconectada.
