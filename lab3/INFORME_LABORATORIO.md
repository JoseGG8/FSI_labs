# Informe de Laboratorio: Desarrollo Asistido por IA (Vibecoding), CRM para Aerolíneas y Agentes Autónomos con N8N

**Responsable:** José Luis Gil García  
**C.C.:** 1034988407  
**Correo institucional:** j.gil@udea.edu.co  
**Enlace al repositorio de GitHub:** [https://github.com/JoseGG8/FSI_labs/tree/main](https://github.com/JoseGG8/FSI_labs/tree/main)  
**Carpeta de la práctica en GitHub:** [https://github.com/JoseGG8/FSI_labs/tree/main/lab3](https://github.com/JoseGG8/FSI_labs/tree/main/lab3)  
**Documentación técnica y reglas:**
* **Manual de Usuario y Documentación Funcional:** [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/DOCUMENTACION_FUNCIONAL.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/DOCUMENTACION_FUNCIONAL.md)
* **Reglas de Negocio de la Aerolínea:** [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/REGLAS_NEGOCIO.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/REGLAS_NEGOCIO.md)
* **Especificación del Modelo de Datos:** [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/estructura_datos.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/estructura_datos.md)
* **Guía de Ejecución y README:** [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/README.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/README.md)

---

## 1. Introducción

En el contexto actual de la ingeniería de software, la convergencia entre modelos de lenguaje avanzados (LLMs) y flujos de trabajo asistidos por inteligencia artificial ha dado origen al paradigma de **Vibecoding**. Esta metodología transforma el rol del desarrollador: en lugar de escribir cada línea de código de forma manual y repetitiva, el ingeniero actúa como director de orquesta y arquitecto, iterando mediante lenguaje natural, validando componentes en tiempo real y refinando prototipos funcionales de alto impacto visual y funcional.

En la presente práctica de laboratorio se abordó el diseño, desarrollo e integración completa de un **Dashboard CRM Comercial y de Revenue Management para una Aerolínea Internacional (AeroLink)**. Como estudiante, asumí el desafío de construir una solución de software orientada a la toma ágil de decisiones de directores comerciales (*Chief Commercial Officer*) y gestores de rutas (*Route Managers*). La experiencia integró la adopción de un diseño premium tomado de la plataforma **Dribbble**, la construcción reactiva de la interfaz apoyada en los modelos de inteligencia artificial disponibles en el entorno **Antigravity**, y la conexión con un backend inteligente orquestado en **N8N** impulsado por un modelo **Flash de Google**, capaz de razonar sobre métricas aeronáuticas en vivo (Load Factor, RASK, Yield y cumplimiento de cuotas).

---

## 2. Objetivos

### 2.1. Objetivo General
Diseñar, implementar y validar un sistema integral de CRM y Revenue Management aeronáutico mediante la metodología de Vibecoding, integrando una interfaz de usuario moderna con un agente de inteligencia artificial autónomo conectado a flujos de trabajo en la nube.

### 2.2. Objetivos Específicos
* **Comprender el flujo de trabajo de Vibecoding (desarrollo de software asistido por IA):** Experimentar de manera directa cómo la colaboración iterativa entre el programador y los modelos de lenguaje de Antigravity acelera el andamiaje, modelado de estado y resolución de incidencias en código.
* **Diseñar interfaces de usuario (UI) funcionales basadas en referencias visuales de alta calidad:** Replicar con fidelidad estética y funcional una referencia seleccionada de Dribbble (estilo BizLink), implementando micro-animaciones, esquinas redondeadas, paletas de colores armoniosas y tres vistas complementarias de visualización.
* **Integrar servicios de backend (N8N) con aplicaciones frontend generadas por IA:** Configurar webhooks HTTP mediante método POST para intercomunicar la capa de cliente en React con flujos de integración y automatización en la nube.
* **Implementar agentes de IA autónomos que interactúen con datos en tiempo real:** Construir un Copiloto conversacional que reciba el contexto vivo del CRM (*Load Factor, ingresos, vuelos confirmados y cuotas de vendedores*) mediante un modelo Flash de Google, generando diagnósticos comerciales precisos al instante.

---

## 3. Herramientas y Tecnologías Utilizadas

Para llevar a cabo el proyecto, seleccioné una pila tecnológica moderna orientada a la agilidad de desarrollo, reactividad y rendimiento:

* **Antigravity (Google Advanced Agentic Coding):** Entorno de desarrollo asistido con modelos LLM de última generación (familia Gemini / Flash / Pro) utilizado para la generación, refactorización, auditoría y resolución de código en tiempo real.
* **Dribbble (Referencia Visual BizLink CRM):** Plataforma de diseño gráfico de donde extraje la arquitectura visual, distribución de tarjetas flotantes, paleta de colores crema/coral y estilo minimalista de presentación ejecutiva.
* **React 18:** Biblioteca declarativa en JavaScript para la construcción de interfaces de usuario basadas en componentes modulares y gestión reactiva de estado (`useState`, `useMemo`, `useEffect`).
* **Vite 5:** Herramienta de compilación y empaquetador ultrarrápido (*frontend build tool*) con recarga de módulos en caliente (*Hot Module Replacement - HMR*).
* **Vanilla CSS (CSS3 Moderno):** Hojas de estilo sin frameworks sobrecargados, implementando variables CSS personalizadas, sombras de profundidad, cuadrículas fluidas (*CSS Grid*) y diseño adaptativo (*Flexbox*).
* **N8N Cloud:** Plataforma de automatización y orquestación de flujos de trabajo (*workflow automation*), utilizada como servidor de backend para exponer endpoints Webhook vía POST.
* **Google Gemini Flash (en N8N):** Modelo de lenguaje multimodal de alta velocidad y baja latencia de Google, integrado dentro del nodo AI Agent de N8N para interpretar consultas en lenguaje natural y razonar sobre el contexto del CRM.
* **Lucide React:** Colección de iconografía vectorial limpia y estilizada para la representación de rutas, vuelos, indicadores y acciones de usuario.
* **Canvas Confetti:** Biblioteca gráfica para la renderización de micro-animaciones y efectos de partículas de celebración al materializar ventas y emitir billetes.
* **Git y GitHub:** Sistema de control de versiones y repositorio remoto para el seguimiento de commits y publicación de la documentación del proyecto.

---

## 4. Metodología y Procedimiento

El desarrollo de la práctica se estructuró en cuatro fases metodológicas iterativas, fundamentadas en el ciclo de trabajo de Vibecoding:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    METODOLOGÍA DE DESARROLLO VIBECODING                    │
├────────────────────┬────────────────────┬──────────────────────────────────┤
│ 1. CONCEPTUALIZAC. │ 2. MODELADO DE     │ 3. CO-CREACIÓN CON ANTIGRAVITY   │
│    & DRIBBLE UI    │    DATOS & REGLAS  │    (React, CSS, Cálculos Vivos)  │
└─────────┬──────────┴─────────┬──────────┴────────────────┬─────────────────┘
          │                    │                           │
          ▼                    ▼                           ▼
    Referencia visual     Reglas de negocio           Componentes modulares
    BizLink en Dribbble   y esquemas JSON             y reactividad en cliente
                               │
                               ▼
          ┌──────────────────────────────────────────────┐
          │ 4. INTEGRACIÓN DE BACKEND IA EN N8N          │
          │    Webhook POST + Google Gemini Flash Model  │
          └──────────────────────────────────────────────┘
```

### 4.1. Conceptualización del Diseño desde Dribbble y Filosofía Vibecoding
Como estudiante, inicié el proceso buscando referentes de diseño de clase mundial en **Dribbble**. Seleccioné el concepto **BizLink CRM**, caracterizado por:
* Un fondo cálido en tono crema/hueso (`#F6F4EB`), alejándose del blanco hospitalario estándar.
* Tarjetas flotantes blancas con sombras sutiles y bordes redondeados (`border-radius: 16px - 20px`).
* Acentos cromáticos específicos: tono coral/naranja (`#FF6B4A` / `#F97316`) para destacar rutas e interacciones primarias, verde esmeralda (`#10B981`) para éxitos y cumplimiento, y azul cielo (`#3B82F6`) para elementos informativos.
* Una tarjeta destacada en contraste oscuro (`#18181B`) para resaltar operaciones VIP (*Prime Aviation & Charter Jets*).

Bajo la filosofía de **Vibecoding**, utilicé los modelos de inteligencia artificial disponibles en **Antigravity** para describir la intención funcional y estética en lenguaje natural. En lugar de codificar manualmente cada regla de estilo o estructura de componentes, interactué de forma iterativa con el agente: validé la apariencia en el navegador local (`http://localhost:5173/`), solicité ajustes en la distribución del layout y permití que el modelo propusiera la arquitectura de componentes React más limpia y modular.

### 4.2. Modelado del Dominio y Reglas de Negocio de la Aerolínea
Para que el dashboard fuera un sistema realista y no una maqueta estática, analicé y estructuré los requerimientos aeronáuticos documentados en el repositorio de GitHub:
1. **Reglas de Negocio de la Aerolínea:** Consulté las políticas consignadas en [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/REGLAS_NEGOCIO.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/REGLAS_NEGOCIO.md), identificando las tres familias tarifarias (*Light*, *Clásica* y *Flex*), las políticas de equipaje (mano 10 kg, bodega 23 kg, sobrepeso), los tiempos de emisión de billetes (máximo 2 horas antes de expirar reservas) y las reglas de *No-Show* y penalizaciones de rescate.
2. **Esquemas de Datos B2B:** Modelé las cuatro entidades cardinales del CRM, detalladas en [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/estructura_datos.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/estructura_datos.md):
   * **Usuarios (Route Managers y Revenue Managers):** 4 gestores con roles, cuota mensual de ventas asignada y hub base (Antony Cárdenas en BOG/MAD, Sandra Perry en Red Global, Jamal Connolly en MIA/Caribe, Cara Carr en MDE/Andina).
   * **Etapas del Pipeline:** 5 fases del ciclo comercial (*Inquiry/Cotización*, *Reserved/Bloqueo Asientos*, *Negotiation/Tarifas Corporativas*, *Closed Won/Vuelo Emitido*, *Closed Lost/Cancelado*).
   * **Clientes B2B:** 10 empresas que adquieren pasajes en bloque (agencias como Viajes El Corte Inglés, OTAs como Expedia y Despegar, corporativos como Banco Santander y operadores de chárters privados como Prime Aviation).
   * **Oportunidades y Reservas (Flight Deals):** 38 acuerdos poblados con números de vuelo IATA (`AL-120`, `AL-650`, etc.), rutas oficiales, tipo de cabina, cantidad de pasajeros y modalidad de billete individual con asignación de asiento unitario (ej. `2A`, `1F`, `3C`). La tienda de datos completa se alojó en [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/src/data/mockData.js](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/src/data/mockData.js).

### 4.3. Implementación Frontend y Reactividad en Tiempo Real con Antigravity
Junto a Antigravity, codifiqué la estructura de la aplicación en React organizada en componentes reutilizables:
* **Orquestador Principal ([App.jsx](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/App.jsx)):** Mantiene el estado central reactivo, gestionando la lista de tratos, clientes y usuarios. Implementa filtros combinados en tiempo real mediante `useMemo` (búsqueda predictiva, filtrado por etapa, ordenamiento por revenue y filtro por vendedor "Mis Rutas").
* **Motor Dinámico de Cálculo Aeronáutico ([calculations.js](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/utils/calculations.js)):** Programé funciones puras que calculan sin texto estático:
  * **Load Factor (%):** Asientos vendidos vs. disponibles, comparado frente a la **Meta de Red IATA ≥ 82.0%**.
  * **RASK (€/ASK):** Ingresos por Asiento-Kilómetro Disponible.
  * **Yield (€/RPK):** Ingreso medio por Pasajero-Kilómetro Recorrido, verificando la relación $RASK = Yield \times Load\ Factor$.
  * **Total Flight Revenue, Active Bookings, Win Rate y Avg Booking Size.**
* **Vistas de Interacción:**
  * **Pipeline Kanban ([PipelineBoard.jsx](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/components/PipelineBoard.jsx)):** Tablero con 4 columnas del ciclo de venta, subtotales por columna y tarjeta VIP en tono oscuro.
  * **Analítica & Rendimiento ([ChartsSection.jsx](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/components/ChartsSection.jsx)):** Gráficos SVG interactivos de barras por etapa, curva de ingresos mensuales vs. cuota, matriz de rutas con verificación de meta IATA y leaderboard de vendedores.
  * **Registro Tabular ([DealsTable.jsx](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/components/DealsTable.jsx)):** Tabla completa con selectores *inline* para cambiar de etapa o marcar como ganado en caliente.
* **Modales Operativos ([DealModal.jsx](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/components/DealModal.jsx) y [DealDetailModal.jsx](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/components/DealDetailModal.jsx)):** Diseñé modales para la creación y edición de reservas. Si el usuario ingresa 1 pasajero, el formulario adapta sus campos para solicitar la asignación de asiento unitario (ej. `2A`); al pasar una reserva a estado *Won*, se dispara una animación de confeti mediante `canvas-confetti` y se recalculan al vuelo todas las cifras de la interfaz.

### 4.4. Automatización de Backend y Construcción del Agente de IA con N8N y Gemini Flash
Para dotar al dashboard de capacidades autónomas, desarrollé un asistente conversacional integrado:
1. **Configuración del Webhook en N8N:** Configuré en N8N Cloud un trigger de Webhook que escucha solicitudes entrantes por el método `POST` en la URL:
   `https://lab3fsi.app.n8n.cloud/webhook/5581c101-57a2-445d-bd21-08705955f777`.
2. **Modelo Flash de Google:** En N8N enlacé el trigger a un nodo **AI Agent** configurado con un modelo **Google Gemini Flash**. Este modelo fue seleccionado estratégicamente por su velocidad de procesamiento, reducido consumo de tokens y excelente capacidad de síntesis para responder preguntas de negocio en milisegundos.
3. **Inyección Dinámica de Contexto (`crmContext`):** Desde el componente React [N8nChatWidget.jsx](file:///c:/Users/Jose%20Luis%20GIl/Documents/Cursos%202026-2/FSI_labs/lab3/src/components/N8nChatWidget.jsx), programé una rutina que en cada mensaje enviado adjunta un payload JSON estructurado con el estado en vivo del CRM:
   ```json
   {
     "message": "¿Cuál es el Load Factor y qué rutas superan la meta?",
     "sessionId": "session-bizlink-...",
     "crmContext": {
       "loadFactor": "85.2%",
       "loadFactorTarget": "82.0%",
       "loadFactorMet": true,
       "rask": "€ 0.021 / ASK",
       "yield": "€ 0.025 / RPK",
       "totalRevenue": 724290,
       "routesPerformance": [...],
       "salesTeam": [...]
     }
   }
   ```
4. **Experiencia de Usuario en el Chat:** Se dotó al widget de chips con preguntas sugeridas de un solo clic, soporte para renderizado de texto Markdown, botón de maximizar pantalla completa (*expanded mode*), manejo amigable de errores de ejecución de workflow y menú de configuración (⚙️) para cambiar o restaurar la URL del webhook en el almacenamiento local (`localStorage`).

---

## 5. Resultados e Interfaz de Usuario

Como resultado del laboratorio, se obtuvo una plataforma web completamente funcional, intuitiva y visualmente atractiva:

1. **Dashboard y Navegación Reactiva:** La aplicación se encuentra en ejecución en el entorno local (`http://localhost:5173/`). Todas las vistas operan de manera sincronizada:
   * Al filtrar por el vendedor *Antony Cárdenas* ("Mis Rutas"), todas las tarjetas del pipeline, la tabla y los indicadores de Load Factor e ingresos se reconfiguran instantáneamente.
   * Al registrar un nuevo acuerdo o emitir un billete, la pantalla despliega el confeti festivo y actualiza el gráfico de barras y la matriz de rutas en milisegundos.
2. **Auditoría de Revenue Management en Vivo:**
   * La **Matriz de Rendimiento de Rutas** en la pestaña *Revenue & Yield* permite verificar con precisión matemática si corredores como `BOG -> MAD` o `MDE -> MIA` cumplen con el estándar del 82%, visualizando badges claros de `Meta ✓` o `Bajo Meta`.
3. **Asistente IA Funcional:**
   * Al interactuar con el botón flotante `IA Copilot`, el agente responde con exactitud sobre el estado del inventario, indicando qué rutas están sobrecumpliendo su ocupación y evaluando el porcentaje de cumplimiento de cuota de los Route Managers a partir del contexto en tiempo real.
4. **Documentación Completa en GitHub:**
   * El repositorio oficial en GitHub almacena todos los entregables debidamente versionados:
     * El **Manual Funcional de Usuario** en [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/DOCUMENTACION_FUNCIONAL.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/DOCUMENTACION_FUNCIONAL.md).
     * Las **Políticas y Reglas de Negocio** en [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/REGLAS_NEGOCIO.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/REGLAS_NEGOCIO.md).
     * El **README de bienvenida y ejecución** en [https://github.com/JoseGG8/FSI_labs/blob/main/lab3/README.md](https://github.com/JoseGG8/FSI_labs/blob/main/lab3/README.md).

---

## 6. Conclusiones

Desde mi perspectiva como estudiante de ingeniería, el desarrollo de esta práctica de laboratorio me permitió extraer conclusiones fundamentales para mi formación profesional:

1. **Efectividad del Paradigma Vibecoding:** La asistencia de los modelos de inteligencia artificial en Antigravity revoluciona el ritmo de desarrollo. La capacidad de iterar sobre interfaces complejas mediante lenguaje natural no reemplaza el criterio del ingeniero, sino que potencia su productividad, permitiendo concentrarse en la lógica de dominio, la coherencia de los datos y la experiencia de usuario.
2. **Importancia del Diseño Basado en Referencias de Calidad:** Tomar como base una referencia visual profesional en Dribbble (BizLink) demostró que el software empresarial no tiene por qué ser árido ni monótono. Incorporar paletas de color estudiadas, sombras cuidadas y micro-interacciones como el confeti al cerrar ventas transforma la percepción del usuario final y eleva el estándar del producto.
3. **Poder de la Desacoplación Frontend-Backend con N8N:** Utilizar N8N como capa de backend para orquestar flujos de trabajo con inteligencia artificial evita la necesidad de construir servidores backend tradicionales engorrosos. La facilidad para crear webhooks y conectarlos con modelos como Google Gemini Flash acelera la entrega de valor de semanas a cuestión de horas.
4. **Relevancia del Contexto en Agentes Autónomos:** Un agente de inteligencia artificial es tan útil como los datos contextuales que recibe. La estrategia implementada de alimentar al modelo Flash con el estado del CRM (`crmContext`) en cada petición demostró ser el factor determinante para eliminar alucinaciones y lograr respuestas precisas, útiles y de verdadero valor operativo para la aerolínea.
5. **Rigor en la Documentación de Software:** La creación de manuales funcionales claros orientados al usuario operador y la recopilación de reglas de negocio en repositorios como GitHub son prácticas indispensables para garantizar la mantenibilidad, escalabilidad y adopción de cualquier sistema informático en el entorno real.
