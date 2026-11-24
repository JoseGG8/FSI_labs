# Arquitectura del Sistema y Justificación Técnica — eBookStore

Este documento describe la arquitectura *full-stack* de **eBookStore**, su topología de despliegue en la nube, los flujos de datos críticos y la justificación técnica de cada tecnología seleccionada.

---

## 1. Diagrama de Arquitectura General

```mermaid
flowchart TB
    subgraph Cliente["Navegador Web (Cliente / Administrador)"]
        UI["Frontend Next.js 15 (App Router + Tailwind CSS)"]
        PPSDK["PayPal JS SDK (@paypal/react-paypal-js)"]
        WSClient["Socket.IO Client (WSS + JWT)"]
    end

    subgraph Railway["Plataforma Cloud — Railway (HTTPS / WSS)"]
        WebSvc["Servicio ebookstore-web<br/>https://ebookstore-web-production-b30982b2.up.railway.app"]
        ApiSvc["Servicio ebookstore-server (Node.js + Express)<br/>https://ebookstore-server-production.up.railway.app"]
        SocketSvc["Socket.IO Server (Salas user:&lt;id&gt; y admins)"]
    end

    subgraph External["Servicios Externos Administrados"]
        Mongo["MongoDB Atlas (Mongoose)<br/>users · books · orders · payments"]
        PayPal["PayPal Sandbox REST API v2<br/>OAuth2 · Create Order · Capture"]
    end

    UI -->|HTTPS| WebSvc
    UI -->|REST API JSON + Bearer JWT| ApiSvc
    WSClient <-->|WSS Handshake JWT| SocketSvc
    ApiSvc --- SocketSvc
    ApiSvc -->|TLS / Mongoose ODM| Mongo
    ApiSvc -->|HTTPS OAuth2 + Idempotency Headers| PayPal
    PPSDK <-->|Aprobación de pago comprador Sandbox| PayPal
```

---

## 2. Flujo de Secuencia: Compra, Pago PayPal e Interacción en Tiempo Real

```mermaid
sequenceDiagram
    actor C as Cliente (Web)
    participant API as Express API (Railway)
    participant DB as MongoDB Atlas
    participant PP as PayPal Sandbox API v2
    participant IO as Socket.IO (WSS)
    actor A as Administrador (/admin)

    C->>API: POST /api/orders (items, emailDelivery) + JWT
    API->>DB: Descuento atómico de stock ($gte + $inc)
    API->>DB: Guarda Order (total calculado en servidor, paymentStatus: pendiente)
    API->>IO: emitNewOrder -> sala admins & user:<id>
    IO-->>A: Evento order:created (en vivo)
    API-->>C: 201 Created (downloadUrl: null)

    C->>API: POST /api/payments/paypal/order (orderId)
    API->>PP: POST /v2/checkout/orders (order.total del servidor)
    PP-->>API: paypalOrderId
    API->>DB: Guarda Payment (status: creado)
    API-->>C: paypalOrderId

    C->>PP: Aprueba pago con cuenta Personal Sandbox
    C->>API: POST /api/payments/paypal/capture (orderId, paypalOrderId)
    API->>PP: POST /v2/checkout/orders/{id}/capture
    PP-->>API: COMPLETED + amount + currency + captureId
    API->>API: Verifica monto, moneda e idempotencia
    API->>DB: Payment=capturado, Order.paymentStatus=pagado, status=procesando
    API->>IO: emitOrderPaid -> sala admins & user:<id>
    IO-->>A: Evento order:paid (nueva venta confirmada)
    IO-->>C: Evento order:paid (descargas desbloqueadas)
    API-->>C: 200 OK (order con downloadUrl habilitado)

    A->>API: PATCH /api/orders/:id/status (status: enviado/entregado)
    API->>DB: Actualiza Order.status
    API->>IO: emitOrderStatusUpdated -> user:<id> & admins
    IO-->>C: Evento order:status_updated (actualiza /pedidos al instante)
```

---

## 3. Justificación del Stack Tecnológico

| Tecnología | Rol en el Proyecto | Justificación Técnica |
| :--- | :--- | :--- |
| **Next.js 15 (App Router) + Tailwind CSS** | Frontend (`lab5/web`) | Permite estructurar vistas modulares (`/`, `/auth`, `/carrito`, `/pedidos`, `/admin`) con generación optimizada de bundles, enrutamiento declarativo, carga rápida y estilos utilitarios consistentes y responsivos sin sobrecarga de CSS manual. |
| **Node.js + Express** | Backend API REST (`lab5/server`) | Entorno asíncrono ideal para I/O intensivo (consultas a MongoDB Atlas, llamadas HTTP a PayPal y manejo concurrente de peticiones). Express facilita una arquitectura limpia por capas (rutas, controladores, middlewares de seguridad y manejo centralizado de errores). |
| **MongoDB Atlas + Mongoose** | Base de Datos Documental | El modelo documental encaja naturalmente con pedidos que embeben snapshots de ítems comprados (`items[]` con precio unitario y título al momento de compra), garantizando consistencia histórica aunque cambie el precio del catálogo. Mongoose aporta validación de esquemas, índices y operaciones atómicas (`findOneAndUpdate` con `$gte` + `$inc`) para evitar sobreventa. |
| **PayPal Sandbox (REST API v2 + JS SDK)** | Pasarela de Pagos | Separa la experiencia de aprobación en el navegador (`@paypal/react-paypal-js`) de la creación y captura autoritativa en el servidor. Permite validar montos, moneda y `captureId` fuera del alcance del cliente, incorporando cabeceras `PayPal-Request-Id` para idempotencia y pruebas seguras sin dinero real. |
| **Socket.IO** | Comunicación en Tiempo Real | Provee mensajería bidireccional de baja latencia sobre `WSS` (con respaldo automático a *long-polling*), autenticación en el *handshake* mediante JWT y segmentación por salas (`user:<id>` y `admins`), eliminando la necesidad de *polling* constante para monitorear nuevas ventas y cambios de estado. |
| **Railway** | Despliegue Cloud (PaaS) | Simplifica el despliegue independiente de los dos servicios del monorepo (`ebookstore-server` y `ebookstore-web`) con certificados HTTPS/WSS automáticos, inyección segura de variables de entorno, monitoreo de salud (`/health`) y despliegues rápidos mediante CLI (`railway up`). |
| **TestSprite** | Pruebas Automatizadas E2E | Genera y ejecuta suites de pruebas *end-to-end* guiadas por un `PRD.md` directamente contra el entorno desplegado en producción, detectando defectos reales de integración (como inyección de variables en build y búsquedas sin tildes). |

---

## 4. Decisiones Clave de Seguridad e Integridad

1. **Verdad única en el servidor:** El total del pedido (`Order.total`) y los montos enviados a PayPal se calculan siempre a partir de los precios en MongoDB, ignorando cualquier monto enviado desde el navegador.
2. **Control atómico de inventario:** `POST /api/orders` descuenta licencias mediante `findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })` con rollback compensatorio si falla algún ítem, y `PATCH /api/orders/:id/status` restaura stock al cancelar.
3. **Protección de propiedad digital:** `downloadUrl` nunca se expone en el catálogo público (`GET /api/books`) ni en pedidos impagos (`paymentStatus !== 'pagado'`).
4. **Defensa en profundidad:** Contraseñas hasheadas con `bcryptjs`, JWT con verificación contra BD, RBAC estricto (`cliente` vs. `administrador`), `helmet`, sanitización contra NoSQL Injection (`$`/`.`), validación de esquemas `http(s)://` contra XSS y limitación de tasa (*rate limiting*).
