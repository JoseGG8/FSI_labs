# AeroLink Airline CRM - Dashboard de Revenue Management y Gestión Comercial (Lab 3)

Dashboard interactivo de CRM y Revenue Management para aerolíneas B2B, diseñado para **Directores Comerciales (CCO)**, **Route Managers** y **Revenue Managers**. Permite gestionar el ciclo completo de reservas de vuelos, acuerdos corporativos, bloques de asientos para agencias mayoristas y ventas individuales ejecutivas, integrando indicadores aeronáuticos en tiempo real (IATA) y un Copiloto de Inteligencia Artificial conectado con **N8N**.

Inspirado con estricta fidelidad en el sistema de diseño **BizLink**: estética minimalista y limpia, esquinas redondeadas, sombras suaves, paleta crema/hueso (`#F6F4EB`), tarjetas blancas, acentos en naranja/coral (`#FF6B4A` / `#F97316`), verde para éxito (`#10B981`) y azul para elementos informativos (`#3B82F6`).

---

## 📚 Documentos del Proyecto

| Documento | Descripción |
| :--- | :--- |
| 📘 **[DOCUMENTACION_FUNCIONAL.md](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/DOCUMENTACION_FUNCIONAL.md)** | **Manual Funcional Completo desde el punto de vista del usuario.** Guía paso a paso de pantallas, flujos de trabajo (creación, emisión, cancelación), navegación y uso del Copiloto IA. |
| 📋 **[REGLAS_NEGOCIO.md](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/REGLAS_NEGOCIO.md)** | **Políticas operativas y tarifarias oficiales de la aerolínea.** Familias tarifarias (Light, Clásica, Flex), políticas de equipaje, check-in, retrasos, no-show, devoluciones e instrucciones de atención al cliente. |
| 🗄️ **[estructura_datos.md](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/estructura_datos.md)** | **Modelo de datos y especificación técnica de entidades:** Usuarios/Route Managers, Etapas del Pipeline, Clientes B2B y Oportunidades/Reservas de Vuelo. |
| 💾 **[mockData.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/data/mockData.js)** | **Tienda central de datos simulados:** 4 gestores de rutas, 5 etapas de reserva, 10 clientes corporativos/OTAs y 38 acuerdos de vuelo realistas. |

---

## 🚀 Cómo Ejecutar la Aplicación

Desde la carpeta `lab3`:

```bash
# 1. Instalar dependencias (si no se han instalado)
npm install

# 2. Iniciar el servidor de desarrollo Vite
npm run dev

# 3. Compilar para producción (opcional)
npm run build
```

La aplicación estará disponible en `http://localhost:5173/`.

---

## 📁 Estructura del Proyecto

```
lab3/
├── DOCUMENTACION_FUNCIONAL.md   # Manual y Documentación Funcional del Dashboard (Usuario)
├── REGLAS_NEGOCIO.md            # Reglas de negocio, políticas y protocolos de atención
├── estructura_datos.md          # Especificación de entidades y esquemas JSON
├── mockData.js                  # Acceso directo para editar datos simulados
├── package.json                 # Dependencias y scripts de ejecución
├── vite.config.js               # Configuración del bundler Vite
├── index.html                   # HTML con tipografías Inter y Plus Jakarta Sans
└── src/
    ├── main.jsx                 # Punto de entrada de React
    ├── App.jsx                  # Estado central reactivo, filtros multidimensionales y eventos
    ├── index.css                # Sistema de diseño CSS moderno (estilo BizLink)
    ├── data/
    │   └── mockData.js          # TIENDA CENTRAL DE DATOS SIMULADOS
    ├── utils/
    │   └── calculations.js      # MOTOR DINÁMICO DE KPIS Y REVENUE MANAGEMENT
    └── components/
        ├── Sidebar.jsx          # Barra lateral (Brand, Hubs operativos, Route Managers)
        ├── TopBar.jsx           # Buscador predictivo, ordenamiento, 'Mis Rutas' y '+ Nueva Reserva'
        ├── TopAnalyticsBanner.jsx # Banner analítico (Actividad semanal, Win Rate, accesos rápidos)
        ├── KpiCards.jsx         # 7 KPIs ejecutivos: 3 de Revenue Management + 4 Comerciales
        ├── PipelineBoard.jsx    # Tablero Kanban con etapas y tarjeta destacada Prime Aviation
        ├── ChartsSection.jsx    # Gráfico de barras, curva mensual, matriz de rutas y leaderboard
        ├── DealsTable.jsx       # Registro tabular de vuelos con edición interactiva inline
        ├── DealModal.jsx        # Modal para crear nuevas reservas (+ crear nueva agencia)
        ├── DealDetailModal.jsx  # Modal de inspección, edición, confetti al ganar y eliminación
        └── N8nChatWidget.jsx    # Ventana de Copiloto IA conectada con Webhook de N8N (POST)
```

