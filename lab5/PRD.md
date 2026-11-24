# PRD — eBookStore (E-commerce Full-Stack de Libros Electrónicos)

## 1. Visión General del Producto

**eBookStore** es una plataforma web *full-stack* para la **venta de libros electrónicos (eBooks)**, gestión de catálogo e inventario digital, pagos en línea validados en servidor mediante **PayPal Sandbox** y seguimiento en tiempo real de pedidos y entregas digitales con **Socket.IO**.

- **URL de Producción (Frontend — Railway):** `https://ebookstore-web-production-b30982b2.up.railway.app`
- **URL de Producción (Backend API — Railway):** `https://ebookstore-server-production.up.railway.app`
- **Monitoreo de Salud (Healthcheck):** `https://ebookstore-server-production.up.railway.app/health`

---

## 2. Roles de Usuario y Credenciales de Prueba

El sistema maneja dos roles estrictos (`cliente` y `administrador`):

| Rol | Correo de prueba | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- |
| **`cliente`** | `cliente@ebookstore.com` | `Cliente123!` | Explorar catálogo, filtrar eBooks, agregar al carrito, crear pedidos, pagar con PayPal Sandbox, consultar `/pedidos` y descargar eBooks solo tras pago confirmado. |
| **`administrador`** | `admin@ebookstore.com` | `Admin123!` | Todas las capacidades de lectura + acceso al panel `/admin` para gestionar inventario/stock de eBooks, visualizar pedidos globales en tiempo real y actualizar el estado de envío (`pendiente`, `procesando`, `enviado`, `entregado`, `cancelado`). |

> El registro público (`POST /api/auth/register` y formulario `/auth`) crea **exclusivamente** cuentas con rol `cliente`.

---

## 3. Rutas del Frontend (Next.js App Router)

1. **`/` — Catálogo Público de eBooks:**
   - Muestra tarjetas de libros electrónicos con portada, categoría, autor, formato (`PDF / EPUB`), número de páginas, precio en USD, indicador de stock (`Stock: N`, `Últimas N`, `Agotado`) y botón **Agregar**.
   - Búsqueda en tiempo real por título, autor o descripción (`q`).
   - Filtros por categoría (botones/pills dinámicos), ordenamiento (`Más recientes`, `Precio: menor a mayor`, `Precio: mayor a menor`, `Título A-Z`) y casilla `Solo con stock`.
   - Botón **Agregar** deshabilitado si el stock es `0` y con validación de tope de stock disponible.

2. **`/auth` — Inicio de Sesión y Registro:**
   - Pestañas **Iniciar sesión** y **Crear cuenta**.
   - Validación de nombre (mínimo 2 caracteres), email válido y contraseña (mínimo 6 caracteres).
   - Manejo claro de errores (credenciales inválidas, correo duplicado).
   - Al iniciar sesión como `administrador`, redirige a `/admin` (si no hay `redirect` explícito); como `cliente`, redirige al catálogo `/` o al `redirect` indicado.

3. **`/carrito` — Carrito de Compras y Checkout PayPal Sandbox:**
   - Lista de eBooks agregados con ajuste de cantidad (`+` / `-` limitado al stock), eliminación y subtotal en USD.
   - Campo obligatorio de **Correo para entrega digital** (prellenado con el correo del usuario autenticado) y campos opcionales de ciudad y país.
   - Si el usuario no está autenticado, muestra botón para ir a `/auth?redirect=/carrito`.
   - Paso 1: Botón **1. Confirmar pedido y habilitar PayPal** ejecuta `POST /api/orders`, reservando stock de forma atómica y calculando el total en el servidor.
   - Paso 2: Muestra botones de **PayPal SDK** (`@paypal/react-paypal-js`) integrados con `POST /api/payments/paypal/order` y `POST /api/payments/paypal/capture`.
   - Tras capturar y verificar el pago, limpia el carrito y habilita los enlaces de descarga digital.

4. **`/pedidos` — Mis Libros e Historial de Pedidos:**
   - Ruta protegida (solicita iniciar sesión si no está autenticado).
   - Lista los pedidos propios obtenidos de `GET /api/orders/me`.
   - Muestra barra de progreso de 4 pasos (`pendiente` -> `procesando` -> `enviado` -> `entregado`), insignia de estado de pago (`pendiente`, `pagado`, `fallido`) y conexión en vivo (`En vivo`).
   - **Regla de seguridad crítica:** los enlaces de descarga (`Descargar eBook`) solo se habilitan cuando `paymentStatus === 'pagado'`. Si el pedido está pendiente, muestra el botón **Completar pago con PayPal Sandbox**.
   - Actualización automática en tiempo real vía Socket.IO al cambiar el estado desde `/admin`.

5. **`/admin` — Panel de Gestión Administrativa:**
   - Ruta restringida exclusivamente a usuarios con `role === 'administrador'`. Un cliente autenticado o visitante sin sesión ve un mensaje de **Acceso solo para Administradores**.
   - Tarjetas KPI en tiempo real: Ingresos confirmados, Pedidos totales, Ventas pagadas (PayPal) y eBooks con stock bajo (`<= 5`).
   - Pestaña **Pedidos y Envíos**: filtro por estado, tabla de pedidos con selector de estado (`PATCH /api/orders/:id/status`) que notifica en vivo al cliente y restaura stock automáticamente si se cambia a `cancelado`.
   - Pestaña **Catálogo y Stock**: edición en línea de precio y stock (`PATCH /api/books/:id`), creación de nuevo eBook (`POST /api/books`) y eliminación (`DELETE /api/books/:id`).

---

## 4. Contrato de la API REST y WebSockets

