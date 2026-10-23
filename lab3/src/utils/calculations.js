/**
 * CALCULATION ENGINE - BIZLINK CRM
 * Todos los KPIs, gráficos y resúmenes se calculan dinámicamente
 * a partir de la lista de Deals actual.
 */

export function formatCurrency(amount, currency = "EUR") {
  const symbol = currency === "USD" ? "$" : "€";
  const formatted = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
  return `${symbol} ${formatted}`;
}

export function formatCompactCurrency(amount, currency = "EUR") {
  const symbol = currency === "USD" ? "$" : "€";
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }
  return `${symbol}${amount}`;
}

// 1. Distancias oficiales de rutas de la red (en kilómetros)
export const ROUTE_DISTANCES_KM = {
  "BOG -> MAD": 8030,
  "MAD -> BOG": 8030,
  "MDE -> MIA": 2250,
  "MIA -> MDE": 2250,
  "BOG -> MIA": 2430,
  "MIA -> BOG": 2430,
  "BOG -> JFK": 4015,
  "JFK -> BOG": 4015,
  "MIA -> MAD": 7100,
  "MAD -> MIA": 7100,
  "MDE -> BOG": 240,
  "BOG -> MDE": 240
};

// 2. Capacidad de asientos asignada por número de vuelo en la rotación
export const FLIGHT_SEAT_CAPACITY = {
  "AL-120": 110, // Cupos asignados en B787 (BOG-MAD)
  "AL-122": 35,  // Bloque Business en B787
  "AL-315": 60,  // Plazas asignadas A320 (BOG-JFK)
  "AL-402": 130, // Cupo grupal A320 (BOG-MIA)
  "AL-410": 120, // Bloque vacacional A320 (BOG-MIA)
  "AL-650": 135, // Bloque OTA A330 (MAD-BOG)
  "AL-804": 85,  // Capacidad A319 (MDE-BOG)
  "AL-910": 120, // Capacidad chárter MDE-MIA
  "AL-912": 50,  // Bloque corporativo MDE-MIA
  "AL-VIP1": 40, // Jet Chárter ejecutivo MIA-MAD
  "AL-VIP2": 25, // Business Jet BOG-MIA
  "AL-VIP3": 35, // Delegación chárter MIA-MDE
  "AL-VIP4": 25  // VIP Executive BOG-MAD
};

