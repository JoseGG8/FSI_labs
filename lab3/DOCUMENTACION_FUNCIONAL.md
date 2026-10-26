# Manual y Documentación Funcional del Dashboard CRM AeroLink
### Sistema Comercial y Revenue Management para Aerolíneas B2B

---

## 1. Ficha Técnica y Resumen Ejecutivo

* **Nombre de la Aplicación:** AeroLink Airline CRM & Revenue Management Dashboard (BizLink Style).
* **Entorno de Ejecución:** Aplicación Web Interactiva basada en React (Vite) y CSS de alta fidelidad.
* **Usuarios Objetivo:** Directora Comercial / CCO (*Iona Rollins*), Route Managers (*Gestores de Rutas/Hubs*), Revenue Managers (*Gestores de Rendimiento y Tarifas*) y Ejecutivos de Cuentas Corporativas B2B.
* **Propósito del Sistema:** Proporcionar una plataforma integral, reactiva y visual para monitorear el rendimiento comercial de la red de vuelos, gestionar reservas de grupos y acuerdos corporativos B2B, auditar indicadores aeronáuticos (Load Factor, RASK, Yield) y automatizar consultas comerciales a través de un Copiloto de Inteligencia Artificial conectado a N8N.

```
                    ┌──────────────────────────────────────────────┐
                    │        AEROLINK AIRLINE CRM DASHBOARD        │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌──────────────────┬──────────────┴──────────────┬──────────────────┐
         │                  │                             │                  │
         ▼                  ▼                             ▼                  ▼
┌─────────────────┐ ┌───────────────┐             ┌───────────────┐ ┌─────────────────┐
│ Flight Pipeline │ │Revenue & Yield│             │Registro Vuelos│ │   IA Copilot    │
│  (Tablero B2B)  │ │  (Analítica)  │             │   (Tabular)   │ │  (Workflow N8N) │
└─────────────────┘ └───────────────┘             └───────────────┘ └─────────────────┘
```

---

## 2. Perfil del Usuario y Roles Operativos

El dashboard está diseñado pensando en las necesidades diarias del personal que manipula la información comercial y operativa de los vuelos:

| Rol de Usuario | Persona Representativa | Funciones Principales en el Dashboard |
| :--- | :--- | :--- |
| **Director Comercial (CCO)** | *Iona Rollins* | Supervisa ingresos totales de la red, cumplimiento de cuotas de venta, evolución mensual de ventas y factor de ocupación global. |
| **Revenue Manager** | *Sandra Perry* | Controla la matriz de rendimiento por ruta (Load Factor vs. Meta IATA 82%, RASK y Yield), optimiza el inventario de asientos disponibles y analiza cancelaciones. |
| **Route Manager** | *Antony Cárdenas / Cara Carr* | Gestiona negociaciones de cupos para rutas específicas (ej. BOG-MAD o MDE-MIA), da seguimiento a fechas límite de emisión y cambia estados de reservas. |
| **Ejecutivo Corporativo B2B** | *Jamal Connolly* | Registra nuevas reservas de agencias mayoristas, gestiona solicitudes de chárters y clientes corporativos con acuerdos de tarifas especiales. |

---

## 3. Arquitectura Visual y Navegación de la Interfaz

La pantalla principal se estructura en 5 zonas de trabajo ergonómicas diseñadas para minimizar clics y ofrecer información en tiempo real:

```
┌──────────────┬────────────────────────────────────────────────────────────────┐
│  SIDEBAR     │ TOPBAR (Búsqueda predictiva, Filtro Rutas, Orden, + Nueva Res) │
│              ├────────────────────────────────────────────────────────────────┤
│  • Brand     │ BANNER ANALÍTICA (Actividad semanal, Win Rate, Acceso rápido)  │
│  • Navegac.  ├────────────────────────────────────────────────────────────────┤
│  • Hubs      │ PESTAÑAS DE VISTA (Pipeline | Revenue & Yield | Reg. Vuelos)    │
│  • Miembros  ├────────────────────────────────────────────────────────────────┤
│  • CCO Foot  │ KPI CARDS (Load Factor, RASK, Yield, Total Rev, Active, Win)   │
│              ├────────────────────────────────────────────────────────────────┤
│              │ ÁREA CENTRAL SEGÚN VISTA (Kanban / Gráficos / Tablas)          │
└──────────────┴────────────────────────────────────────────────────────────────┘
                                                                ┌───────────────┐
                                                                │ [IA Copilot]  │
                                                                └───────────────┘
```