---

## ✈️ Reglas de Negocio de la Aerolínea (AeroAndina / AeroLink)

El dashboard y la operación comercial se rigen por las directrices documentadas en `REGLAS_NEGOCIO.md`:

### 1. Familias Tarifarias y Emisión
* **Tarifa Light:** Solo incluye artículo personal. No permite cambios ni reembolsos. Selección de asiento con costo adicional.
* **Tarifa Clásica:** Incluye artículo personal y equipaje de mano (10 kg). Permite 1 cambio de fecha sin penalización (aplica diferencia de tarifa). No reembolsable.
* **Tarifa Flex:** Incluye artículo personal, equipaje de mano (10 kg) y equipaje de bodega (23 kg). Permite cambios ilimitados sin penalización y reembolso del 80% si se solicita con al menos 24 horas de antelación.
* **Tiempo Límite de Emisión:** Las reservas no pagadas expiran automáticamente a las **2 horas** de su creación.

### 2. Política de Equipaje
* **Artículo Personal (Bajo el asiento):** Máx. 40 x 30 x 15 cm. Incluido en todas las tarifas.
* **Equipaje de Mano (Cabina):** Peso máx. 10 kg, dimensiones 55 x 35 x 25 cm.
* **Equipaje Facturado (Bodega):** Peso máx. 23 kg, suma lineal máx. 158 cm.
* **Exceso y Sobrepeso:** 24 kg a 32 kg aplica tarifa plana de $35 USD. Pieza adicional de bodega: $40 USD online previa al vuelo / $60 USD en mostrador del aeropuerto.

### 3. Check-in y Abordaje
* **Online (Web y App):** Habilitado desde 48 horas hasta 2 horas antes de la salida programada (gratuito).
* **En Aeropuerto:** Abierto desde 3 horas hasta 60 min antes (vuelos nacionales) y 75 min antes (internacionales).
* **Cierre de Puertas:** **20 minutos antes del despegue** sin excepción.

### 4. Demoras, Cancelaciones y No-Show
* **Demora 1 a 2 horas:** Actualización por SMS/email y asistencia en sala.
* **Demora 2 a 4 horas:** Vale digital de alimentación y bebidas ($15 USD).
* **Demora > 4 horas o cancelación atribuible:** Reubicación sin costo + bono 25% de compensación para futuros viajes, o reembolso del 100% (+ noche de hotel si la espera pasa la noche).
* **Vuelo Perdido (No-Show):** Aviso previo al cierre permite rescate con penalidad de $50 USD + diferencia de tarifa. No-show total pierde validez en Light/Clásica o reactivación por $75 USD en Flex.
* **Equipaje Extraviado:** Reporte PIR obligatorio al llegar. $30 USD diarios por demora (hasta 3 días). Pérdida definitiva tras 21 días (indemnización hasta $1,400 USD).
* **Derecho de Retracto:** 24 horas con reembolso del 100% si el vuelo no despega dentro de los siguientes 7 días.

---

## 👤 Perspectiva del Usuario y Operación del Dashboard

La plataforma está diseñada a la medida del usuario operativo, permitiéndole navegar y ejecutar acciones con retroalimentación visual inmediata:

### 1. Perfiles de Usuario
* **Directora Comercial / CCO (*Iona Rollins*):** Supervisa el volumen global de ingresos, el cumplimiento de la cuota mensual de rutas y el factor de ocupación de la red.
* **Revenue Manager (*Sandra Perry*):** Monitorea la matriz de corredores aéreos, detecta rutas con Load Factor inferior al 82% y optimiza métricas RASK y Yield.
* **Route Managers (*Antony Cárdenas / Cara Carr*):** Gestionan acuerdos para rutas clave (BOG-MAD, MDE-MIA), dan seguimiento al pipeline y cierran ventas.
* **Ejecutivo Corporativo B2B (*Jamal Connolly*):** Atiende agencias mayoristas (OTAs) y operadores de vuelos chárter.

### 2. Tres Modos de Visualización (Pestañas de Vista)
1. **Flight Pipeline (Tablero Kanban):**
   * Cuatro columnas del ciclo comercial: *Cotización / Cupos (s1)*, *Tarifas Corporativas (s3)*, *Bloqueo Asientos (s2)* y *Vuelo Emitido (s4)*.
   * Tarjetas estándar con número de vuelo, ruta, importe, plazas (individual con asiento o grupal) y responsable.
   * Tarjeta destacada oscura para acuerdos de alta gama (*Prime Aviation & Charter Jets*).
2. **Revenue & Yield (Analítica y Rendimiento):**
   * Gráfico de barras por etapa del embudo.
   * Curva de evolución de ingresos mes a mes comparada con la cuota proyectada.
   * **Matriz de Revenue Management por Ruta:** Análisis por corredor aéreo con distancia en km, capacidad ofertada, pasajeros vendidos, Load Factor (% vs. Meta IATA 82%), RASK (€/ASK) y Yield (€/RPK).
   * **Leaderboard del Equipo:** Tarjetas de cumplimiento de cuota individual por Route Manager.
