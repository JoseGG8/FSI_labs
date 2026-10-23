import React from 'react';
import {
  Plane,
  TrendingUp,
  Award,
  PieChart,
  Compass,
  Gauge,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export default function KpiCards({ metrics }) {
  const {
    // Métricas Comerciales
    totalRevenue,
    activeDealsCount,
    activePipelineValue,
    winRate,
    avgDealSize,
    wonDealsCount,
    lostDealsCount,
    growthRate,
    quotaAttainment,

    // Métricas Nativas de Revenue Management Aéreo
    loadFactor = 0,
    loadFactorTarget = 82.0,
    loadFactorDiff = 0,
    isLoadFactorMet = false,
    wonSeats = 0,
    availableSeats = 0,
    raskFormatted = "€ 0.000",
    raskCents = "0.0",
    yieldFormatted = "€ 0.000",
    yieldCents = "0.0",
    totalRPK = 0,
    totalASK = 0
  } = metrics;

  return (
    <div className="rm-kpi-container">
      {/* 1. Header de Métricas de Vuelo (Revenue Management) */}
      <div className="rm-header-row">
        <div className="rm-header-left">
          <div className="rm-badge-pill">
            <Gauge size={13} />
            <span>REVENUE MANAGEMENT AÉREO</span>
          </div>
          <h3 className="rm-section-title">Indicadores de Rendimiento de Vuelo</h3>
        </div>
        <div className="rm-header-right">
          <span className="rm-benchmark-badge" title="Benchmark estándar de la industria aérea comercial (IATA)">
            Meta de Red IATA: <strong>Load Factor ≥ 82.0%</strong>
          </span>
        </div>
      </div>

      {/* 2. Grid de las 3 Métricas Nativas de Rendimiento de Vuelo */}
      <div className="rm-cards-grid">
        {/* Métrica 1: Load Factor (Factor de Ocupación %) */}
        <div className="rm-card">
          <div className="kpi-top">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="kpi-title">Load Factor (Factor de Ocupación)</span>
              <span style={{ fontSize: '11px', color: '#71717A' }}>Asientos vendidos vs. Asientos disponibles</span>
            </div>
            <div
              className="kpi-icon-pill"
              style={{
                backgroundColor: isLoadFactorMet ? '#ECFDF5' : '#FFF7ED',
                color: isLoadFactorMet ? '#10B981' : '#F97316'
              }}
            >
              <Percent size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
            <div className="kpi-value" style={{ margin: 0 }}>
              {loadFactor}%
            </div>
            <span className={`trend-badge ${isLoadFactorMet ? 'positive' : 'coral'}`}>
              {isLoadFactorMet ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
              {loadFactorDiff >= 0 ? `+${loadFactorDiff}%` : `${loadFactorDiff}%`} vs meta (82%)
            </span>
          </div>

          {/* Visual Progress Bar with 82% benchmark pin */}
          <div className="rm-gauge-bar-wrapper">
            <div className="rm-gauge-bar-track">
              <div
                className="rm-gauge-bar-fill"
                style={{
                  width: `${Math.min(loadFactor, 100)}%`,
                  backgroundColor: isLoadFactorMet ? '#10B981' : '#F97316'
                }}
              />
              <div
                className="rm-gauge-target-pin"
                style={{ left: `${loadFactorTarget}%` }}
                title={`Meta Benchmark IATA: ${loadFactorTarget}%`}
              >
                <div className="rm-target-line" />
                <span className="rm-target-label">Meta 82%</span>
              </div>
            </div>
          </div>

          <div className="kpi-footer" style={{ marginTop: '12px' }}>
            <span style={{ color: '#52525B', fontSize: '12px', fontWeight: 500 }}>
              <strong>{wonSeats}</strong> asientos vendidos / <strong>{availableSeats}</strong> disponibles en flota
            </span>
          </div>
        </div>

        {/* Métrica 2: RASK / PRASK */}
        <div className="rm-card">
          <div className="kpi-top">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="kpi-title">RASK / PRASK</span>
              <span style={{ fontSize: '11px', color: '#71717A' }}>Revenue per Available Seat Kilometer</span>
            </div>
            <div className="kpi-icon-pill" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
              <Navigation size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
            <div className="kpi-value" style={{ margin: 0 }}>
              {raskFormatted}
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#71717A' }}> / ASK</span>
            </div>
            <span className="trend-badge neutral" style={{ backgroundColor: '#F0F9FF', color: '#0369A1' }}>
              {raskCents} ¢/ASK
            </span>
          </div>

          <div className="rm-metric-detail-box">
            <div className="rm-detail-row">
              <span>Capacidad ofertada (ASK):</span>
              <strong>{(totalASK / 1000000).toFixed(2)}M ASK</strong>
            </div>
            <div className="rm-detail-row">
              <span>Fórmula de ingreso:</span>
              <span style={{ color: '#0284C7', fontWeight: 600 }}>Total Revenue ÷ Total ASK</span>
            </div>
          </div>

          <div className="kpi-footer" style={{ marginTop: '12px' }}>
            <span style={{ color: '#71717A', fontSize: '11px' }}>
              Ingreso generado por cada asiento y kilómetro volado
            </span>
          </div>
        </div>

        {/* Métrica 3: Passenger Yield */}
        <div className="rm-card">
          <div className="kpi-top">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="kpi-title">Yield (Rendimiento Pasajero)</span>
              <span style={{ fontSize: '11px', color: '#71717A' }}>Ingreso medio por pasajero-km recorrido</span>
            </div>
            <div className="kpi-icon-pill" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>
              <TrendingUp size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
            <div className="kpi-value" style={{ margin: 0 }}>
              {yieldFormatted}
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#71717A' }}> / RPK</span>
            </div>
            <span className="trend-badge coral">
              {yieldCents} ¢/RPK
            </span>
          </div>

          <div className="rm-metric-detail-box">
            <div className="rm-detail-row">
              <span>Tráfico pasajero (RPK):</span>
              <strong>{(totalRPK / 1000000).toFixed(2)}M RPK</strong>
            </div>
            <div className="rm-detail-row">
              <span>Identidad RM:</span>
              <span style={{ color: '#D97706', fontWeight: 600 }}>RASK = Yield × Load Factor</span>
            </div>
          </div>

          <div className="kpi-footer" style={{ marginTop: '12px' }}>
            <span style={{ color: '#71717A', fontSize: '11px' }}>
              Ingreso medio por pasajero por kilómetro recorrido
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sub-header para Métricas Comerciales */}
      <div className="rm-sub-header">
        <span className="rm-sub-title">Métricas Comerciales & Pipeline de Venta</span>
      </div>

      {/* 4. Grid de KPIs Comerciales Estándar */}
      <div className="kpi-executive-grid">
        {/* 1. Total Flight Revenue */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Flight Revenue</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
              <Plane size={18} />
            </div>
          </div>
          <div className="kpi-value">{formatCurrency(totalRevenue, "EUR")}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              <TrendingUp size={12} />
              {growthRate}
            </span>
            <span style={{ color: '#71717A', fontSize: '11px' }}>vs mes anterior</span>
          </div>
        </div>

        {/* 2. Active Flight Bookings */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Active Bookings</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>
              <Compass size={18} />
            </div>
          </div>
          <div className="kpi-value">{activeDealsCount} reservas</div>
          <div className="kpi-footer">
            <span className="trend-badge coral">
              Pipeline: {formatCurrency(activePipelineValue, "EUR")}
            </span>
          </div>
        </div>

        {/* 3. Flight Win Rate */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Flight Win Rate</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
              <Award size={18} />
            </div>
          </div>
          <div className="kpi-value">{winRate}%</div>
          <div className="kpi-footer">
            <span className="trend-badge neutral">
              {wonDealsCount} Emitidos / {lostDealsCount} Cancelados
            </span>
          </div>
        </div>

        {/* 4. Avg Booking Size */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Avg Booking Size</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: '#F5F3FF', color: '#8B5CF6' }}>
              <PieChart size={18} />
            </div>
          </div>
          <div className="kpi-value">{formatCurrency(avgDealSize, "EUR")}</div>
          <div className="kpi-footer">
            <span className="trend-badge positive">
              {quotaAttainment}% Cuota de Rutas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

