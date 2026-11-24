# Informe de Laboratorio 5: Desarrollo Full-Stack de E-commerce de eBooks con Pagos PayPal, WebSockets, Despliegue en Railway y Pruebas E2E en TestSprite

**Responsable:** José Luis Gil García  
**C.C.:** 1034988407  
**Correo institucional:** j.gil@udea.edu.co  
**Fecha:** 23 de Noviembre de 2026  
**Repositorio GitHub:** [https://github.com/JoseGG8/FSI_labs/tree/main](https://github.com/JoseGG8/FSI_labs/tree/main)  
**Carpeta de la práctica:** [https://github.com/JoseGG8/FSI_labs/tree/main/lab5](https://github.com/JoseGG8/FSI_labs/tree/main/lab5)

---

## 1. URLs de Producción Desplegadas (Railway)

| Servicio | URL Pública | Estado Verificado |
| :--- | :--- | :--- |
| **Frontend (Next.js App Router)** | https://ebookstore-web-production-b30982b2.up.railway.app | ✅ `HTTP 200` en `/`, `/auth`, `/carrito`, `/pedidos`, `/admin` |
| **Backend API REST + Socket.IO (WSS)** | https://ebookstore-server-production.up.railway.app | ✅ `HTTP 200` en `/health` (`database: connected`), `/api/books`, `/api/payments/config` y handshake WSS |
| **Monitoreo de Salud** | https://ebookstore-server-production.up.railway.app/health | ✅ Activo con MongoDB Atlas |

---

## 2. Documentación Técnica Consolidada

- **Guía de inicio del monorepo:** [README.md](./README.md)
- **Diagrama de Arquitectura y Justificación:** [ARQUITECTURA.md](./ARQUITECTURA.md)
- **Documentación de Colecciones, API REST y WebSockets:** [DOCUMENTACION_API.md](./DOCUMENTACION_API.md)
- **Auditoría de Seguridad (OWASP Top 10):** [AUDITORIA_SEGURIDAD.md](./AUDITORIA_SEGURIDAD.md)
- **Especificación de Producto para QA (TestSprite):** [PRD.md](./PRD.md)
- **Plantillas de variables de entorno:** [.env.example](./.env.example), [server/.env.example](./server/.env.example), [web/.env.example](./web/.env.example)

---

## 3. Resumen de Arquitectura e Implementación

Se desarrolló una aplicación web *full-stack* en estructura monorepo (`lab5/web/` y `lab5/server/`) orientada exclusivamente al dominio de **venta de libros electrónicos (eBooks)**:

1. **Base de Datos (MongoDB Atlas + Mongoose):** cuatro colecciones normalizadas (`users`, `books`, `orders`, `payments`) y script `seed` idempotente con 8 eBooks iniciales en 6 categorías y cuentas demo (`cliente@ebookstore.com`, `admin@ebookstore.com`).
2. **Autenticación y Control de Acceso:** contraseñas hasheadas con `bcryptjs`, tokens JWT firmados y RBAC estricto (`cliente` vs. `administrador`). El registro público asigna exclusivamente el rol `cliente`.
3. **Control de Stock y Recálculo en Servidor:** `POST /api/orders` valida inventario y descuenta licencias de forma atómica (`findOneAndUpdate` con `$gte` + `$inc` y rollback compensatorio), recalculando `total` estrictamente desde precios en base de datos. Al cancelar un pedido desde `/admin`, el stock se restaura automáticamente.
4. **Pasarela de Pagos (PayPal Sandbox REST API v2):** creación (`POST /api/payments/paypal/order`) y captura (`POST /api/payments/paypal/capture`) controladas en servidor con verificación exacta de estado `COMPLETED`, monto, moneda e idempotencia (`PayPal-Request-Id` y control de `captureId`). Los enlaces `downloadUrl` permanecen bloqueados hasta confirmar `paymentStatus === 'pagado'`.
5. **Seguimiento en Tiempo Real (Socket.IO sobre WSS):** handshake autenticado por JWT con salas privadas (`user:<id>` y `admins`). Nuevas ventas y cambios de estado de envío digital se reflejan sin recargar tanto en `/admin` como en `/pedidos`.
6. **Interfaz de Usuario (Next.js 15 + Tailwind CSS):** catálogo con búsqueda y filtros (`/`), login/registro (`/auth`), carrito y checkout con `@paypal/react-paypal-js` (`/carrito`), historial/descargas (`/pedidos`) y panel administrativo de pedidos y stock (`/admin`).

---

## 4. Auditoría de Seguridad Aplicada

Durante la Fase 8 se ejecutó una auditoría basada en **OWASP Top 10** (detallada en [AUDITORIA_SEGURIDAD.md](./AUDITORIA_SEGURIDAD.md)):

- **Mitigación de NoSQL Injection:** middleware recursivo `sanitizeNoSql` que elimina operadores `$` y `.` en `req.body` y `req.query`.
- **Rate Limiting:** límites de `60 req/15 min` en `/api/auth` y `300 req/15 min` en `/api` con encabezados `X-RateLimit-*`.
- **Prevención XSS en URLs:** validación estricta `^https?:\/\/` en `coverImageUrl` y `downloadUrl`.
- **Protección de descargas y secretos:** `downloadUrl` oculto en catálogo público y en pedidos impagos; `NODE_ENV=production` configurado en Railway; archivos `.env` y `.env.local` excluidos de Git mediante `.gitignore` y `.railwayignore`.

---

## 5. Resultados de Pruebas Automatizadas (TestSprite)

Las pruebas E2E se ejecutaron con **TestSprite** apuntando al despliegue público de Railway (`https://ebookstore-web-production-b30982b2.up.railway.app`) utilizando [PRD.md](./PRD.md).

### 5.1. Iteración 1 — Diagnóstico inicial de despliegue
- **Hallazgo detectado por TestSprite:** el primer bundle compilado de `ebookstore-web` había quedado con `NEXT_PUBLIC_API_URL` sin esquema `https://` y `NEXT_PUBLIC_PAYPAL_CLIENT_ID` vacío porque el contenedor se reinició sin ejecutar un nuevo `next build` tras cambiar variables en Railway.
- **Corrección aplicada:** se añadió normalización defensiva `normalizeBaseUrl()` en `web/src/lib/api.js`, se validaron las variables `NEXT_PUBLIC_*` y se lanzó un rebuild limpio de ambos servicios en Railway, confirmando en vivo los valores dentro de los chunks servidos.

### 5.2. Iteración 2 — Ejecución de la Suite E2E (23/11/2026, 9:42 PM)

| Métrica | Resultado |
| :--- | :---: |
| **Total de pruebas ejecutadas** | **13** |
| **Pruebas aprobadas (Passed)** | **12** |
| **Pruebas fallidas (Failed)** | **1** |
| **Pruebas bloqueadas (Blocked)** | **0** |
| **Tasa de aprobación (Pass Rate)** | **92%** |

- **Análisis del único caso fallido:** al buscar `"ingenieria"` (sin tilde) en el catálogo, la consulta `$regex` no coincidía con el título `"Ingeniería de Prompts y Agentes de IA en Producción"` (con `í`), mostrando `"No se encontraron eBooks"`.
- **Corrección implementada y verificada en producción:** se incorporó `buildAccentInsensitiveRegex()` en `server/src/controllers/booksController.js` (normalización NFD + clases de caracteres acentuados para vocales y `ñ`, incluyendo también búsqueda sobre `category`) y se desplegó en Railway.
- **Validación directa contra producción tras el despliegue:**
  - `GET /api/books?q=ingenieria` -> `HTTP 200`, `total: 1` (`"Ingeniería de Prompts y Agentes de IA en Producción"`) ✅
  - `GET /api/books?q=sofia` -> `HTTP 200`, `total: 1` ✅
  - `GET /api/books?q=castano` -> `HTTP 200`, `total: 1` (`"Seguridad en APIs REST: JWT, OAuth2 y OWASP Top 10"`) ✅

---

## 6. Verificación de Secretos y Entregables

- [x] Monorepo organizado en `lab5/web/` y `lab5/server/`.
- [x] Plantillas `.env.example` completas en raíz, `server/` y `web/`.
- [x] Secretos reales (`server/.env`, `web/.env.local`) verificados como ignorados por Git (`.gitignore`) y por Railway (`.railwayignore`).
- [x] Servicios de Frontend y Backend activos y verificados en Railway con HTTPS/WSS.
- [x] Documentación de Arquitectura, API, Seguridad, PRD e Informe consolidados.

---

## 7. Reflexión Individual

> **[ESPACIO PARA COMPLETAR POR EL ESTUDIANTE ANTES DEL PUSH FINAL]**
>
> *Redacta aquí tu reflexión personal sobre la experiencia en el laboratorio. Puedes apoyarte en las siguientes preguntas guía:*
> - ¿Qué aprendizajes clave obtuviste al integrar un stack completo (Next.js, Express, MongoDB Atlas, PayPal Sandbox, Socket.IO y Railway) de forma iterativa con un agente de IA?
> - ¿Qué retos encontraste en la configuración de plataformas cloud (MongoDB Atlas, PayPal Developer, Railway, puertos y variables `NEXT_PUBLIC_*`) y cómo los resolviste?
> - ¿Qué valor aportaron la auditoría de seguridad (control de stock atómico, verificación de pagos en servidor, protección de descargas) y las pruebas automatizadas con TestSprite frente a las pruebas manuales?
> - ¿Qué mejorarías o escalarías si llevaras **eBookStore** a un entorno comercial real?

*(Escribe tu reflexión aquí y elimina este bloque de guía antes de entregar el repositorio el 24 de noviembre de 2026).*