3. **Registro de Vuelos (Tabla Interactiva):**
   * Listado completo con filtros rápidos por estado (*Todos*, *En Proceso*, *Emitidos*, *Cancelados*).
   * Selectores desplegables para cambiar la etapa y el estado en caliente directamente desde la fila.

### 3. Flujos de Trabajo Clave del Operador
* **Crear Nueva Reserva:** Clic en `+ Nueva Reserva`. Permite seleccionar agencias existentes o crear una nueva en el acto (`+ Crear nueva agencia`). Si se ingresa 1 pasajero, habilita la asignación de asiento unitario (ej. `2A`); si son varios, permite elegir tipo de cabina.
* **Cerrar Venta / Emitir Billete:** Al seleccionar el estado `Vuelo Emitido ✈️ (Won)` desde el modal de detalle o la tabla, se dispara una lluvia festiva de confeti, la reserva avanza a la etapa correspondiente y **se recalculan instantáneamente todos los KPIs y gráficos**.
* **Cancelar Reserva / No-Show:** Al cambiar a `Cancelado (Lost)`, el sistema solicita obligatoriamente el motivo de cancelación (ej. *precio competencia*, *no-show*, *cancelación de evento*), recalculando el Win Rate.
* **Filtro "Mis Rutas" y Búsqueda Predictiva:** Filtro rápido para el usuario activo y buscador en vivo por código IATA, ruta, cliente o sector.
* **Restaurar Datos (Reset Data):** Botón `Reset Data` en la barra de vistas para volver a los 38 acuerdos iniciales de prueba en cualquier momento.

---

## 📊 Métricas de Revenue Management Aéreo y Motor de Cálculo Dinámico

Todos los valores del dashboard provienen de funciones puras en `src/utils/calculations.js` y se recalculan en tiempo real sin requerir recargar la página:

### Métricas de Vuelo (Revenue Management)
* **Load Factor (Factor de Ocupación %):**
  $$\text{Load Factor} = \left(\frac{\text{Asientos Vendidos (Pax)}}{\text{Asientos Disponibles en Flota}}\right) \times 100$$
  *Meta IATA fijada en **82.0%** con alerta visual (verde si cumple, coral si está bajo meta).*
* **RASK / PRASK (Revenue per Available Seat Kilometer):**
  $$\text{RASK} = \frac{\text{Total Flight Revenue}}{\text{Total ASK (Capacidad} \times \text{Distancia en Km)}}$$
* **Passenger Yield (Rendimiento por Pasajero-Km):**
  $$\text{Yield} = \frac{\text{Total Flight Revenue}}{\text{Total RPK (Pax Vendidos} \times \text{Distancia en Km)}}$$
* **Identidad Fundamental de Revenue Management:**
  $$\text{RASK} = \text{Yield} \times \text{Load Factor}$$

### Métricas Comerciales Estándar
* **Total Flight Revenue:** Suma monetaria de todos los acuerdos ganados (`status = 'won'`).
* **Active Bookings:** Conteo de reservas abiertas (`status = 'open'`) y valor del pipeline.
* **Flight Win Rate:** Porcentaje de acuerdos materializados sobre el total de cerrados: $\frac{\text{Won}}{\text{Won} + \text{Lost}} \times 100$.
* **Avg Booking Size:** Promedio económico de los tratos ganados y porcentaje de cuota global alcanzada.

---

## 🤖 Asistente de IA Copilot Integrado con N8N

El dashboard cuenta con una ventana de chat inteligente accesible desde el botón flotante **`IA Copilot`** en la esquina inferior derecha:

* **Endpoint Oficial:** `POST https://lab3fsi.app.n8n.cloud/webhook/5581c101-57a2-445d-bd21-08705955f777`
* **Envío de Contexto en Tiempo Real (`crmContext`):** Con cada pregunta del usuario, el widget envía automáticamente el estado vivo del CRM:
  * Load Factor actual, RASK y Yield.
  * Rutas con cumplimiento de meta del 82%.
  * Total Revenue emitido, valor del pipeline y reservas abiertas.
  * Resumen de etapas y cuotas de cada Route Manager.
* **Chips de Preguntas Rápidas:** Botones preconfigurados para consultar métricas clave con un solo clic.
* **Soporte de Formato:** Renderizado de texto enriquecido en Markdown (listas, negritas y saltos de línea).
* **Menú de Configuración (⚙️):** Permite inspeccionar o modificar la URL del Webhook de N8N en vivo (guardado en `localStorage`) y restaurar la dirección por defecto.
* **Controles de Ventana:** Modo expandido (`expanded mode` para pantallas grandes), limpieza de conversación y manejo amigable de errores de workflow.