### 3.1 Barra Lateral Fija (Sidebar)
Ubicada en el margen izquierdo, organiza el acceso a módulos y filtros rápidos:
1. **Identidad Corporativa:** Logotipo de AeroLink CRM con icono aeronáutico coral (`#FF6B4A`).
2. **Menú de Módulos:**
   * **Flight Pipeline:** Acceso directo al tablero Kanban de etapas comerciales.
   * **Revenue & Yield:** Acceso a los gráficos de ingresos, cuotas y matriz de rutas.
   * **Flight Bookings:** Acceso al registro de acuerdos y billetes en formato tabla.
   * **Flight Operations:** Muestra un contador numérico con las reservas abiertas en proceso.
   * **Activity Log & Settings:** Opciones de auditoría y configuración de red.
3. **Bases & Hubs Operativos:** Indicadores de los centros de conexión de la aerolínea (Bogotá BOG con badge de volumen, Madrid MAD, Miami MIA, Medellín MDE).
4. **Filtro de Route Managers (Vendedores):** Lista con fotografía, nombre, rol y estado en línea de cada gestor comercial. Al hacer clic sobre un miembro, **todo el dashboard se filtra automáticamente** para mostrar solo sus reservas y cifras individuales.
5. **Pie de Usuario Activo:** Muestra la sesión de *Iona Rollins (CCO)* con botón para cerrar sesión.

---

### 3.2 Barra Superior (TopBar)
Permite buscar y ejecutar acciones globales sin importar en qué vista se encuentre:
* **Buscador en Vivo (Omnibox):** Caja de texto con capacidad predictiva. Filtra instantáneamente por:
  * Número de vuelo IATA (ej. `AL-120`, `AL-650`, `AL-VIP1`).
  * Corredor o Ruta (ej. `BOG-MAD`, `MDE-MIA`, `JFK`).
  * Nombre de la Agencia o Cliente B2B (ej. `El Corte Inglés`, `Expedia`, `Santander`).
  * Industria o Sector (ej. `Agencia Mayorista`, `Banca`, `Chárter`).
  * Botón **✕** para limpiar la búsqueda con un solo clic.
* **Botón Ordenar por Revenue / Fecha (`ArrowUpDown`):** Alterna secuencialmente entre *Mayor Revenue*, *Menor Revenue* y *Más Recientes*.
* **Selector Desplegable de Etapa:** Filtra el tablero o la tabla por una etapa específica del ciclo de venta.
* **Botón de Filtro Rápido "Mis Rutas":** Activa con un clic el filtro asignado al usuario activo (*Antony Cárdenas - Route Manager u1*).
* **Botón Primario "+ Nueva Reserva":** Abre la ventana modal para ingresar un nuevo expediente comercial.

---

### 3.3 Banner Superior de Analítica Rápida (Top Analytics Banner)
Ofrece un pulso inmediato del rendimiento semanal:
1. **Mini-gráfico de Actividad Semanal:** Muestra pares de barras por día (Lunes a Viernes) comparando solicitudes de vuelo recibidas frente a cupos confirmados.
2. **Gauge Radial de Materialización (Win Rate):** Indicador semicircular SVG dinámico que refleja el porcentaje de vuelos confirmados frente a cotizados.
3. **Métrica de Reservas Activas:** Tarjeta interactiva con el total de acuerdos en trámite. Al hacer clic, redirige a la vista *Pipeline*.
4. **Métrica de Revenue Emitido:** Tarjeta con el importe total acumulado en pasajes emitidos. Al hacer clic, redirige a la vista *Revenue & Yield*.

---

