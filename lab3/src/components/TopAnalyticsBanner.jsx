import React from 'react';
import { ArrowRight, Plane, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export default function TopAnalyticsBanner({
  metrics,
  onViewTasks,
  onViewRevenue
}) {
  const {
    winRate,
    activeDealsCount,
    totalRevenue,
    weeklyCustomerActivity
  } = metrics;

  // Cálculo para el arco semi-circular dinámico (Gauge SVG)
  const radius = 42;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (winRate / 100));

  return (
    <div className="analytics-banner">
      {/* 1. New Bookings / Flight Requests Mini Chart */}
      <div className="banner-widget">
        <div className="chart-header">Nuevas reservas semanales</div>
        <div className="mini-barchart-container">
          <div className="chart-y-axis">
            <span>10</span>
            <span>5</span>
            <span>0</span>
          </div>

          {weeklyCustomerActivity.map((item) => {
            const solidHeight = Math.min(60, (item.count / 10) * 55);
            const stripedHeight = Math.min(60, (item.striped / 10) * 55);

            return (
              <div key={item.day} className="bar-column" title={`${item.fullDay}: ${item.count} solicitudes de vuelo / ${item.striped} cupos bloqueados`}>
                <div className="bars-pair">
                  <div className="solid-bar" style={{ height: `${solidHeight}px` }}></div>
                  <div className="striped-bar" style={{ height: `${stripedHeight}px` }}></div>
                </div>
                <span className="bar-day-label">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Radial Gauge Arc: Win Rate (XX% Vuelos Confirmados / Operados) */}
      <div className="banner-widget">
        <div className="gauge-container">
          <div className="gauge-svg-wrapper">
            <svg width="110" height="70" viewBox="0 0 110 70">
              <path
                d="M 15 65 A 40 40 0 0 1 95 65"
                fill="none"
                stroke="#D1CEBF"
                strokeWidth="7"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />
              <path
                d="M 15 65 A 40 40 0 0 1 95 65"
                fill="none"
                stroke="#18181B"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="gauge-stat-text">
              <span className="gauge-percentage">{winRate}%</span>
              <span className="gauge-label">Vuelos confirmados</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Stat widget: Active Bookings */}
      <div className="banner-stat-box" onClick={onViewTasks} title="Ver acuerdos y reservas activas en proceso">
        <div>
          <div className="banner-stat-num">{activeDealsCount}</div>
          <div className="banner-stat-sub">
            Active bookings<br />in pipeline
          </div>
        </div>
        <ArrowRight size={18} className="banner-arrow-icon" />
      </div>

      {/* 4. Stat widget: Prepayments / Total Flight Revenue */}
      <div className="banner-stat-box" onClick={onViewRevenue} title="Ver ingresos totales de pasaje emitido">
        <div>
          <div className="banner-stat-num">
            {formatCurrency(totalRevenue, "EUR")}
          </div>
          <div className="banner-stat-sub">
            Ticket issuance<br />& flight prepayments
          </div>
        </div>
        <ArrowRight size={18} className="banner-arrow-icon" />
      </div>
    </div>
  );
}
