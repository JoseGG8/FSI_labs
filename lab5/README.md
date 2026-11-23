# eBookStore — E-commerce Full-Stack de Libros Electrónicos (eBooks)

Aplicación web *full-stack* para la **venta de libros electrónicos (eBooks)**, gestión de catálogo digital, control de inventario/licencias en servidor, pagos verificados con **PayPal Sandbox** y seguimiento de pedidos y entregas digitales en tiempo real mediante **WebSockets**.

---

## Arquitectura y Stack Tecnológico

| Capa | Tecnología | Responsabilidad |
| :--- | :--- | :--- |
| **Frontend** (`web/`) | Next.js (App Router) + Tailwind CSS | Catálogo de eBooks, búsqueda y filtros, carrito y checkout con PayPal SDK, biblioteca de compras (`/pedidos`) y panel administrativo (`/admin`). |
| **Backend** (`server/`) | Node.js + Express + Socket.IO | API REST segura (JWT + bcrypt), control de stock y cálculo de totales en servidor, integración PayPal Sandbox y notificaciones en tiempo real. |
| **Base de Datos** | MongoDB Atlas + Mongoose | Persistencia en colecciones `users`, `books`, `orders` y `payments`. |
| **Pasarela de Pagos** | PayPal Sandbox (REST API v2) | Creación y captura de órdenes con validación de montos e idempotencia estricta en servidor. |
| **Despliegue y QA** | Railway + TestSprite | Despliegue en la nube (HTTPS/WSS) y pruebas automatizadas E2E basadas en `PRD.md`. |

---

## Estructura del Monorepo

```text
lab5/
├── web/                  # Frontend Next.js (App Router + Tailwind CSS)
│   └── .env.example      # Variables de entorno del cliente
├── server/               # Backend Express (API REST + Socket.IO + Mongoose)
│   └── .env.example      # Variables de entorno del servidor
├── .env.example          # Plantilla consolidada de variables de entorno
├── .gitignore            # Exclusión de secretos y artefactos de compilación
└── README.md             # Documentación general del proyecto
```

---

## Requisitos Previos

- **Node.js LTS** (v20+ recomendado) y **npm**
- **Git**
- Cuentas activas en:
  1. [MongoDB Atlas](https://www.mongodb.com/atlas) (clúster gratuito M0)
  2. [PayPal Developer](https://developer.paypal.com/) (App Sandbox + cuentas de prueba Business/Personal)
  3. [Railway](https://railway.app/) (para despliegue de `web/` y `server/`)
  4. [TestSprite](https://www.testsprite.com/) (para pruebas automatizadas E2E)

---

## Configuración Inicial de Variables de Entorno

1. Copia la plantilla del backend y completa tus credenciales (MongoDB Atlas, JWT y PayPal Sandbox):
   ```bash
   cp server/.env.example server/.env
   ```
2. Copia la plantilla del frontend:
   ```bash
   cp web/.env.example web/.env.local
   ```

> **Seguridad:** Nunca subas archivos `.env` o `.env.local` al repositorio Git. Todos los secretos reales están excluidos mediante `.gitignore`.

---

## Roles del Sistema

- **`cliente`**: Navega el catálogo de eBooks, realiza pedidos, paga con PayPal Sandbox, consulta su historial/descargas en `/pedidos` y recibe actualizaciones en tiempo real sobre la entrega digital.
- **`administrador`**: Gestiona el catálogo y el stock de licencias digitales, recibe notificaciones instantáneas de nuevas ventas y actualiza el estado de los pedidos/envíos desde `/admin`.

---

## Fases de Desarrollo

1. **Fase 1:** Preparación del entorno y estructura monorepo (`web/`, `server/`, `README.md`, `.env.example`).
2. **Fase 2:** Backend base en Express, modelos Mongoose (`users`, `books`, `orders`, `payments`) y script `seed`.
3. **Fase 3:** Autenticación (JWT + bcrypt), API REST de libros/pedidos y control de stock en servidor.
4. **Fase 4:** Integración de pagos con PayPal Sandbox (orden, captura, verificación de montos e idempotencia).
5. **Fase 5:** WebSockets con Socket.IO autenticado por JWT para seguimiento de pedidos en tiempo real.
6. **Fase 6:** Frontend en Next.js (catálogo, carrito, checkout PayPal, `/pedidos` y `/admin`).
7. **Fase 7:** Configuración y despliegue de `web/` y `server/` en Railway.
8. **Fase 8:** Auditoría de seguridad, `PRD.md` y pruebas E2E automatizadas en TestSprite.
9. **Fase 9:** Consolidación de entregables, arquitectura, documentación API e `INFORME_LABORATORIO.md`.