### 3.4 Pestañas de Vista y Modo de Trabajo
Permiten alternar la forma de interactuar con la información comercial:
* **Flight Pipeline:** Organización visual por columnas Kanban según la etapa de venta.
* **Revenue & Yield:** Gráficos analíticos, proyecciones mensuales y matriz de Revenue Management por ruta.
* **Registro de Vuelos:** Vista tabular para edición rápida en lote y auditoría.
* **Botón Reset Data (`RotateCcw`):** Permite reiniciar la base de datos simulada en memoria a sus valores predeterminados de fábrica en caso de requerir una demostración limpia.

---

## 4. Cuadro de Indicadores Clave (KPIs)

El dashboard cuenta con 7 tarjetas de métricas divididas en dos categorías: **Rendimiento de Vuelo (Revenue Management)** y **Métricas Comerciales y Pipeline**.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           REVENUE MANAGEMENT AÉREO                               │
│  Meta de Red IATA: Load Factor ≥ 82.0%                                           │
├─────────────────────────┬────────────────────────────┬───────────────────────────┤
│ 1. Load Factor (%)      │ 2. RASK / PRASK (€/ASK)    │ 3. Passenger Yield (€/RPK)│
│    Ocupación vs Meta    │    Ingreso por Asiento-Km  │    Rendimiento Pasajero   │
└─────────────────────────┴────────────────────────────┴───────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                     MÉTRICAS COMERCIALES & PIPELINE DE VENTA                     │
├─────────────────────┬─────────────────────┬───────────────────┬──────────────────┤
│ 4. Total Revenue    │ 5. Active Bookings  │ 6. Flight Win Rate│ 7. Avg Deal Size │
│    Pasajes Emitidos │    En Negociación   │    % Ganados vs C │    Promedio/Trato│
└─────────────────────┴─────────────────────┴───────────────────┴──────────────────┘
```

### 4.1 Métricas Nativas de Revenue Management Aéreo

#### 1. Load Factor (Factor de Ocupación de Pasajeros)
* **¿Qué mide?:** El porcentaje de asientos efectivamente vendidos frente a la capacidad total ofertada en la flota de vuelos ganados.
* **Fórmula:**
  $$\text{Load Factor} = \left(\frac{\text{Asientos Vendidos (Pax)}}{\text{Asientos Disponibles en Flota}}\right) \times 100$$
* **Visualización en el Dashboard:**
  * Indicador porcentual dinámico (ej. `85.2%`).
  * Marcador de meta IATA en el **82.0%**. Si el valor es mayor o igual a 82%, se muestra en verde con icono de verificación (`Meta ✓`); si es inferior, se resalta en tono coral de advertencia.
  * Barra de progreso con línea de referencia visual fijada en el 82%.
  * Desglose inferior: Conteo exacto de asientos vendidos vs. capacidad disponible.

#### 2. RASK / PRASK (Revenue per Available Seat Kilometer)
* **¿Qué mide?:** El ingreso unitario obtenido por cada asiento que la aerolínea transporta a lo largo de un kilómetro, independientemente de si el asiento fue ocupado o vacío.
* **Fórmula:**
  $$\text{RASK} = \frac{\text{Total Flight Revenue (€)}}{\text{Total ASK (Asientos Disponibles} \times \text{Distancia en Km)}}$$
* **Visualización:**
  * Expresión monetaria en euros con 3 decimales (ej. `€ 0.021 / ASK`).
  * Píldora complementaria expresada en centavos de euro (`2.1 ¢/ASK`).
  * Detalle de la capacidad de red ofertada en millones de ASK (ej. `18.42M ASK`).

#### 3. Passenger Yield (Rendimiento por Pasajero-Kilómetro)
* **¿Qué mide?:** El precio o ingreso medio que paga un pasajero por cada kilómetro que efectivamente vuela.
* **Fórmula:**
  $$\text{Yield} = \frac{\text{Total Flight Revenue (€)}}{\text{Total RPK (Pasajeros Pagos} \times \text{Distancia en Km)}}$$
* **Relación Matemática Fundamental:**
  $$\text{RASK} = \text{Yield} \times \text{Load Factor}$$
* **Visualización:**
  * Valor formateado a 3 decimales (ej. `€ 0.025 / RPK`).
  * Equivalencia en centavos (`2.5 ¢/RPK`).
  * Tráfico efectivo de pasajeros en millones de RPK (ej. `15.70M RPK`).

---

### 4.2 Métricas Comerciales y de Embudo de Ventas

| KPI Comercial | Definición Funcional | Fuente de Datos / Cálculo |
| :--- | :--- | :--- |
| **Total Flight Revenue** | Ingresos brutos facturados por billetes y reservas confirmadas. | Suma del campo `amount` de todos los acuerdos con `status = 'won'`. |
| **Active Bookings** | Número de acuerdos y bloques de cupos actualmente en negociación. | Conteo de acuerdos con `status = 'open'`. Muestra además el valor acumulado en el pipeline. |
| **Flight Win Rate** | Tasa de éxito o conversión comercial de la aerolínea. | $\frac{\text{Vuelos Won}}{\text{Vuelos Won} + \text{Vuelos Lost}} \times 100$. Informa cuántos se emitieron vs. cancelaron. |
| **Avg Booking Size** | Valor económico promedio por acuerdo o bloque de asientos vendido. | $\frac{\text{Total Flight Revenue}}{\text{Número de tratos ganados}}$. Informa además el % de avance frente a la cuota global. |

---

## 5. Operatoria de las Tres Vistas Principales

### 5.1 Vista "Flight Pipeline" (Tablero Kanban de Etapas)
Es el espacio de trabajo natural para dar seguimiento al avance de las ventas. Presenta 4 columnas ordenadas según el ciclo de reserva aérea:

1. **Cotización / Cupos (`s1` - Inquiry):** Primer contacto con la agencia o corporativo. Probabilidad asignada: 10%.
2. **Tarifas Corporativas (`s3` - Negotiation):** Ajuste de condiciones de tarifa, política de equipaje y plazos de emisión. Probabilidad: 60%.
3. **Bloqueo Asientos (`s2` - Reserved):** Espacios reservados en el inventario con PNR temporal a la espera del pago final. Probabilidad: 30%.
4. **Vuelo Emitido (`s4` - Closed Won):** Billetes emitidos en firme o contrato chárter liquidado. Probabilidad: 100%.

#### Anatomía de las Tarjetas de Reserva en el Pipeline
* **Tarjeta Estándar (Fondo Blanco):**
  * Píldora con el código de vuelo (ej. `AL-120`) y ruta destacada en naranja (ej. `BOG -> MAD`).
  * Nombre de la Agencia Mayorista o Cliente B2B en negrita.
  * Título o descripción del acuerdo (ej. *Bloque 50 Asientos Temporada Verano*).
  * Importe monetario en euros (€).
  * Modalidad de venta: Si es venta individual, muestra badge verde con el asiento asignado (ej. `1 asiento (2A)`); si es grupal, muestra el total de pasajeros (ej. `45 pax`).
  * Avatar circular del Route Manager responsable.
  * Fecha de salida del vuelo / fecha límite de pago.
  * Indicadores de comentarios y documentos adjuntos.
* **Tarjeta Destacada Especial (*Prime Aviation & Charter Jets*):**
  * Diseñada en fondo oscuro pizarra (`#18181B`) para identificar a simple vista acuerdos de alto impacto (vuelos chárter ejecutivos o delegaciones oficiales). Incluye datos de contacto directo de la empresa, hangar y Travel Manager.