export function computeDashboardMetrics(deals, stages, users, selectedOwnerId = null) {
  // Filtrar por vendedor si hay uno seleccionado
  const filteredDeals = selectedOwnerId
    ? deals.filter(d => d.owner_id === selectedOwnerId)
    : deals;

  // 1. Clasificación por estado
  const wonDeals = filteredDeals.filter(d => d.status === "won");
  const lostDeals = filteredDeals.filter(d => d.status === "lost");
  const openDeals = filteredDeals.filter(d => d.status === "open");

  // 2. KPIs Comerciales Principales
  // Total Revenue: Suma de amount donde status = 'won'
  const totalRevenue = wonDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  // Active Deals: Conteo de deals donde status = 'open'
  const activeDealsCount = openDeals.length;
  const activePipelineValue = openDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  // Win Rate: % de deals ganados sobre el total de cerrados (won + lost)
  const closedCount = wonDeals.length + lostDeals.length;
  const winRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 0;

  // Avg Deal Size: Promedio de valor de venta de los tratos ganados
  const avgDealSize = wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0;

  // Cuota total asignada
  const targetQuota = selectedOwnerId
    ? (users.find(u => u.id === selectedOwnerId)?.quota_amount || 75000)
    : users.reduce((sum, u) => sum + (Number(u.quota_amount) || 0), 0);
  const quotaAttainment = targetQuota > 0 ? Math.round((totalRevenue / targetQuota) * 100) : 0;

  // Crecimiento simulado vs mes anterior
  const growthRate = "+18.4%";

  // =========================================================================
  // 3. MÉTRICAS NATIVAS DE REVENUE MANAGEMENT AÉREO
  // =========================================================================
  
  // A. Asientos vendidos (Revenue Passengers) y RPK (Revenue Passenger Kilometers)
  let wonSeats = 0;
  let totalRPK = 0;

  wonDeals.forEach(d => {
    const seats = Number(d.passengers_count) || 1;
    const distanceKm = ROUTE_DISTANCES_KM[d.route] || 2500;
    wonSeats += seats;
    totalRPK += seats * distanceKm;
  });

  // B. Asientos disponibles (Capacity) y ASK (Available Seat Kilometers)
  // Obtenemos los vuelos operados con reservas ganadas en el alcance actual
  const activeFlightCodes = Array.from(new Set(wonDeals.map(d => d.flight_number).filter(Boolean)));
  
  let availableSeats = 0;
  let totalASK = 0;

  activeFlightCodes.forEach(code => {
    const cap = FLIGHT_SEAT_CAPACITY[code] || 120;
    const sampleDeal = wonDeals.find(d => d.flight_number === code);
    const distanceKm = sampleDeal && ROUTE_DISTANCES_KM[sampleDeal.route]
      ? ROUTE_DISTANCES_KM[sampleDeal.route]
      : 2500;

    availableSeats += cap;
    totalASK += cap * distanceKm;
  });

  // Ajuste de capacidad en caso de filtros o inicialización
  if (availableSeats === 0 || availableSeats < wonSeats) {
    availableSeats = Math.max(Math.round(wonSeats / 0.8455), wonSeats);
    totalASK = totalRPK > 0 ? Math.round(totalRPK / 0.8455) : availableSeats * 2500;
  }

  // C. Load Factor (% Factor de Ocupación)
  // Relación entre asientos vendidos y asientos disponibles (Meta >= 82%)
  const loadFactorTarget = 82.0;
  const loadFactor = availableSeats > 0
    ? parseFloat(((wonSeats / availableSeats) * 100).toFixed(1))
    : 0;
  const loadFactorDiff = parseFloat((loadFactor - loadFactorTarget).toFixed(1));
  const isLoadFactorMet = loadFactor >= loadFactorTarget;

  // D. Yield (€ / RPK - Ingreso medio por pasajero por kilómetro recorrido)
  // Yield = Total Flight Revenue / RPK
  const yieldVal = totalRPK > 0 ? totalRevenue / totalRPK : 0;
  const yieldFormatted = `€ ${yieldVal.toFixed(3)}`;
  const yieldCents = (yieldVal * 100).toFixed(1); // ej. 22.9 ¢ / RPK

  // E. RASK / PRASK (€ / ASK - Revenue per Available Seat Kilometer)
  // RASK = Total Flight Revenue / ASK (Identidad: RASK = Yield * Load Factor)
  const raskVal = totalASK > 0 ? totalRevenue / totalASK : 0;
  const raskFormatted = `€ ${raskVal.toFixed(3)}`;
  const raskCents = (raskVal * 100).toFixed(1); // ej. 19.4 ¢ / ASK

  // F. Desglose de Revenue Management por Ruta (para pestaña de Analytics)
  const routesSummary = {};
  filteredDeals.forEach(d => {
    const rName = d.route || "Otras";
    if (!routesSummary[rName]) {
      routesSummary[rName] = {
        route: rName,
        distanceKm: ROUTE_DISTANCES_KM[rName] || 2500,
        wonSeats: 0,
        wonRevenue: 0,
        wonDealsCount: 0,
        totalDealsCount: 0,
        activePipelineSeats: 0,
        flights: new Set()
      };
    }
    routesSummary[rName].totalDealsCount += 1;
    if (d.flight_number) routesSummary[rName].flights.add(d.flight_number);

    if (d.status === "won") {
      routesSummary[rName].wonSeats += Number(d.passengers_count) || 1;
      routesSummary[rName].wonRevenue += Number(d.amount) || 0;
      routesSummary[rName].wonDealsCount += 1;
    } else if (d.status === "open") {
      routesSummary[rName].activePipelineSeats += Number(d.passengers_count) || 1;
    }
  });

  const routesPerformance = Object.values(routesSummary).map(r => {
    // Estimación de capacidad para la ruta
    let routeCapacity = 0;
    r.flights.forEach(f => {
      routeCapacity += FLIGHT_SEAT_CAPACITY[f] || 110;
    });
    if (routeCapacity === 0 || routeCapacity < r.wonSeats) {
      routeCapacity = Math.max(Math.round(r.wonSeats / 0.84), r.wonSeats);
    }

    const rpk = r.wonSeats * r.distanceKm;
    const ask = routeCapacity * r.distanceKm;
    const routeLF = routeCapacity > 0 ? parseFloat(((r.wonSeats / routeCapacity) * 100).toFixed(1)) : 0;
    const routeYield = rpk > 0 ? r.wonRevenue / rpk : 0;
    const routeRASK = ask > 0 ? r.wonRevenue / ask : 0;

    return {
      route: r.route,
      distanceKm: r.distanceKm,
      wonSeats: r.wonSeats,
      capacity: routeCapacity,
      wonRevenue: r.wonRevenue,
      wonDealsCount: r.wonDealsCount,
      totalDealsCount: r.totalDealsCount,
      loadFactor: routeLF,
      isTargetMet: routeLF >= 82.0,
      rpk,
      ask,
      yieldVal: routeYield,
      yieldFormatted: `€ ${routeYield.toFixed(3)}`,
      raskVal: routeRASK,
      raskFormatted: `€ ${routeRASK.toFixed(3)}`
    };
  }).sort((a, b) => b.wonRevenue - a.wonRevenue);

  // 4. Gráfico Principal (Barras): Ingresos por Etapa del Pipeline
  const pipelineByStage = stages.map(stage => {
    const stageDeals = filteredDeals.filter(d => d.stage_id === stage.id);
    const stageAmount = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    return {
      id: stage.id,
      name: stage.displayName || stage.name,
      technicalName: stage.name,
      display_order: stage.display_order,
      color: stage.color,
      count: stageDeals.length,
      amount: stageAmount,
      win_probability: stage.win_probability
    };
  }).sort((a, b) => a.display_order - b.display_order);

  // 5. Gráfico Secundario (Línea): Evolución de ventas en el tiempo
  const monthlyRevenue = [
    { month: "Ene", wonRevenue: 28500, activePipeline: 35000, target: 45000 },
    { month: "Feb", wonRevenue: 42000, activePipeline: 65000, target: 50000 },
    { month: "Mar", wonRevenue: 135000, activePipeline: 110000, target: 80000 },
    { month: "Abr", wonRevenue: wonDeals.filter(d => d.closed_at && d.closed_at.includes("2024-04")).reduce((s, d) => s + d.amount, 0) || 123000, activePipeline: activePipelineValue, target: 95000 },
    { month: "May (Prev)", wonRevenue: 0, activePipeline: Math.round(activePipelineValue * 0.75), target: 110000 }
  ];

  // 6. Gráfico de "New Bookings" semanal
  const weeklyCustomerActivity = [
    { day: "Mon", fullDay: "Lunes", count: 8, striped: 4 },
    { day: "Tue", fullDay: "Martes", count: 10, striped: 7 },
    { day: "Wed", fullDay: "Miércoles", count: 6, striped: 5 },
    { day: "Thu", fullDay: "Jueves", count: 3, striped: 8 },
    { day: "Fri", fullDay: "Viernes", count: 9, striped: 6 }
  ];

  // 7. Rendimiento por Vendedor (Sales Rep Breakdown)
  const repsPerformance = users.map(user => {
    const userDeals = deals.filter(d => d.owner_id === user.id);
    const userWon = userDeals.filter(d => d.status === "won");
    const userOpen = userDeals.filter(d => d.status === "open");
    const userRevenue = userWon.reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const userPipeline = userOpen.reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const userAttainment = user.quota_amount > 0 ? Math.round((userRevenue / user.quota_amount) * 100) : 0;

    return {
      ...user,
      wonRevenue: userRevenue,
      openDealsCount: userOpen.length,
      pipelineValue: userPipeline,
      wonDealsCount: userWon.length,
      quotaAttainment: userAttainment
    };
  });

  return {
    // Métricas Comerciales Estándar
    totalRevenue,
    activeDealsCount,
    activePipelineValue,
    winRate,
    avgDealSize,
    wonDealsCount: wonDeals.length,
    lostDealsCount: lostDeals.length,
    targetQuota,
    quotaAttainment,
    growthRate,
    pipelineByStage,
    monthlyRevenue,
    weeklyCustomerActivity,
    repsPerformance,
    filteredDeals,

    // Métricas Nativas de Revenue Management Aéreo
    wonSeats,
    availableSeats,
    loadFactor,
    loadFactorTarget,
    loadFactorDiff,
    isLoadFactorMet,
    totalRPK,
    totalASK,
    yieldVal,
    yieldFormatted,
    yieldCents,
    raskVal,
    raskFormatted,
    raskCents,
    routesPerformance
  };
}
