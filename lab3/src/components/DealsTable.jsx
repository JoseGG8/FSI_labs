import React, { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Plane,
  Ticket
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export default function DealsTable({
  deals,
  stages,
  customers,
  users,
  onSelectDeal,
  onUpdateDealStatus,
  onUpdateDealStage
}) {
  const [tableFilter, setTableFilter] = useState("all");

  const customerMap = customers.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const userMap = users.reduce((acc, u) => {
    acc[u.id] = u;
    return acc;
  }, {});

  const stageMap = stages.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const filteredDeals = deals.filter(d => {
    if (tableFilter === "all") return true;
    return d.status === tableFilter;
  });

  return (
    <div className="analytics-card" style={{ marginBottom: '28px' }}>
      <div className="card-heading-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 className="card-main-title">Registro de Reservas y Acuerdos de Vuelo</h3>
          <p className="card-subtitle">
            Gestión comercial de cupos, vuelos chárter y acuerdos corporativos de la aerolínea.
          </p>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: "all", label: `Todos (${deals.length})` },
            { id: "open", label: `En Proceso (${deals.filter(d => d.status === 'open').length})` },
            { id: "won", label: `Emitidos / Won (${deals.filter(d => d.status === 'won').length})` },
            { id: "lost", label: `Cancelados (${deals.filter(d => d.status === 'lost').length})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTableFilter(f.id)}
              className="action-pill-btn"
              style={{
                backgroundColor: tableFilter === f.id ? '#18181B' : '#F4F2E9',
                color: tableFilter === f.id ? '#FFFFFF' : '#18181B',
                fontSize: '12px'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ECEAE0', color: '#71717A' }}>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>AGENCIA / CUENTA & VUELO</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>RUTA</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>PLAZAS & CABINA</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>REVENUE</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>ETAPA DE RESERVA</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>ESTADO</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>ROUTE MANAGER</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>SALIDA</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => {
              const customer = customerMap[deal.customer_id] || { company_name: deal.title, industry: 'General' };
              const owner = userMap[deal.owner_id] || users[0];
              const stage = stageMap[deal.stage_id] || stages[0];

              return (
                <tr
                  key={deal.id}
                  style={{
                    borderBottom: '1px solid #F4F2E9',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF9F5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => onSelectDeal(deal)}
                >
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#18181B' }}>{customer.company_name}</span>
                        {deal.flight_number && (
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#F4F2E9', color: '#18181B' }}>
                            {deal.flight_number}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#71717A' }}>{deal.title}</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span style={{ fontWeight: 700, color: '#F97316', fontSize: '12px' }}>
                      {deal.route || "BOG -> MAD"}
                    </span>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {deal.passengers_count === 1 ? (
                        <span style={{ fontWeight: 700, color: '#047857' }}>
                          1 asiento {deal.seat_number ? `(${deal.seat_number})` : ''}
                        </span>
                      ) : (
                        <span style={{ fontWeight: 600, color: '#18181B' }}>{deal.passengers_count || 40} pax</span>
                      )}
                      <span style={{ fontSize: '11px', color: '#71717A' }}>{deal.cabin_class || "Economy Group"}</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#18181B' }}>
                      {formatCurrency(deal.amount, deal.currency)}
                    </span>
                  </td>

                  <td style={{ padding: '14px' }} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={deal.stage_id}
                      onChange={(e) => onUpdateDealStage(deal.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: '1px solid #E4E4E7',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      {stages.map(s => (
                        <option key={s.id} value={s.id}>{s.displayName || s.name}</option>
                      ))}
                    </select>
                  </td>

                  <td style={{ padding: '14px' }} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={deal.status}
                      onChange={(e) => onUpdateDealStatus(deal.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        backgroundColor:
                          deal.status === 'won'
                            ? '#ECFDF5'
                            : deal.status === 'lost'
                            ? '#FEF2F2'
                            : '#FFF7ED',
                        color:
                          deal.status === 'won'
                            ? '#047857'
                            : deal.status === 'lost'
                            ? '#B91C1C'
                            : '#C2410C'
                      }}
                    >
                      <option value="open">En Proceso (Open)</option>
                      <option value="won">Emitido / Won ✈️</option>
                      <option value="lost">Cancelado (Lost)</option>
                    </select>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={owner.avatar_url}
                        alt={owner.full_name}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '12px', color: '#3F3F46' }}>{owner.full_name}</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px', fontSize: '12px', color: '#71717A' }}>
                    {deal.departure_date || deal.expected_close_date || "N/A"}
                  </td>

                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      className="action-pill-btn"
                      style={{ padding: '4px 10px', fontSize: '11px', display: 'inline-flex' }}
                      onClick={() => onSelectDeal(deal)}
                    >
                      Ver vuelo
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