---

### 5.2 Vista "Revenue & Yield" (Analítica y Rendimiento de Rutas)
Diseñada para análisis estratégico y reuniones comerciales semanales:

1. **Gráfico de Barras - Ingresos por Etapa de Vuelo:**
   * Representa la suma económica acumulada en cada etapa del embudo.
   * Cuenta con barras coloreadas según el estado de la etapa e interacción *hover* para inspeccionar importes y probabilidades.
2. **Gráfico de Línea / Área - Evolución Mensual vs. Objetivo:**
   * Curva en gradiente naranja que traza el ingreso emitido mes a mes (Enero a Mayo).
   * Línea discontinua que marca la cuota mensual proyectada para identificar sobrecumplimientos o desfases de venta.
3. **Matriz de Rendimiento de Rutas (Revenue Management):**
   * Tabla especializada que desglosa cada corredor aéreo operado (`BOG -> MAD`, `MDE -> MIA`, `MAD -> BOG`, `BOG -> JFK`, etc.).
   * Columnas detalladas:
     * **Corredor / Ruta:** Código de ruta con icono de vuelo.
     * **Distancia:** Kilómetros oficiales de la ruta (ej. 8.030 km para BOG-MAD).
     * **Pasajeros Vendidos / Capacidad:** Asientos confirmados frente al cupo máximo.
     * **Load Factor (%):** Porcentaje de ocupación con badge automático `Meta ✓` si supera el 82%, o `Bajo Meta` si requiere refuerzo comercial.
     * **RASK (€/ASK):** Rendimiento por asiento-kilómetro ofertado.
     * **Yield (€/RPK):** Rendimiento por pasajero-kilómetro transportado.
     * **Revenue Emitido:** Total facturado por esa ruta.
