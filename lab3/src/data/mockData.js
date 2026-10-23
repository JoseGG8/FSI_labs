/**
 * MOCK DATA STORE - AEROLINK AIRLINE CRM
 * Estructura de datos adaptada para la gestión comercial y Revenue Management
 * de una Aerolínea Internacional (Vuelos, Bloques de Asientos, Agencias y Cuentas Corporativas).
 */

// 1. USUARIOS (Route Managers, Revenue Managers y Ejecutivos Comerciales)
export const initialUsers = [
  {
    id: "u1",
    full_name: "Antony Cárdenas",
    email: "antony.cardenas@aerolink.com",
    role: "route_manager",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quota_amount: 95000,
    assigned_hub: "BOG / MAD",
    status: "active"
  },
  {
    id: "u2",
    full_name: "Sandra Perry",
    email: "sandra.perry@aerolink.com",
    role: "revenue_manager",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    quota_amount: 130000,
    assigned_hub: "Red Global",
    status: "active"
  },
  {
    id: "u3",
    full_name: "Jamal Connolly",
    email: "jamal.connolly@aerolink.com",
    role: "corporate_sales_rep",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quota_amount: 75000,
    assigned_hub: "MIA / Caribe",
    status: "active"
  },
  {
    id: "u4",
    full_name: "Cara Carr",
    email: "cara.carr@aerolink.com",
    role: "route_manager",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    quota_amount: 70000,
    assigned_hub: "MDE / Andina",
    status: "active"
  }
];

// 2. ETAPAS (Pipeline del Ciclo de Reserva y Emisión de Vuelos)
export const initialStages = [
  {
    id: "s1",
    name: "Inquiry",
    displayName: "Cotización / Cupos",
    display_order: 1,
    win_probability: 10,
    color: "#64748B",
    bgLight: "#F1F5F9"
  },
  {
    id: "s2",
    name: "Reserved",
    displayName: "Bloqueo Asientos",
    display_order: 2,
    win_probability: 30,
    color: "#3B82F6",
    bgLight: "#EFF6FF"
  },
  {
    id: "s3",
    name: "Negotiation",
    displayName: "Tarifas Corporativas",
    display_order: 3,
    win_probability: 60,
    color: "#F97316", // Acento naranja/coral
    bgLight: "#FFF7ED"
  },
  {
    id: "s4",
    name: "Closed Won",
    displayName: "Vuelo Emitido",
    display_order: 4,
    win_probability: 100,
    color: "#10B981", // Acento verde para vuelos confirmados y operados
    bgLight: "#ECFDF5"
  },
  {
    id: "s5",
    name: "Closed Lost",
    displayName: "Cancelado / No-show",
    display_order: 5,
    win_probability: 0,
    color: "#EF4444",
    bgLight: "#FEF2F2"
  }
];