| Método | Ruta | Acceso | Comportamiento esperado |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Público | Retorna `200 OK` con `{ ok: true, database: "connected" }`. |
| `POST` | `/api/auth/register` | Público | Registra un `cliente`, almacena `passwordHash` con `bcrypt` (nunca expone el hash) y retorna `201` + JWT. |
| `POST` | `/api/auth/login` | Público | Valida credenciales y retorna `200` + JWT + perfil del usuario. |
| `GET` | `/api/auth/me` | Autenticado | Retorna el perfil del usuario autenticado (`401` si falta/expiró el JWT). |
| `GET` | `/api/books` | Público | Retorna catálogo con filtros `q`, `category`, `minPrice`, `maxPrice`, `inStock`, `sort`. Oculta `downloadUrl` al público. |
| `GET` | `/api/books/:id` | Público | Detalle de eBook (`404` si no existe). Oculta `downloadUrl` al público. |
| `POST/PATCH/DELETE` | `/api/books` | Administrador | CRUD de catálogo y stock (`403` si intenta un `cliente`). |
| `POST` | `/api/orders` | Autenticado | Valida stock, descuenta inventario atómicamente, recalcula `total` estrictamente en servidor y retorna `201`. |
| `GET` | `/api/orders/me` | Autenticado | Historial propio del usuario. `downloadUrl` es `null` mientras `paymentStatus !== 'pagado'`. |
| `GET` | `/api/orders` | Administrador | Lista todos los pedidos del sistema (`403` para `cliente`). |
| `PATCH` | `/api/orders/:id/status` | Administrador | Actualiza estado del pedido, emite evento Socket.IO y restaura stock si pasa a `cancelado`. |
| `GET` | `/api/payments/config` | Público | Retorna modo (`sandbox`), moneda (`USD`) y `configured: true`. |
| `POST` | `/api/payments/paypal/order` | Autenticado (dueño) | Crea orden PayPal Sandbox usando `order.total` del servidor con idempotencia. |
| `POST` | `/api/payments/paypal/capture` | Autenticado (dueño) | Captura pago en PayPal, valida `COMPLETED`, monto y moneda exactos, evita cobros duplicados y habilita descargas. |
| `WSS` | Socket.IO (`/socket.io`) | JWT en handshake | Rechaza sin JWT; une clientes a `user:<id>` y admins a `admins`; emite `order:created`, `order:paid`, `order:status_updated`. |

---

## 5. Criterios de Aceptación y Casos de Prueba E2E (TestSprite)

1. **TC-01 — Salud del sistema y carga del catálogo:**
   - Abrir `/` carga la lista de eBooks (al menos 8 títulos iniciales), muestra categorías, precios y stock sin errores de consola.
   - `GET /health` devuelve `200` con `database: "connected"`.
2. **TC-02 — Búsqueda y filtros del catálogo:**
   - Buscar `"Node"` filtra los eBooks relevantes.
   - Seleccionar una categoría específica y marcar `Solo con stock` actualiza los resultados correctamente.
3. **TC-03 — Registro de cliente y prevención de escalada de privilegios:**
   - Registrar un nuevo usuario en `/auth` crea sesión activa con rol `cliente`, muestra su nombre en la barra superior y el indicador `En vivo` (Socket.IO).
   - Intentar registrar un correo ya existente muestra error claro (`409`).
4. **TC-04 — Inicio de sesión y manejo de credenciales inválidas:**
   - Iniciar sesión con contraseña incorrecta muestra error `Credenciales inválidas` (`401`).
   - Iniciar sesión con `cliente@ebookstore.com` / `Cliente123!` autentica correctamente.
5. **TC-05 — Carrito y creación de pedido con control de stock en servidor:**
   - Agregar un eBook al carrito, navegar a `/carrito`, ajustar cantidad y hacer clic en **1. Confirmar pedido y habilitar PayPal**.
   - El pedido se crea (`201`), el total coincide con precio × cantidad del servidor, y se renderiza la sección de pago PayPal.
6. **TC-06 — Protección de descargas en `/pedidos`:**
   - Un pedido con `paymentStatus: "pendiente"` aparece en `/pedidos` con el mensaje `Descarga bloqueada hasta confirmar pago` y el botón para completar pago con PayPal.
   - Ninguna respuesta pública de `/api/books` ni de pedidos pendientes expone `downloadUrl`.
7. **TC-07 — Control de acceso por roles (RBAC) en `/admin`:**
   - Un usuario no autenticado o con rol `cliente` que entra a `/admin` ve `Acceso solo para Administradores` y no puede invocar `PATCH /api/orders/:id/status` ni `POST /api/books` (`403`).
8. **TC-08 — Gestión administrativa de stock y pedidos (`/admin`):**
   - Iniciar sesión como `admin@ebookstore.com` / `Admin123!`, abrir `/admin`.
   - Ver KPIs, listar pedidos, cambiar el estado de un pedido (ej. `pendiente` -> `procesando` -> `enviado` o `cancelado`) y actualizar el stock de un eBook en la pestaña **Catálogo y Stock**.
9. **TC-09 — Integración PayPal Sandbox (creación de orden e idempotencia):**
   - Invocar `POST /api/payments/paypal/order` para un pedido propio retorna `paypalOrderId` válido.
   - Repetir la llamada para el mismo pedido impago retorna el mismo `paypalOrderId` (`idempotent: true`) sin duplicar órdenes.
10. **TC-10 — Navegación responsiva y cierre de sesión:**
    - Cerrar sesión limpia el token, desconecta el socket y vuelve a mostrar el botón `Ingresar`.