4. **Leaderboard de Route Managers:**
   * Tarjetas individuales para cada ejecutivo comercial con foto, rol y hub asignado.
   * Barra de progreso hacia su cuota mensual individual y porcentaje de cumplimiento (`% attainment`).
   * Desglose de ingresos emitidos vs. valor de acuerdos en negociación.

---

### 5.3 Vista "Registro de Vuelos" (Gestión Tabular de Acuerdos)
Permite gestionar y auditar grandes volúmenes de acuerdos sin abrir cada ficha de manera individual:
* **Filtros Rápidos por Estado:** Pestañas superiores para ver *Todos*, *En Proceso (Open)*, *Emitidos (Won)* o *Cancelados (Lost)*.
* **Edición Inline Reactiva:**
  * **Selector de Etapa:** Permite cambiar la etapa de reserva directamente desde la fila.
  * **Selector de Estado:** Permite cambiar el estado (*En Proceso*, *Emitido / Won ✈️*, *Cancelado*).
  * **Efecto Inmediato:** Cambiar un estado a *Won* desde la tabla activa instantáneamente la animación de confetti y recalcula en el acto el Total Revenue, el Load Factor, el Win Rate y todos los gráficos de la aplicación.
* **Botón "Ver vuelo":** Abre el modal de detalle para modificaciones profundas.

---

## 6. Procedimientos Operativos Paso a Paso

### 6.1 Cómo Registrar una Nueva Reserva de Vuelo

```
[TopBar: "+ Nueva Reserva"]
           │
           ▼
┌────────────────────────────────────────┐
│ MODAL: Nueva Reserva / Bloque de Vuelo │
│ 1. Título del acuerdo                  │
│ 2. Seleccionar agencia o crear nueva   │
│ 3. Número de vuelo IATA (ej: AL-120)   │
│ 4. Ruta (ej: BOG -> MAD)               │
│ 5. Pasajeros:                          │
│    • 1 pax ──► Asignar Asiento (1A)    │
│    • N pax ──► Tipo de Cabina          │
│ 6. Revenue Estimado (€ EUR)            │
│ 7. Fecha de salida y Route Manager     │
│ 8. Etapa y Estado inicial              │
└──────────────────┬─────────────────────┘
                   │
                   ▼
     [Clic en "Crear Reserva"]
                   │
                   ▼
      Recálculo Inmediato de KPIs
         + Notificación Toast
```

1. Haz clic en el botón superior derecho **`+ Nueva Reserva`**.
2. Completa los campos del formulario:
   * **Título del Acuerdo:** Nombre descriptivo de la negociación (ej. *Bloque 40 Asientos Temporada Otoño BOG-MAD*).
   * **Agencia / Cuenta Corporativa:** Selecciona una agencia del catálogo desplegable.
     * *Opción para clientes nuevos:* Haz clic en el enlace `+ Crear nueva agencia` e introduce el nombre de la empresa. El sistema la registrará de forma automática en la base de datos de clientes corporativos.
   * **Número de Vuelo (IATA):** Ingresa el código del vuelo (ej. `AL-120`, `AL-650`, `AL-315`).
   * **Ruta de Vuelo:** Selecciona el corredor aéreo correspondiente (ej. `BOG → MAD`, `MDE → MIA`, `BOG → JFK`, etc.).
   * **Plazas / Pasajeros (Pax):**
     * Si ingresas **1**, el sistema habilitará el campo **Asignación de Asiento** (ej. `2A`, `14B`) para venta unitaria ejecutiva.
     * Si ingresas **2 o más**, el sistema habilitará el selector de **Tipo de Cabina** (*Economy Group*, *Premium Economy*, *Business Class*, *Executive Charter*).
   * **Revenue Estimado (€ EUR):** Valor total pactado de la venta.
   * **Fecha Programada de Vuelo:** Fecha estimada para el despegue.
   * **Route Manager Asignado:** Selecciona al responsable comercial de la cuenta.
   * **Etapa Inicial y Estado:** Selecciona la fase de inicio (*Cotización / Cupos* por defecto) y estado (*En Proceso* o *Emitido*).
