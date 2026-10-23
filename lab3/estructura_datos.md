# Estructura de DATOS - CRM Comercial para Aerolínea (AeroLink)

Este documento define la estructura de entidades para el **Dashboard de CRM Comercial y Revenue Management de una Aerolínea**. Modela la venta de vuelos chárter, acuerdos corporativos B2B, venta de bloques de asientos para agencias de viajes (OTAs y mayoristas) y reservas ejecutivas.

---

## 1. Tabla de Usuarios (Equipo Comercial y Route Managers)
Esta entidad gestiona a los responsables comerciales de rutas, convenios corporativos y chárters. Permite filtrar el rendimiento individual frente al objetivo de ingresos por ruta/hub.

```json
{
  "id": "string (UUID - ej: 'u1')",
  "full_name": "string (Nombre del ejecutivo, ej: 'Antony Cárdenas')",
  "email": "string (Correo corporativo, ej: 'antony.cardenas@aerolink.com')",
  "role": "string ('revenue_manager', 'route_manager', 'corporate_sales_rep')",
  "avatar_url": "string (URL de imagen de perfil)",
  "assigned_hub": "string (Base principal asignada, ej: 'BOG', 'MDE', 'MAD', 'MIA')",
  "quota_amount": "decimal (Cuota mensual de ingresos asignada en EUR/USD)",
  "status": "string ('active', 'inactive')"
}
```

---

## 2. Tabla de Etapas (Pipeline Stages del Ciclo de Reserva y Venta de Vuelos)
Define el embudo comercial desde la solicitud inicial de cupos/vuelo hasta la operación y cierre contable del vuelo.

```json
{
  "id": "string (UUID - ej: 's1', 's2')",
  "name": "string (Nombre técnico: 'Inquiry', 'Reserved', 'Negotiation', 'Confirmed', 'Cancelled')",
  "displayName": "string (Nombre visible en la aerolínea: 'Cotización / Cupos', 'Bloqueo de Asientos', 'Negociación Tarifas', 'Vuelo Emitido / Operado', 'Cancelado')",
  "display_order": "integer (1, 2, 3, 4, 5)",
  "win_probability": "integer (Probabilidad estimada de materialización: 10%, 30%, 60%, 100%, 0%)",
  "color": "string (Color hexadecimal del stage)"
}
```

---

## 3. Tabla de Clientes (Agencias de Viajes, Corporativos y Operadores Turísticos)
Entidades B2B que compran pasajes, cupos y servicios aéreos a la aerolínea.

```json
{
  "id": "string (UUID - ej: 'c1')",
  "company_name": "string (Nombre de la empresa o agencia, ej: 'Expedia Global Partners', 'TechSolutions Corporate Travel')",
  "industry": "string (Sector: 'Agencia Mayorista', 'Viajes Corporativos', 'Operador Turístico', 'Logística & Delegaciones')",
  "contact_person": "string (Gestor de viajes / Travel Manager)",
  "email": "string (Email de contacto)",
  "phone": "string (Teléfono directo)",
  "frequent_flyer_tier": "string ('Platinum Corporate', 'Gold Star', 'Silver Sky')",
  "preferred_hub": "string (Hub habitual, ej: 'MAD', 'BOG', 'MIA')",
  "address": "string (Sede corporativa)",
  "created_at": "datetime (Fecha de alta como partner comercial)"
}
```

---

## 4. Tabla de Oportunidades y Reservas (Flight Deals & Group Bookings)
Tabla central de hechos del CRM de la aerolínea. Alimenta los KPIs de Ingresos Totales de Pasaje (*Total Flight Revenue*), Reservas Activas, Win Rate de Vuelos y Valor Promedio por Acuerdo (*Avg Deal Size*).

```json
{
  "id": "string (UUID - ej: 'd1')",
  "title": "string (Descripción de la reserva, ej: 'Bloque 50 Asientos BOG-MAD Verano')",
  "customer_id": "string (FK -> Clientes)",
  "owner_id": "string (FK -> Usuarios / Route Managers)",
  "stage_id": "string (FK -> Etapas del Pipeline)",
  
  "flight_number": "string (Código IATA de vuelo, ej: 'AL-120', 'AL-650', 'AL-912')",
  "route": "string (Ruta de vuelo: 'BOG -> MAD', 'MDE -> MIA', 'BOG -> JFK', 'MDE -> CAN')",
  "cabin_class": "string ('Business Class', 'Premium Economy', 'Economy Group', 'First Suite')",
  "booking_type": "string ('individual' para venta de 1 solo asiento, 'group' para bloques, 'charter' para avión completo)",
  "passengers_count": "integer (1 para billete individual unitario, o N para grupos)",
  "seat_number": "string (Opcional, asignación de asiento para venta individual: '1A', '2B', '14C')",
  
  "amount": "decimal (Valor monetario del billete o acuerdo / revenue de vuelo)",
  "currency": "string ('EUR', 'USD')",
  "status": "string ('open', 'won', 'lost')",
  
  "created_at": "datetime (Fecha de apertura del expediente de venta)",
  "expected_close_date": "date (Fecha límite de pago y emisión de billetes)",
  "closed_at": "datetime (Fecha de confirmación y emisión del PNR / billete emitido)",
  "departure_date": "date (Fecha programada del vuelo)",
  
  "loss_reason": "string (Opcional: 'precio_competencia', 'cancelacion_itinerario', 'falta_cupos')"
}
```

---

## Resumen de Relaciones en la Aerolínea
1. **1 Route Manager / Ejecutivo Comercial** gestiona **N Reservas / Oportunidades de Vuelo**.
2. **1 Agencia o Empresa Corporativa** genera **N Oportunidades / Bloques de Pasaje**.
3. **1 Etapa del Pipeline** agrupa **N Oportunidades de Vuelo** para el análisis de Revenue Management y embudo de conversión.
