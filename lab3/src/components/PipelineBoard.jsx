import React from 'react';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  MoreVertical,
  ArrowUpDown,
  MapPin,
  Mail,
  Plane,
  Users,
  CheckCircle2,
  Ticket
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export default function PipelineBoard({
  stages,
  deals,
  customers,
  users,
  onSelectDeal,
  onQuickMoveStage,
  onQuickMarkWon,
  onQuickMarkLost
}) {
  const customerMap = customers.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const userMap = users.reduce((acc, u) => {
    acc[u.id] = u;
    return acc;
  }, {});

  const formatDatePill = (dateStr) => {
    if (!dateStr) return "Sin fecha límite";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  // Renderizar las 4 etapas principales del ciclo comercial de la aerolínea:
  // s1 (Cotización), s3 (Tarifas Corporativas), s2 (Bloqueo Asientos), s4 (Vuelo Emitido)
  const displayStagesOrder = ["s1", "s3", "s2", "s4"];
  const stagesToRender = displayStagesOrder
    .map(id => stages.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="pipeline-board">
      {stagesToRender.map((stage) => {
        const stageDeals = deals.filter(d => d.stage_id === stage.id);
        const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

        return (
          <div key={stage.id} className="pipeline-col">
            {/* Column Header */}
            <div className="col-header">
              <div className="col-title-group">
                <span className="col-name">{stage.displayName || stage.name}</span>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: stage.color
                  }}
                />
              </div>

              <div className="col-badge">
                <span>{stageDeals.length}</span>
                <ArrowUpDown size={12} />
              </div>
            </div>

            {/* Subtotal de la columna */}
            <div style={{ fontSize: '11px', color: '#71717A', padding: '0 6px', marginTop: '-6px' }}>
              Revenue: <strong style={{ color: '#18181B' }}>{formatCurrency(stageTotal, "EUR")}</strong>
            </div>

            {/* List of cards */}
            <div className="col-cards-list">
              {stageDeals.length === 0 ? (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    border: '1px dashed #D8D4C7',
                    color: '#A1A1AA',
                    fontSize: '13px'
                  }}
                >
                  Sin reservas en esta etapa
                </div>
              ) : (
                stageDeals.map((deal) => {
                  const customer = customerMap[deal.customer_id] || { company_name: deal.title };
                  const owner = userMap[deal.owner_id] || users[0];
                  const isFeatured = deal.isFeatured || (deal.customer_id === 'c5' && deal.stage_id === 's3');

                  if (isFeatured) {
                    // Tarjeta destacada oscura (Prime Aviation & Chárter Jets)
                    return (
                      <div
                        key={deal.id}
                        className="deal-card card-featured-dark"
                        onClick={() => onSelectDeal(deal)}
                      >
                        <div className="card-top">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#F97316', color: '#FFFFFF' }}>
                                {deal.flight_number || "AL-VIP1"}
                              </span>
                              <span style={{ fontSize: '11px', color: '#E4E4E7', fontWeight: 600 }}>
                                {deal.route || "MIA -> MAD"}
                              </span>
                            </div>
                            <h4 className="company-title">{customer.company_name}</h4>
                          </div>

                          <button
                            className="more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDeal(deal);
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        <p className="deal-description">
                          {deal.title} • {deal.passengers_count || 35} plazas ({deal.cabin_class || "Executive Charter"})
                        </p>

                        <div className="dark-card-extra-details">
                          <div className="detail-line">
                            <MapPin size={12} color="#F97316" />
                            <span>{customer.address || "Executive Hangar 4, Miami Airport"}</span>
                          </div>
                          <div className="detail-line">
                            <Mail size={12} color="#F97316" />
                            <span>{customer.email || "charter@primeaviation.aero"}</span>
                          </div>
                        </div>

                        <div className="dark-manager-row">
                          <img
                            src={owner.avatar_url}
                            alt={owner.full_name}
                            className="dark-manager-avatar"
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '10px', color: '#A1A1AA' }}>Route Manager</span>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FFFFFF' }}>{owner.full_name}</span>
                          </div>
                          <div style={{ marginLeft: 'auto' }}>
                            <span className="deal-amount-pill" style={{ margin: 0 }}>
                              {formatCurrency(deal.amount, deal.currency)}
                            </span>
                          </div>
                        </div>

                        <div className="card-meta-footer">
                          <div className="date-pill">
                            <Calendar size={12} />
                            <span>Salida: {formatDatePill(deal.departure_date || deal.expected_close_date)}</span>
                          </div>

                          <div className="social-stats">
                            <span className="stat-item">
                              <MessageSquare size={12} />
                              <span>{deal.comments_count ?? 1}</span>
                            </span>
                            <span className="stat-item">
                              <Paperclip size={12} />
                              <span>{deal.attachments_count ?? 1}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Tarjeta Blanca Minimalista de Vuelo Estándar
                  return (
                    <div
                      key={deal.id}
                      className="deal-card"
                      onClick={() => onSelectDeal(deal)}
                    >
                      <div className="card-top">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            {deal.flight_number && (
                              <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#F4F2E9', color: '#18181B' }}>
                                {deal.flight_number}
                              </span>
                            )}
                            {deal.route && (
                              <span style={{ fontSize: '11px', color: '#F97316', fontWeight: 700 }}>
                                {deal.route}
                              </span>
                            )}
                          </div>
                          <h4 className="company-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {customer.company_name}
                          </h4>
                        </div>

                        <button
                          className="more-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDeal(deal);
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      <p className="deal-description">
                        {deal.title}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="deal-amount-pill" style={{ marginBottom: 0 }}>
                            {formatCurrency(deal.amount, deal.currency)}
                          </span>
                          {deal.passengers_count === 1 ? (
                            <span style={{ fontSize: '11px', color: '#047857', backgroundColor: '#ECFDF5', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                              1 asiento {deal.seat_number ? `(${deal.seat_number})` : ''}
                            </span>
                          ) : (
                            deal.passengers_count && (
                              <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 600 }}>
                                {deal.passengers_count} pax
                              </span>
                            )
                          )}
                        </div>

                        <img
                          src={owner.avatar_url}
                          alt={owner.full_name}
                          title={`Route Manager: ${owner.full_name}`}
                          style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </div>

                      <div className="card-meta-footer">
                        <div className="date-pill">
                          <Calendar size={12} color="#71717A" />
                          <span>{formatDatePill(deal.departure_date || deal.expected_close_date || deal.closed_at)}</span>
                        </div>

                        <div className="social-stats">
                          <span className="stat-item">
                            <MessageSquare size={12} color="#71717A" />
                            <span>{deal.comments_count ?? 2}</span>
                          </span>
                          <span className="stat-item">
                            <Paperclip size={12} color="#71717A" />
                            <span>{deal.attachments_count ?? 1}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