3. Haz clic en **`Crear Reserva de Vuelo`**.
4. Se mostrará una notificación toast en pantalla y la reserva aparecerá inmediatamente en el pipeline y la tabla.

---

### 6.2 Cómo Inspeccionar, Editar o Avanzar una Reserva
1. En el tablero Kanban o en la tabla, haz clic sobre la tarjeta o fila de la reserva deseada.
2. Se abrirá la ventana modal **Detalle de la Reserva** con toda la ficha técnica:
   * Código de vuelo, ruta, ID de expediente y cliente.
   * Datos del Travel Manager y Hub preferente.
3. Modifica los valores requeridos:
   * Puedes cambiar el importe de ingresos si la negociación cerró con descuento o suplemento.
   * Puedes modificar el número de plazas o el asiento individual.
   * Puedes reasignar el Route Manager si hubo cambio de cartera.
4. Para guardar, haz clic en **`Guardar Cambios`**.

---

### 6.3 Cómo Emitir un Billete / Confirmar Venta (Pasar a "Won")
1. Abre el modal de detalle del vuelo haciendo clic sobre él.
2. En la sección **Estado del Acuerdo de Vuelo**, haz clic en el botón verde **`Vuelo Emitido ✈️`**.
3. **Comportamiento automático del sistema:**
   * La etapa de reserva se mueve automáticamente a **`Vuelo Emitido` (s4)**.
   * Se dispara una animación festiva de confeti en la pantalla.
   * La fecha de confirmación (`closed_at`) se registra con la fecha y hora actual.
   * El valor económico se suma en el acto al **Total Flight Revenue**, se recalculan el **Load Factor**, el **Win Rate**, la gráfica de barras de etapas y la tabla de rutas.
4. Haz clic en **`Guardar Cambios`** para cerrar el modal.

---

### 6.4 Cómo Cancelar una Reserva y Registrar el Motivo de Pérdida
1. Abre el modal de detalle de la reserva.
2. En la sección de estado, haz clic en el botón rojo **`Cancelado`**.
3. El sistema moverá internamente la etapa a **`Cancelado / No-show` (s5)** y desplegará el campo obligatorio:
   * **Motivo de Cancelación / Pérdida:** Escribe la razón técnica o comercial (ej. *Eligieron aerolínea competidora por itinerario matutino*, *Presupuesto corporativo congelado*, *No-show de pasajeros en mostrador*).
4. Haz clic en **`Guardar Cambios`**. El Win Rate se ajustará de forma inmediata reflejando la cancelación.

---

### 6.5 Cómo Eliminar una Reserva
1. Abre el modal de detalle del vuelo.
2. En la esquina inferior izquierda, haz clic en el botón rojo **`Eliminar`** con icono de papelera.
3. El navegador solicitará confirmación de seguridad para evitar eliminaciones accidentales.
4. Al confirmar, el registro se suprime y todos los KPIs asociados se actualizan.

---

## 7. Asistente de IA Copilot Integrado con N8N

En la esquina inferior derecha del dashboard se encuentra el botón flotante **`IA Copilot`** con animación de pulso y punto verde de disponibilidad. Este módulo conecta el dashboard directamente con el flujo de inteligencia artificial configurado en N8N.

