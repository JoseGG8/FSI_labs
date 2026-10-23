import React, { useState } from 'react';
import { BarChart3, LineChart, Target, Award, Plane, TrendingUp, Compass, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../utils/calculations';

export default function ChartsSection({ metrics, stages, users }) {
  const {
    pipelineByStage,
    monthlyRevenue,
    repsPerformance,
    totalRevenue,
    activePipelineValue,
    routesPerformance = []
  } = metrics;

  const [hoveredStage, setHoveredStage] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const maxStageAmount = Math.max(...pipelineByStage.map(s => s.amount), 50000);

  const maxMonthValue = Math.max(
    ...monthlyRevenue.map(m => Math.max(m.wonRevenue, m.target, m.activePipeline)),
    120000
  );

  const chartWidth = 520;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 25;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const getPoints = (key) => {
    return monthlyRevenue.map((d, i) => {
      const x = paddingX + (i / (monthlyRevenue.length - 1)) * usableWidth;
      const y = chartHeight - paddingY - (d[key] / maxMonthValue) * usableHeight;
      return { x, y, val: d[key], label: d.month };
    });
  };

  const wonPoints = getPoints('wonRevenue');
  const targetPoints = getPoints('target');

  const wonPath = wonPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const wonAreaPath = `${wonPath} L ${wonPoints[wonPoints.length - 1].x} ${chartHeight - paddingY} L ${wonPoints[0].x} ${chartHeight - paddingY} Z`;

  const targetPath = targetPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '28px' }}>
      {/* Grid de 2 Gráficos Principales de la Aerolínea */}
      <div className="analytics-view-grid">
        {/* Gráfico 1: Barras - Ingresos por Etapa del Pipeline de Vuelos */}
        <div className="analytics-card">
          <div className="card-heading-row">
            <div>
              <h3 className="card-main-title">Ingresos por Etapa de Reserva de Vuelo</h3>
              <p className="card-subtitle">
                Eje X: Etapas del Embudo | Eje Y: Suma de Revenue de Pasaje (€)
              </p>
            </div>
            <div className="trend-badge coral">
              <BarChart3 size={14} />
              <span>Pipeline: {formatCurrency(activePipelineValue, "EUR")}</span>
            </div>
          </div>

          <div className="pipeline-bars-chart">
            {pipelineByStage.map((stage) => {
              const percentage = maxStageAmount > 0 ? (stage.amount / maxStageAmount) * 100 : 0;
              const isHovered = hoveredStage === stage.id;

              return (
                <div
                  key={stage.id}
                  className="stage-bar-item"
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor: isHovered ? '#F8F6F0' : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div className="stage-bar-header">
                    <div className="stage-name-col">
                      <span className="stage-dot" style={{ backgroundColor: stage.color }}></span>
                      <span>{stage.name}</span>
                      <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 400 }}>
                        ({stage.count} {stage.count === 1 ? 'reserva' : 'reservas'} • {stage.win_probability}% prob.)
                      </span>
                    </div>

                    <div className="stage-amount-badge">
                      {formatCurrency(stage.amount, "EUR")}
                    </div>
                  </div>

                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.max(percentage, stage.amount > 0 ? 3 : 0)}%`,
                        backgroundColor: stage.color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0EEE4', paddingTop: '14px', marginTop: '8px', fontSize: '11px', color: '#71717A' }}>
            <span>* Se recalculan automáticamente al mover un acuerdo entre etapas.</span>
            <span>Máx. Etapa: {formatCurrency(maxStageAmount, "EUR")}</span>
          </div>
        </div>

        {/* Gráfico 2: Línea - Evolución de Ventas e Ingresos de Pasaje */}
        <div className="analytics-card">
          <div className="card-heading-row">
            <div>
              <h3 className="card-main-title">Evolución de Ingresos de Vuelos</h3>
              <p className="card-subtitle">Revenue emitido mes a mes vs Objetivo de la aerolínea</p>
            </div>
            <div className="trend-badge positive">
              <TrendingUp size={14} />
              <span>Yield al alza</span>
            </div>
          </div>

          <div className="trend-chart-container">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Guías horizontales */}
              {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                const y = chartHeight - paddingY - ratio * usableHeight;
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#E5E7EB"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      fontSize="9"
                      fill="#9CA3AF"
                      textAnchor="end"
                    >
                      {formatCompactCurrency(Math.round(ratio * maxMonthValue), "EUR")}
                    </text>
                  </g>
                );
              })}

              {/* Área bajo la curva */}
              <path d={wonAreaPath} fill="url(#revenueGradient)" />

              {/* Línea de Objetivo / Cuota */}
              <path
                d={targetPath}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Línea de Revenue Emitido */}
              <path
                d={wonPath}
                fill="none"
                stroke="#FF6B4A"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Puntos y etiquetas */}
              {wonPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredMonth === idx ? 6 : 4}
                    fill="#FFFFFF"
                    stroke="#FF6B4A"
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  />
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    fontSize="11"
                    fontWeight="600"
                    fill="#4B5563"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '4px', backgroundColor: '#FF6B4A', borderRadius: '2px' }}></span>
              <span style={{ fontWeight: 600, color: '#18181B' }}>Revenue Emitido</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', backgroundColor: '#94A3B8', borderTop: '2px dashed #94A3B8' }}></span>
              <span style={{ color: '#71717A' }}>Meta de Red / Cuota</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Revenue Management por Ruta (Load Factor, RASK & Yield) */}
      {routesPerformance.length > 0 && (
        <div className="analytics-card">
          <div className="card-heading-row">
            <div>
              <h3 className="card-main-title">Matriz de Rendimiento de Rutas (Revenue Management)</h3>
              <p className="card-subtitle">
                Factor de Ocupación (Meta IATA ≥ 82%), RASK y Yield efectivo por corredor aéreo
              </p>
            </div>
            <div className="trend-badge neutral">
              <Compass size={14} />
              <span>{routesPerformance.length} Rutas Monitoreadas</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E4E4E7', color: '#71717A', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Corredor / Ruta</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Distancia</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Pax Vendidos / Capacidad</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Load Factor (%)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>RASK (€/ASK)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Yield (€/RPK)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Revenue Emitido</th>
                </tr>
              </thead>
              <tbody>
                {routesPerformance.map((r) => (
                  <tr key={r.route} style={{ borderBottom: '1px solid #F4F2E9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#18181B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plane size={15} color="#F97316" />
                        <span>{r.route}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#71717A' }}>
                      {r.distanceKm.toLocaleString('es-ES')} km
                    </td>
                    <td style={{ padding: '12px', color: '#18181B' }}>
                      <strong>{r.wonSeats}</strong> / {r.capacity} cupos
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`trend-badge ${r.isTargetMet ? 'positive' : 'coral'}`}>
                        {r.isTargetMet ? <CheckCircle2 size={11} /> : null}
                        {r.loadFactor}% {r.isTargetMet ? '(Meta ✓)' : '(Bajo Meta)'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0284C7' }}>
                      {r.raskFormatted}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#EA580C' }}>
                      {r.yieldFormatted}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#10B981' }}>
                      {formatCurrency(r.wonRevenue, "EUR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leaderboard: Rendimiento por Route Manager y Comercial */}
      <div className="analytics-card">
        <div className="card-heading-row">
          <div>
            <h3 className="card-main-title">Rendimiento por Route Manager y Comercial</h3>
            <p className="card-subtitle">Avance de ventas de vuelos frente a la cuota mensual de ruta asignada</p>
          </div>
          <div className="trend-badge neutral">
            <Target size={14} />
            <span>Objetivo Red: {formatCurrency(users.reduce((s, u) => s + u.quota_amount, 0), "EUR")}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {repsPerformance.map((rep) => {
            const isTargetMet = rep.quotaAttainment >= 100;
            const roleDisplay = 
              rep.role === 'revenue_manager' ? 'Head of Revenue' :
              rep.role === 'route_manager' ? `Route Manager (${rep.assigned_hub || 'Hub'})` :
              'Corporate Accounts';

            return (
              <div
                key={rep.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #ECEAE0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={rep.avatar_url}
                    alt={rep.full_name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#18181B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rep.full_name}
                    </h5>
                    <span style={{ fontSize: '11px', color: '#71717A' }}>
                      {roleDisplay}
                    </span>
                  </div>
                  <span
                    className={`trend-badge ${isTargetMet ? 'positive' : 'coral'}`}
                    style={{ fontSize: '11px' }}
                  >
                    {rep.quotaAttainment}%
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#71717A' }}>Emitido: <strong>{formatCurrency(rep.wonRevenue, "EUR")}</strong></span>
                    <span style={{ color: '#A1A1AA' }}>Meta: {formatCompactCurrency(rep.quota_amount, "EUR")}</span>
                  </div>
                  <div className="bar-track" style={{ height: '8px' }}>
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.min(rep.quotaAttainment, 100)}%`,
                        backgroundColor: isTargetMet ? '#10B981' : '#F97316'
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#71717A', paddingTop: '4px', borderTop: '1px solid #F4F2E9' }}>
                  <span>{rep.wonDealsCount} emitidos</span>
                  <span>{rep.openDealsCount} en proceso ({formatCompactCurrency(rep.pipelineValue, "EUR")})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