// 3. CLIENTES DE LA AEROLÍNEA (Agencias de Viajes, Convenios Corporativos y Chárter)
export const initialCustomers = [
  {
    id: "c1",
    company_name: "Viajes El Corte Inglés",
    industry: "Agencia Mayorista",
    contact_person: "Elena Vance",
    email: "corporativo@elcorteingles.viajes",
    phone: "+34 91 234 8901",
    address: "Paseo de la Castellana 112, Madrid, ES",
    frequent_flyer_tier: "Platinum Corporate",
    preferred_hub: "MAD",
    description: "Consorcio mayorista de viajes corporativos y paquetes transatlánticos Madrid-Bogotá",
    created_at: "2024-03-01T09:00:00Z"
  },
  {
    id: "c2",
    company_name: "Expedia Global Partners",
    industry: "OTA / Online Travel",
    contact_person: "Marcus Thorne",
    email: "air-partners@expedia.com",
    phone: "+1 (555) 345-6789",
    address: "1111 Expedia Group Way, Seattle, WA",
    frequent_flyer_tier: "Executive Partner",
    preferred_hub: "MIA",
    description: "Distribución online de bloques de asientos en rutas intercontinentales",
    created_at: "2024-03-02T10:30:00Z"
  },
  {
    id: "c3",
    company_name: "TechSolutions B2B Travel",
    industry: "Viajes Corporativos",
    contact_person: "Carlos Ruiz",
    email: "travel@techsolutions.com",
    phone: "+1 (555) 456-7890",
    address: "780 Innovation Blvd, Austin, TX",
    frequent_flyer_tier: "Gold Star Corporate",
    preferred_hub: "BOG",
    description: "Convenio corporativo de traslados ejecutivos y pasajes Business Class para ingenieros",
    created_at: "2024-03-05T11:15:00Z"
  },
  {
    id: "c4",
    company_name: "Despegar Travel Network",
    industry: "OTA / Agencias",
    contact_person: "David Kim",
    email: "airline-ops@despegar.com",
    phone: "+54 11 567 8901",
    address: "Av. Corrientes 1400, Buenos Aires, AR",
    frequent_flyer_tier: "Platinum Corporate",
    preferred_hub: "BOG",
    description: "Integración API directa de inventario de plazas para temporada alta de verano",
    created_at: "2024-03-06T14:20:00Z"
  },
  {
    id: "c5",
    company_name: "Prime Aviation & Charter Jets",
    industry: "Chárter y Delegaciones",
    contact_person: "Antony Cárdenas",
    email: "charter@primeaviation.aero",
    phone: "+1 (305) 902-4411",
    address: "Executive Hangar 4, Miami Airport, FL 33142",
    frequent_flyer_tier: "VIP Head of State",
    preferred_hub: "MIA",
    description: "Operador de vuelos privados, delegaciones deportivas y chárters corporativos de alta gama",
    created_at: "2024-03-07T08:00:00Z"
  },
  {
    id: "c6",
    company_name: "Banco Santander Executive Flights",
    industry: "Banca y Finanzas",
    contact_person: "Dr. Aris Vance",
    email: "mobility@santander.com",
    phone: "+34 91 678 9012",
    address: "Ciudad Grupo Santander, Boadilla del Monte, ES",
    frequent_flyer_tier: "Platinum Corporate",
    preferred_hub: "MAD",
    description: "Convenio anual de boletos ejecutivos en cabina Business Class para directivos",
    created_at: "2024-03-08T16:45:00Z"
  },
  {
    id: "c7",
    company_name: "Andean Mining Transport Group",
    industry: "Minería & Energía",
    contact_person: "Mateo Rossi",
    email: "flights@andeanmining.com",
    phone: "+57 4 012-3456",
    address: "Torre Empresarial Milla de Oro, Medellín, CO",
    frequent_flyer_tier: "Gold Star",
    preferred_hub: "MDE",
    description: "Vuelos de relevo quincenal de cuadrillas de ingenieros y especialistas mineros",
    created_at: "2024-03-09T13:10:00Z"
  },
  {
    id: "c8",
    company_name: "American Tour Operators Consortium",
    industry: "Operador Turístico",
    contact_person: "Liam Gallagher",
    email: "groups@americantours.org",
    phone: "+1 (555) 890-1234",
    address: "50 Fifth Avenue, New York, NY",
    frequent_flyer_tier: "Silver Sky",
    preferred_hub: "MIA",
    description: "Bloqueos masivos de asientos para caravanas turísticas en el Caribe y Sudamérica",
    created_at: "2024-03-10T12:00:00Z"
  },
  {
    id: "c9",
    company_name: "Global Pharma Air Transport",
    industry: "Farmacéutica y Salud",
    contact_person: "Hannah Schmidt",
    email: "travel@globalpharma.ch",
    phone: "+41 22 901 2345",
    address: "Health District 12, Basel, CH",
    frequent_flyer_tier: "Platinum Corporate",
    preferred_hub: "MAD",
    description: "Traslado de misiones científicas y contingentes para congresos mundiales de medicina",
    created_at: "2024-03-11T11:30:00Z"
  },
  {
    id: "c10",
    company_name: "NextGen University Academic Exchange",
    industry: "Educación Superior",
    contact_person: "Dean Arthur Pendelton",
    email: "exchanges@nextgen.edu",
    phone: "+1 (555) 234-5678",
    address: "100 Academic Circle, Cambridge, MA",
    frequent_flyer_tier: "Standard Group",
    preferred_hub: "BOG",
    description: "Programa de movilidad internacional para 120 becarios y profesores universitarios",
    created_at: "2024-03-14T10:00:00Z"
  }
];