```
┌────────────────────────────────────────────────────────┐
│                   AEROLINK COPILOT                     │
│               [Airline AI • POST N8N]                  │
├────────────────────────────────────────────────────────┤
│ (⚙️ Ajustes)  (🗖 Expandir)  (🗑️ Limpiar)  (✕ Cerrar)   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [AI]: ✈️ ¡Hola! Soy tu Agente de IA para Revenue      │
│        Management de AeroLink...                       │
│                                                        │
│  [Tú]: ¿Qué rutas superan la meta del 82%?             │
│                                                        │
│  [AI]: Las rutas que superan la meta son:              │
│        • BOG -> MAD con 86.4% de ocupación             │
│        • MDE -> MIA con 83.1% de ocupación             │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [Sugerencias Rápidas: Load Factor | Rutas | Cuotas]    │
├────────────────────────────────────────────────────────┤
│ [ Escribe tu consulta aquí...               ] [Enviar] │
└────────────────────────────────────────────────────────┘
```

### 7.1 Funcionalidades del Asistente
1. **Envío de Contexto en Tiempo Real (`crmContext`):**
   * Cada vez que el usuario envía una pregunta, el chat empaqueta de forma transparente un objeto con el estado vivo del CRM:
     * Cifras de Load Factor, RASK, Yield, ASK y RPK actuales.
     * Lista de rutas con su ocupación y estado frente a la meta del 82%.
     * Total Revenue emitido, número de reservas abiertas y valor del pipeline.
     * Desglose por etapas y cumplimiento de cuotas de cada Route Manager.
   * Esto permite que el agente de IA **siempre responda con datos exactos y actualizados al segundo**, sin requerir consultas manuales a bases de datos externas.
2. **Botones de Sugerencias Rápidas (Chips):**
   * El usuario puede hacer clic en cualquiera de las consultas predefinidas para obtener análisis inmediatos:
     * *"¿Cuál es el Load Factor y RASK actual de la red?"*
     * *"¿Qué rutas superan la meta del 82% de ocupación?"*
     * *"¿Cuál es el Revenue total emitido y el Win Rate?"*
     * *"¿Cómo va el cumplimiento de cuota de Antony Cárdenas en BOG/MAD?"*
3. **Modos de Visualización:**
   * **Modo Ventana Estándar:** Cuadro flotante compacto en la esquina inferior derecha.
   * **Modo Expandido (`Maximize2`):** Amplía la ventana a dimensiones cómodas para leer tablas, respuestas extensas o reportes en pantallas grandes.
4. **Configuración de Webhook en Caliente (`Settings`):**
   * Al hacer clic en el engranaje (⚙️), el usuario puede visualizar o editar la URL del Webhook de N8N (`https://lab3fsi.app.n8n.cloud/webhook/...`).
   * La URL editada se guarda en el almacenamiento local del navegador (`localStorage`) y cuenta con un botón para restaurar la URL oficial por defecto si fuera necesario.
5. **Diagnóstico y Recuperación de Errores:**
   * Si el workflow en N8N experimenta un fallo interno (por ejemplo, falta de saldo en la API del modelo o error en un nodo), el chat intercepta el mensaje y despliega instrucciones claras para que el operador sepa qué revisar en la pestaña de ejecuciones de N8N.

---

## 8. Filtros Avanzados y Herramientas de Productividad

Para facilitar la toma de decisiones ágil, el dashboard permite combinar múltiples filtros en simultáneo:

| Filtro | Ubicación | Cómo Utilizarlo | Efecto en la Pantalla |
| :--- | :--- | :--- | :--- |
| **Por Route Manager** | Sidebar (Lista de Miembros) | Haz clic sobre la foto del vendedor. | Filtra todo el CRM para mostrar únicamente los acuerdos de esa persona. Aparece el botón `Clear` para desmarcar. |
| **Mis Rutas** | TopBar (Píldora rápida) | Haz clic en `Mis Rutas`. | Aplica de inmediato el filtro del ejecutivo *Antony Cárdenas*. |
| **Por Etapa de Reserva** | TopBar (Desplegable) | Selecciona una etapa específica. | Muestra solo los acuerdos que se encuentran en esa fase. |
| **Por Búsqueda de Texto** | TopBar (Buscador) | Escribe cualquier término. | Filtra en tiempo real por número de vuelo, ciudad, ruta, agencia o industria. |
| **Por Orden de Importe** | TopBar (Botón Sort) | Haz clic en el botón de orden. | Reorganiza las reservas de mayor a menor ingreso, de menor a mayor, o por fecha de creación. |
| **Restauración de Fábrica** | View Tabs (`Reset Data`) | Haz clic en `Reset Data` y confirma. | Devuelve los 38 vuelos iniciales, etapas y métricas a su estado de fábrica para realizar nuevas simulaciones. |

