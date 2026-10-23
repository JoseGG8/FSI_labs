# BizLink CRM - Dashboard MVP para Responsable de Ventas (Lab 3)

MVP de Dashboard CRM B2B diseñado para un **Responsable de Ventas** (Sales Director / Manager), enfocado en la toma ágil de decisiones sobre el rendimiento del equipo comercial y el estado de los ingresos.

Inspirado con estricta fidelidad en la referencia visual **BizLink**: estética minimalista, esquinas redondeadas, sombras suaves, paleta crema/hueso (`#F6F4EB`), tarjetas blancas, acentos en naranja/coral (`#FF6B4A` / `#F97316`), verde para éxito (`#10B981`) y azul para elementos informativos (`#3B82F6`).

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

## 📁 Estructura del Proyecto y Separación de Datos

```
lab3/
├── mockData.js                  # Acceso directo para editar datos simulados
├── estructura_datos.md          # Especificación de entidades del laboratorio
├── package.json                 # Dependencias y scripts
├── vite.config.js               # Configuración del bundler Vite
├── index.html                   # HTML con tipografías Inter y Plus Jakarta Sans
└── src/
    ├── main.jsx                 # Punto de entrada de React
    ├── App.jsx                  # Estado central, filtros reactivos y orquestación
    ├── index.css                # Sistema de diseño CSS moderno
    ├── data/
    │   └── mockData.js          # TIENDA CENTRAL DE DATOS SIMULADOS
    ├── utils/
    │   └── calculations.js      # MOTOR DE CÁLCULO DINÁMICO DE KPIS
    └── components/
        ├── Sidebar.jsx          # Barra lateral fija (Logo, Menú, Proyectos, Miembros)
        ├── TopBar.jsx           # Buscador en vivo, filtros rápidos, selector 'Me' y '+ Add deal'
        ├── TopAnalyticsBanner.jsx # Widget superior (Barras de nuevos clientes + Gauge radial de Win Rate)
        ├── KpiCards.jsx         # 4 KPIs ejecutivos con comparativas visuales
        ├── PipelineBoard.jsx    # Tablero Kanban por etapas con tarjetas y 'Prime Estate' destacado
        ├── ChartsSection.jsx    # Gráfico de Barras por Etapa + Gráfico de Línea de Evolución
        ├── DealsTable.jsx       # Registro tabular de oportunidades con cambio de estado inline
        ├── DealModal.jsx        # Modal para crear nuevas oportunidades
        ├── DealDetailModal.jsx  # Modal de inspección y cambio de estado con celebración de confetti
        └── N8nChatWidget.jsx    # Ventana flotante de Chat conectada con Agente IA de N8N (POST Webhook)
```

---

## 📊 Estrategia de Datos y Reactividad en Tiempo Real

El archivo **`src/data/mockData.js`** (y su acceso directo `mockData.js`) contiene la implementación rigurosa de los 4 esquemas definidos en `estructura_datos.md`:
1. **Usuarios (Vendedores)**: `Antony Cardenas`, `Sandra Perry`, `Jamal Connolly`, `Cara Carr` con avatares, cuotas y roles.
2. **Etapas (Pipeline Stages)**: `Prospect` (Contacted), `Lead` (Lead Qualified), `Negotiation` (color naranja), `Closed Won` (color verde), `Closed Lost`.
3. **Clientes**: 14 empresas B2B (`ByteBridge`, `SkillUp Hub`, `FitLife Nutrition`, `CloudSphere`, `Prime Estate`, `AI Synergy`, etc.).
4. **Deals (Oportunidades)**: 32 oportunidades variadas para poblar de forma realista los gráficos y el pipeline.

### ⚡ Lógica de Cálculo Dinámico (No Texto Estático)
Todos los valores del dashboard provienen de funciones puras en `src/utils/calculations.js`:
- **Total Revenue**: $\sum \text{amount}$ donde `status = 'won'`.
- **Active Deals**: Conteo de deals donde `status = 'open'`.
- **Win Rate**: $\frac{\text{deals ganados}}{\text{deals ganados} + \text{deals perdidos}} \times 100$.
- **Avg Deal Size**: Promedio del valor monetario de venta de tratos ganados.
- **Gráfico Principal (Barras)**: Suma acumulada de ingresos agrupada por etapa del pipeline.
- **Gráfico Secundario (Línea/Área)**: Evolución de ingresos ganados mes a mes vs cuota objetivo.

> **Demostración de reactividad**: Haz clic sobre cualquier tarjeta de oportunidad (por ejemplo, en *Contacted* o en la tabla) y cambia su estado a **"Ganado (Won)"**. Verás la animación de celebración y comprobarás que el **Total Revenue**, el **Win Rate**, la gráfica de barras y la columna de cerrados se actualizan instantáneamente sin recargar la página.

---

## 🤖 5. Asistente de IA Copilot Integrado con N8N

Se ha incorporado una ventana de chat interactiva con conexión directa al webhook de N8N:
- **Webhook Endpoint**: `POST https://lab3fsi.app.n8n.cloud/webhook/5581c101-57a2-445d-bd21-08705955f777`
- **Ubicación en UI**: Botón flotante **`IA Copilot`** en la esquina inferior derecha con indicador de estado en línea.
- **Funcionalidades del Chat**:
  - Enrutamiento por método `POST` enviando la consulta (`message`, `chatInput`), el identificador de sesión (`sessionId`) y el **contexto completo del CRM** (`totalRevenue`, `activeDealsCount`, `winRate`, resumen de etapas y top deals).
  - Sugerencias rápidas con 1 clic (*chips* de preguntas frecuentes).
  - Soporte para respuestas formateadas en Markdown, listas y negritas.
  - Indicador animado de espera durante el procesamiento del agente de N8N.
  - Menú de ajustes (⚙️) para ver o actualizar la URL del webhook si es necesario.
  - Controles de minimizar, expandir (`expanded mode` para pantallas grandes), reiniciar conversación y cerrar.