// 4. DEALS (Oportunidades de Venta y Reservas de Vuelos)
export const initialDeals = [
  // COTIZACIÓN / CUPOS (Stage s1 - Inquiry, status: open)
  {
    id: "d1",
    title: "Bloque 45 Asientos Temporada Verano",
    flight_number: "AL-120",
    route: "BOG -> MAD",
    cabin_class: "Economy Group",
    passengers_count: 45,
    customer_id: "c1", // Viajes El Corte Inglés
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s1",
    amount: 38500,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-18T10:00:00Z",
    departure_date: "2024-07-15",
    expected_close_date: "2024-05-30",
    comments_count: 2,
    attachments_count: 1
  },
  {
    id: "d2",
    title: "Vuelo Chárter Delegación Deportiva",
    flight_number: "AL-910",
    route: "MDE -> MIA",
    cabin_class: "Executive Charter",
    passengers_count: 65,
    customer_id: "c8", // American Tour Operators
    owner_id: "u4", // Cara Carr
    stage_id: "s1",
    amount: 54000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-21T11:30:00Z",
    departure_date: "2024-06-20",
    expected_close_date: "2024-05-25",
    comments_count: 4,
    attachments_count: 3
  },
  {
    id: "d3",
    title: "Traslado Grupo 120 Estudiantes Intercambio",
    flight_number: "AL-402",
    route: "BOG -> MIA",
    cabin_class: "Economy Group",
    passengers_count: 120,
    customer_id: "c10", // NextGen University
    owner_id: "u3", // Jamal Connolly
    stage_id: "s1",
    amount: 48000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-20T14:00:00Z",
    departure_date: "2024-08-10",
    expected_close_date: "2024-06-15",
    comments_count: 1,
    attachments_count: 2
  },
  {
    id: "d4",
    title: "Bloque 20 Plazas Corporativas BOG-JFK",
    flight_number: "AL-315",
    route: "BOG -> JFK",
    cabin_class: "Premium Economy",
    passengers_count: 20,
    customer_id: "c3", // TechSolutions
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s1",
    amount: 26000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-22T09:15:00Z",
    departure_date: "2024-06-05",
    expected_close_date: "2024-05-20",
    comments_count: 3,
    attachments_count: 1
  },

  // BLOQUEO DE ASIENTOS (Stage s2 - Reserved, status: open)
  {
    id: "d5",
    title: "Bloqueo Asientos Promoción Invierno OTA",
    flight_number: "AL-650",
    route: "MAD -> BOG",
    cabin_class: "Economy Group",
    passengers_count: 85,
    customer_id: "c2", // Expedia Group
    owner_id: "u2", // Sandra Perry
    stage_id: "s2",
    amount: 62500,
    currency: "EUR",
    status: "open",
    created_at: "2024-03-09T08:45:00Z",
    departure_date: "2024-07-02",
    expected_close_date: "2024-05-15",
    comments_count: 4,
    attachments_count: 1
  },
  {
    id: "d6",
    title: "Relevo Cuadrilla Minera Vuelo Especial",
    flight_number: "AL-804",
    route: "MDE -> BOG",
    cabin_class: "Economy Group",
    passengers_count: 50,
    customer_id: "c7", // Andean Mining
    owner_id: "u4", // Cara Carr
    stage_id: "s2",
    amount: 22800,
    currency: "EUR",
    status: "open",
    created_at: "2024-03-15T16:20:00Z",
    departure_date: "2024-05-28",
    expected_close_date: "2024-05-18",
    comments_count: 7,
    attachments_count: 2
  },
  {
    id: "d7",
    title: "Cupo Fijo 30 Plazas Semanales Despegar",
    flight_number: "AL-410",
    route: "BOG -> MIA",
    cabin_class: "Economy Group",
    passengers_count: 30,
    customer_id: "c4", // Despegar
    owner_id: "u3", // Jamal Connolly
    stage_id: "s2",
    amount: 34500,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-23T13:40:00Z",
    departure_date: "2024-06-18",
    expected_close_date: "2024-06-10",
    comments_count: 2,
    attachments_count: 5
  },
  {
    id: "d8",
    title: "Misión Médica Congreso Ginebra",
    flight_number: "AL-122",
    route: "BOG -> MAD",
    cabin_class: "Business Class",
    passengers_count: 18,
    customer_id: "c9", // Global Pharma
    owner_id: "u2", // Sandra Perry
    stage_id: "s2",
    amount: 41000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-12T10:10:00Z",
    departure_date: "2024-07-20",
    expected_close_date: "2024-05-22",
    comments_count: 3,
    attachments_count: 2
  },

  // TARIFAS CORPORATIVAS / NEGOCIACIÓN (Stage s3 - Negotiation, status: open)
  {
    id: "d9",
    title: "Vuelo Chárter Exclusivo Cumbre Iberoamericana",
    flight_number: "AL-VIP1",
    route: "MIA -> MAD",
    cabin_class: "Executive Charter",
    passengers_count: 35,
    customer_id: "c5", // Prime Aviation (Featured dark card!)
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s3",
    amount: 78500,
    currency: "EUR",
    status: "open",
    created_at: "2024-03-16T12:00:00Z",
    departure_date: "2024-05-12",
    expected_close_date: "2024-04-30",
    comments_count: 1,
    attachments_count: 1,
    isFeatured: true
  },
  {
    id: "d10",
    title: "Convenio Corporativo Anual 200 Asientos Business",
    flight_number: "AL-650",
    route: "MAD -> BOG",
    cabin_class: "Business Class",
    passengers_count: 40,
    customer_id: "c6", // Banco Santander
    owner_id: "u2", // Sandra Perry
    stage_id: "s3",
    amount: 68000,
    currency: "EUR",
    status: "open",
    created_at: "2024-03-10T14:30:00Z",
    departure_date: "2024-06-01",
    expected_close_date: "2024-05-05",
    comments_count: 5,
    attachments_count: 4
  },
  {
    id: "d11",
    title: "Bloque 60 Asientos Feria Tecnológica Miami",
    flight_number: "AL-912",
    route: "MDE -> MIA",
    cabin_class: "Premium Economy",
    passengers_count: 60,
    customer_id: "c3", // TechSolutions
    owner_id: "u3", // Jamal Connolly
    stage_id: "s3",
    amount: 52000,
    currency: "EUR",
    status: "open",
    created_at: "2024-03-30T10:00:00Z",
    departure_date: "2024-06-14",
    expected_close_date: "2024-05-12",
    comments_count: 4,
    attachments_count: 7
  },
  {
    id: "d12",
    title: "Vuelo Especial de Vacaciones Grupo Familiar",
    flight_number: "AL-402",
    route: "BOG -> MIA",
    cabin_class: "Economy Group",
    passengers_count: 75,
    customer_id: "c1", // Viajes El Corte Inglés
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s3",
    amount: 46000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-02T11:00:00Z",
    departure_date: "2024-07-08",
    expected_close_date: "2024-05-19",
    comments_count: 2,
    attachments_count: 3
  },
  {
    id: "d13",
    title: "Bloque Interlinea Europa 50 Pasajeros",
    flight_number: "AL-120",
    route: "BOG -> MAD",
    cabin_class: "Economy Group",
    passengers_count: 50,
    customer_id: "c2", // Expedia Group
    owner_id: "u4", // Cara Carr
    stage_id: "s3",
    amount: 49500,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-05T09:30:00Z",
    departure_date: "2024-07-22",
    expected_close_date: "2024-05-08",
    comments_count: 3,
    attachments_count: 2
  },

  // VUELO EMITIDO / CERRADO (Stage s4 - Closed Won, status: won)
  {
    id: "d14",
    title: "Emisión 60 Plazas Madrid-Bogotá Fiestas",
    flight_number: "AL-650",
    route: "MAD -> BOG",
    cabin_class: "Economy Group",
    passengers_count: 60,
    customer_id: "c1", // Viajes El Corte Inglés
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s4",
    amount: 55000,
    currency: "EUR",
    status: "won",
    created_at: "2024-02-15T09:00:00Z",
    closed_at: "2024-03-24T15:30:00Z",
    departure_date: "2024-04-10",
    comments_count: 2,
    attachments_count: 1
  },
  {
    id: "d15",
    title: "Chárter Corporativo Ejecutivo Directivos",
    flight_number: "AL-VIP2",
    route: "BOG -> MIA",
    cabin_class: "Executive Charter",
    passengers_count: 22,
    customer_id: "c6", // Banco Santander
    owner_id: "u2", // Sandra Perry
    stage_id: "s4",
    amount: 62000,
    currency: "EUR",
    status: "won",
    created_at: "2024-02-20T11:00:00Z",
    closed_at: "2024-04-05T17:15:00Z",
    departure_date: "2024-04-18",
    comments_count: 1,
    attachments_count: 3
  },
  {
    id: "d16",
    title: "Emisión Bloque Verano 90 Asientos Expedia",
    flight_number: "AL-120",
    route: "BOG -> MAD",
    cabin_class: "Economy Group",
    passengers_count: 90,
    customer_id: "c2", // Expedia
    owner_id: "u3", // Jamal Connolly
    stage_id: "s4",
    amount: 74000,
    currency: "EUR",
    status: "won",
    created_at: "2024-02-10T14:00:00Z",
    closed_at: "2024-03-30T16:00:00Z",
    departure_date: "2024-05-15",
    comments_count: 4,
    attachments_count: 7
  },
  {
    id: "d17",
    title: "Convenio Traslado Equipos Médicos Basel",
    flight_number: "AL-122",
    route: "BOG -> MAD",
    cabin_class: "Business Class",
    passengers_count: 28,
    customer_id: "c9", // Global Pharma
    owner_id: "u2", // Sandra Perry
    stage_id: "s4",
    amount: 64000,
    currency: "EUR",
    status: "won",
    created_at: "2024-01-25T10:00:00Z",
    closed_at: "2024-03-12T11:45:00Z",
    departure_date: "2024-04-02",
    comments_count: 6,
    attachments_count: 5
  },
  {
    id: "d18",
    title: "Vuelo Especial Rotación de Turnos Mineros",
    flight_number: "AL-804",
    route: "MDE -> BOG",
    cabin_class: "Economy Group",
    passengers_count: 70,
    customer_id: "c7", // Andean Mining
    owner_id: "u4", // Cara Carr
    stage_id: "s4",
    amount: 32000,
    currency: "EUR",
    status: "won",
    created_at: "2024-01-18T13:30:00Z",
    closed_at: "2024-02-28T14:20:00Z",
    departure_date: "2024-03-10",
    comments_count: 3,
    attachments_count: 2
  },
  {
    id: "d19",
    title: "Bloque Pasajes 40 Ingenieros Software",
    flight_number: "AL-912",
    route: "MDE -> MIA",
    cabin_class: "Business Class",
    passengers_count: 40,
    customer_id: "c3", // TechSolutions
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s4",
    amount: 47000,
    currency: "EUR",
    status: "won",
    created_at: "2024-02-01T15:00:00Z",
    closed_at: "2024-03-18T18:00:00Z",
    departure_date: "2024-04-05",
    comments_count: 5,
    attachments_count: 3
  },
  {
    id: "d20",
    title: "Venta Mayorista Paquete Caribe 110 Pasajeros",
    flight_number: "AL-402",
    route: "BOG -> MIA",
    cabin_class: "Economy Group",
    passengers_count: 110,
    customer_id: "c4", // Despegar
    owner_id: "u3", // Jamal Connolly
    stage_id: "s4",
    amount: 58000,
    currency: "EUR",
    status: "won",
    created_at: "2024-02-05T09:20:00Z",
    closed_at: "2024-03-29T12:00:00Z",
    departure_date: "2024-04-25",
    comments_count: 2,
    attachments_count: 4
  },
  {
    id: "d21",
    title: "Chárter Privado Miami-Medellín Cumbre Empresarial",
    flight_number: "AL-VIP3",
    route: "MIA -> MDE",
    cabin_class: "Executive Charter",
    passengers_count: 30,
    customer_id: "c5", // Prime Aviation
    owner_id: "u4", // Cara Carr
    stage_id: "s4",
    amount: 69000,
    currency: "EUR",
    status: "won",
    created_at: "2024-02-14T10:00:00Z",
    closed_at: "2024-04-14T15:10:00Z",
    departure_date: "2024-05-01",
    comments_count: 3,
    attachments_count: 1
  },
  {
    id: "d22",
    title: "Emisión 50 Billetes BOG-JFK Corporate",
    flight_number: "AL-315",
    route: "BOG -> JFK",
    cabin_class: "Premium Economy",
    passengers_count: 50,
    customer_id: "c1", // El Corte Inglés
    owner_id: "u2", // Sandra Perry
    stage_id: "s4",
    amount: 53000,
    currency: "EUR",
    status: "won",
    created_at: "2024-02-22T13:00:00Z",
    closed_at: "2024-04-02T16:30:00Z",
    departure_date: "2024-04-20",
    comments_count: 4,
    attachments_count: 6
  },

  // CANCELADO / NO-SHOW (Stage s5 - Closed Lost, status: lost)
  {
    id: "d23",
    title: "Cotización Chárter Delegación Deportiva",
    flight_number: "AL-910",
    route: "MDE -> MIA",
    cabin_class: "Executive Charter",
    passengers_count: 55,
    customer_id: "c8", // American Tour
    owner_id: "u3", // Jamal Connolly
    stage_id: "s5",
    amount: 45000,
    currency: "EUR",
    status: "lost",
    created_at: "2024-01-10T10:00:00Z",
    closed_at: "2024-02-20T17:00:00Z",
    loss_reason: "Eligieron vuelo regular de aerolínea competidora por horario",
    comments_count: 3,
    attachments_count: 1
  },
  {
    id: "d24",
    title: "Bloque 80 Plazas Concierto Bogotá",
    flight_number: "AL-410",
    route: "BOG -> MIA",
    cabin_class: "Economy Group",
    passengers_count: 80,
    customer_id: "c4", // Despegar
    owner_id: "u4", // Cara Carr
    stage_id: "s5",
    amount: 42000,
    currency: "EUR",
    status: "lost",
    created_at: "2024-01-15T11:00:00Z",
    closed_at: "2024-02-25T14:00:00Z",
    loss_reason: "Cancelación de evento por parte de la productora",
    comments_count: 2,
    attachments_count: 2
  },
  {
    id: "d25",
    title: "Convenio Anual Pasajes Ejecutivos Europa",
    flight_number: "AL-120",
    route: "BOG -> MAD",
    cabin_class: "Business Class",
    passengers_count: 30,
    customer_id: "c6", // Banco Santander
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s5",
    amount: 51000,
    currency: "EUR",
    status: "lost",
    created_at: "2024-02-01T14:30:00Z",
    closed_at: "2024-03-10T12:00:00Z",
    loss_reason: "Presupuesto de viajes congelado por la matriz bancaria",
    comments_count: 5,
    attachments_count: 3
  },
  {
    id: "d26",
    title: "Vuelo Chárter Escolar Fin de Curso",
    flight_number: "AL-402",
    route: "BOG -> MIA",
    cabin_class: "Economy Group",
    passengers_count: 95,
    customer_id: "c10", // NextGen University
    owner_id: "u2", // Sandra Perry
    stage_id: "s5",
    amount: 39000,
    currency: "EUR",
    status: "lost",
    created_at: "2024-02-12T09:00:00Z",
    closed_at: "2024-03-22T16:00:00Z",
    loss_reason: "Falta de acuerdo en el anticipo del depósito requerido",
    comments_count: 1,
    attachments_count: 1
  },

  // MÁS VUELOS Y RESERVAS ACTIVAS RECIENTES
  {
    id: "d27",
    title: "Bloque 40 Asientos Temporada Otoño BOG-MAD",
    flight_number: "AL-120",
    route: "BOG -> MAD",
    cabin_class: "Economy Group",
    passengers_count: 40,
    customer_id: "c1", // El Corte Inglés
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s3",
    amount: 36000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-15T11:00:00Z",
    departure_date: "2024-09-05",
    expected_close_date: "2024-05-28",
    comments_count: 3,
    attachments_count: 2
  },
  {
    id: "d28",
    title: "Reserva 25 Asientos Premium Economy MDE-MIA",
    flight_number: "AL-912",
    route: "MDE -> MIA",
    cabin_class: "Premium Economy",
    passengers_count: 25,
    customer_id: "c3", // TechSolutions
    owner_id: "u3", // Jamal Connolly
    stage_id: "s2",
    amount: 28500,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-19T14:00:00Z",
    departure_date: "2024-06-25",
    expected_close_date: "2024-06-05",
    comments_count: 1,
    attachments_count: 4
  },
  {
    id: "d29",
    title: "Vuelo Chárter Científico Delegación Médica",
    flight_number: "AL-VIP4",
    route: "BOG -> MAD",
    cabin_class: "Executive Charter",
    passengers_count: 20,
    customer_id: "c9", // Global Pharma
    owner_id: "u2", // Sandra Perry
    stage_id: "s1",
    amount: 58000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-24T09:30:00Z",
    departure_date: "2024-07-30",
    expected_close_date: "2024-06-15",
    comments_count: 2,
    attachments_count: 1
  },
  {
    id: "d30",
    title: "Bloque 70 Plazas Vuelo BOG-JFK Verano",
    flight_number: "AL-315",
    route: "BOG -> JFK",
    cabin_class: "Economy Group",
    passengers_count: 70,
    customer_id: "c2", // Expedia Group
    owner_id: "u4", // Cara Carr
    stage_id: "s3",
    amount: 56000,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-14T16:00:00Z",
    departure_date: "2024-07-12",
    expected_close_date: "2024-05-18",
    comments_count: 6,
    attachments_count: 3
  },
  {
    id: "d31",
    title: "Emisión Confirmada 55 Billetes Business Class",
    flight_number: "AL-650",
    route: "MAD -> BOG",
    cabin_class: "Business Class",
    passengers_count: 55,
    customer_id: "c6", // Banco Santander
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s4",
    amount: 72000,
    currency: "EUR",
    status: "won",
    created_at: "2024-03-01T10:00:00Z",
    closed_at: "2024-04-19T17:00:00Z",
    departure_date: "2024-05-10",
    comments_count: 8,
    attachments_count: 5
  },

  // VENTAS INDIVIDUALES (1 SOLO ASIENTO / BILLETES UNITARIOS)
  {
    id: "d32",
    title: "Billete Individual Business Class (Asiento 2A)",
    flight_number: "AL-120",
    route: "BOG -> MAD",
    cabin_class: "Business Class",
    booking_type: "individual",
    passengers_count: 1,
    seat_number: "2A",
    customer_id: "c6", // Banco Santander
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s4",
    amount: 2850,
    currency: "EUR",
    status: "won",
    created_at: "2024-03-25T11:00:00Z",
    closed_at: "2024-04-02T16:00:00Z",
    departure_date: "2024-05-18",
    comments_count: 1,
    attachments_count: 2
  },
  {
    id: "d33",
    title: "Reserva Individual Primera Suite VIP (Asiento 1F)",
    flight_number: "AL-VIP1",
    route: "MIA -> MAD",
    cabin_class: "First Suite",
    booking_type: "individual",
    passengers_count: 1,
    seat_number: "1F",
    customer_id: "c5", // Prime Aviation
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s3",
    amount: 4900,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-16T14:30:00Z",
    departure_date: "2024-06-02",
    expected_close_date: "2024-05-10",
    comments_count: 3,
    attachments_count: 1
  },
  {
    id: "d34",
    title: "Puente Aéreo Corporativo Flexible (Asiento 3C)",
    flight_number: "AL-804",
    route: "MDE -> BOG",
    cabin_class: "Premium Economy",
    booking_type: "individual",
    passengers_count: 1,
    seat_number: "3C",
    customer_id: "c3", // TechSolutions
    owner_id: "u4", // Cara Carr
    stage_id: "s4",
    amount: 290,
    currency: "EUR",
    status: "won",
    created_at: "2024-04-10T08:15:00Z",
    closed_at: "2024-04-12T09:30:00Z",
    departure_date: "2024-04-28",
    comments_count: 1,
    attachments_count: 1
  },
  {
    id: "d35",
    title: "Billete Urgente Conferencia Miami (Asiento 14B)",
    flight_number: "AL-912",
    route: "MDE -> MIA",
    cabin_class: "Economy Flexible",
    booking_type: "individual",
    passengers_count: 1,
    seat_number: "14B",
    customer_id: "c3", // TechSolutions
    owner_id: "u3", // Jamal Connolly
    stage_id: "s2",
    amount: 680,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-20T17:00:00Z",
    departure_date: "2024-06-11",
    expected_close_date: "2024-05-25",
    comments_count: 2,
    attachments_count: 1
  },
  {
    id: "d36",
    title: "Billete Individual Transatlántico (Asiento 4K)",
    flight_number: "AL-650",
    route: "MAD -> BOG",
    cabin_class: "Business Class",
    booking_type: "individual",
    passengers_count: 1,
    seat_number: "4K",
    customer_id: "c1", // Viajes El Corte Inglés
    owner_id: "u2", // Sandra Perry
    stage_id: "s4",
    amount: 2650,
    currency: "EUR",
    status: "won",
    created_at: "2024-03-20T10:00:00Z",
    closed_at: "2024-04-05T14:15:00Z",
    departure_date: "2024-05-22",
    comments_count: 2,
    attachments_count: 2
  },
  {
    id: "d37",
    title: "Cotización Billete Directivo BOG-JFK (Asiento 2B)",
    flight_number: "AL-315",
    route: "BOG -> JFK",
    cabin_class: "Business Class",
    booking_type: "individual",
    passengers_count: 1,
    seat_number: "2B",
    customer_id: "c9", // Global Pharma
    owner_id: "u1", // Antony Cárdenas
    stage_id: "s1",
    amount: 2150,
    currency: "EUR",
    status: "open",
    created_at: "2024-04-22T13:40:00Z",
    departure_date: "2024-07-05",
    expected_close_date: "2024-06-01",
    comments_count: 1,
    attachments_count: 1
  },
  {
    id: "d38",
    title: "Billete Individual Cancelado No-show (Asiento 21D)",
    flight_number: "AL-402",
    route: "BOG -> MIA",
    cabin_class: "Economy Promo",
    booking_type: "individual",
    passengers_count: 1,
    seat_number: "21D",
    customer_id: "c4", // Despegar
    owner_id: "u3", // Jamal Connolly
    stage_id: "s5",
    amount: 380,
    currency: "EUR",
    status: "lost",
    created_at: "2024-02-18T10:00:00Z",
    closed_at: "2024-03-15T18:00:00Z",
    departure_date: "2024-03-15",
    loss_reason: "Pasajero titular no se presentó al embarque (No-show)",
    comments_count: 3,
    attachments_count: 1
  }
];

// HUBS Y BASES DE OPERACIÓN DEL SIDEBAR
export const sidebarProjects = [
  { id: "p1", name: "Hub Bogotá (BOG)", badge: 9, active: true },
  { id: "p2", name: "Hub Madrid (MAD)", badge: 6 },
  { id: "p3", name: "Hub Miami (MIA)", badge: 5 },
  { id: "p4", name: "Hub Medellín (MDE)", badge: 4 }
];