---

## 9. Glosario de Términos para el Operador

* **ASK (Available Seat Kilometers):** Medida de capacidad total ofertada por la aerolínea. Se calcula multiplicando los asientos disponibles de un vuelo por la distancia en kilómetros de la ruta.
* **RPK (Revenue Passenger Kilometers):** Medida del tráfico real de pasajeros que han pagado por su billete. Se calcula multiplicando los pasajeros transportados por la distancia volada.
* **Load Factor (Factor de Ocupación):** Relación porcentual entre RPK y ASK ($\frac{\text{RPK}}{\text{ASK}} \times 100$). Representa el porcentaje de asientos ocupados en los vuelos operados frente a la meta estándar de la industria (82%).
* **RASK (Revenue per Available Seat Kilometer):** Ingreso medio obtenido por cada asiento-kilómetro ofertado en la red.
* **Yield (Rendimiento por Pasajero):** Tarifa media pagada por un pasajero por cada kilómetro recorrido. Refleja la rentabilidad de las tarifas vendidas.
* **OTA (Online Travel Agency):** Agencias de viaje en línea (ej. Despegar, Expedia) que compran cupos de billetes en bloque.
* **PNR (Passenger Name Record):** Código alfanumérico único de 6 caracteres que identifica una reserva en el sistema de la aerolínea.
* **No-Show:** Situación en la cual un pasajero o grupo con billete emitido no se presenta al embarque antes del cierre de puertas (20 minutos antes de la salida).
* **Quota Attainment:** Porcentaje de cumplimiento de la cuota mensual de ingresos asignada a un Route Manager o a la red global.

---

## 10. Preguntas Frecuentes (FAQ)

### ¿Por qué al cambiar una reserva a "Won" cambian varios números al mismo tiempo?
Porque el motor de cálculo del dashboard (`src/utils/calculations.js`) es 100% dinámico. Al emitirse un vuelo:
1. El importe de la reserva se añade al **Total Flight Revenue**.
2. Los pasajeros se suman al total de asientos vendidos y al tráfico **RPK**.
3. El **Load Factor** sube al aumentar los asientos ocupados.
4. El **Win Rate** se recalcula automáticamente considerando la nueva victoria frente al histórico de cancelaciones.
5. El **Leaderboard** del Route Manager responsable incrementa su barra de avance hacia la cuota.

### ¿Cómo sé si una ruta está en riesgo operativo o comercial?
En la pestaña **Revenue & Yield**, revisa la **Matriz de Rendimiento de Rutas**. Cualquier ruta cuyo **Load Factor** esté por debajo del **82.0%** se resaltará con un badge en color coral (`Bajo Meta`). Esto indica al Route Manager que debe lanzar promociones o negociar cupos adicionales con agencias mayoristas para esa ruta.

### ¿Qué debo hacer si el Copiloto de IA indica un error al consultar?
1. Abre el menú de configuración (⚙️) en la cabecera del chat y verifica que la URL del webhook corresponda al entorno activo.
2. Comprueba que el workflow en la plataforma N8N esté encendido (*Active*) o que se encuentre en modo de pruebas con ejecuciones habilitadas.
3. Puedes hacer clic en `Restaurar default` para asegurar que el endpoint coincida con la nube oficial del laboratorio.

### ¿Puedo registrar una venta de un único billete con asiento asignado?
Sí. Al pulsar `+ Nueva Reserva`, establece el campo de pasajeros en **1**. El sistema transformará automáticamente el selector de cabina en un campo de **Asignación de Asiento** (ej. `2A`, `14C`), registrando la oportunidad como venta de billete unitario con distintivo verde en el tablero y en la tabla.
