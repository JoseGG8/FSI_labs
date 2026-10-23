import React, { useState } from 'react';
import {
  X,
  Building,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  MapPin,
  Mail,
  Plane,
  Users,
  Ticket,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/calculations';

export default function DealDetailModal({
  deal,
  customer,
  owner,
  stages,
  users,
  onClose,
  onUpdateDeal,
  onDeleteDeal
}) {
  if (!deal) return null;

  const [amount, setAmount] = useState(deal.amount);
  const [stageId, setStageId] = useState(deal.stage_id);
  const [status, setStatus] = useState(deal.status);
  const [ownerId, setOwnerId] = useState(deal.owner_id);
  const [lossReason, setLossReason] = useState(deal.loss_reason || "");
  const [passengersCount, setPassengersCount] = useState(deal.passengers_count || 1);
  const [seatNumber, setSeatNumber] = useState(deal.seat_number || "1A");

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === "won") {
      // Confetti celebration al emitir billete
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
      // Mover a etapa de vuelo emitido
      setStageId("s4");
    } else if (newStatus === "lost") {
      setStageId("s5");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const paxNum = Number(passengersCount) || 1;
    onUpdateDeal({
      ...deal,
      amount: Number(amount) || 0,
      passengers_count: paxNum,
      seat_number: paxNum === 1 ? seatNumber : null,
      booking_type: paxNum === 1 ? "individual" : "group",
      stage_id: stageId,
      status: status,
      owner_id: ownerId,
      loss_reason: status === "lost" ? lossReason : null,
      closed_at: status === "won" ? (deal.closed_at || new Date().toISOString()) : deal.closed_at
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F97316', color: '#FFFFFF' }}>
                {deal.flight_number || "AL-120"}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#18181B' }}>
                {deal.route || "BOG -> MAD"}
              </span>
              <span style={{ color: '#D4D4D8' }}>•</span>
              <span style={{ fontSize: '12px', color: '#71717A' }}>ID: {deal.id}</span>
            </div>
            <h3 className="modal-title">{customer?.company_name || deal.title}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Flight & Agency Summary */}
        <div style={{ backgroundColor: '#FAF8F2', padding: '14px 16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #ECEAE0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#18181B' }}>
              {deal.title}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#F97316', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '9999px' }}>
              {deal.cabin_class || "Economy Group"}
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#71717A', marginBottom: '10px' }}>
            {customer?.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#52525B' }}>
            {deal.departure_date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Calendar size={12} color="#F97316" /> Salida: {deal.departure_date}
              </span>
            )}
            {customer?.contact_person && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} color="#F97316" /> Travel Manager: {customer.contact_person}
              </span>
            )}
            {customer?.preferred_hub && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plane size={12} color="#F97316" /> Hub Preferente: {customer.preferred_hub}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Quick Status Action Buttons */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
              Estado del Acuerdo de Vuelo (Afecta instantáneamente los KPIs de la aerolínea)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleStatusChange("open")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: status === 'open' ? '2px solid #F97316' : '1px solid #E4E4E7',
                  backgroundColor: status === 'open' ? '#FFF7ED' : '#FFFFFF',
                  color: status === 'open' ? '#C2410C' : '#52525B',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <Clock size={15} />
                <span>En Proceso</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange("won")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: status === 'won' ? '2px solid #10B981' : '1px solid #E4E4E7',
                  backgroundColor: status === 'won' ? '#ECFDF5' : '#FFFFFF',
                  color: status === 'won' ? '#047857' : '#52525B',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <CheckCircle size={15} />
                <span>Vuelo Emitido ✈️</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange("lost")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: status === 'lost' ? '2px solid #EF4444' : '1px solid #E4E4E7',
                  backgroundColor: status === 'lost' ? '#FEF2F2' : '#FFFFFF',
                  color: status === 'lost' ? '#B91C1C' : '#52525B',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <XCircle size={15} />
                <span>Cancelado</span>
              </button>
            </div>
          </div>

          {status === "lost" && (
            <div className="form-group">
              <label className="form-label">Motivo de Cancelación / Pérdida</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: Prefirieron competidor por horario / Presupuesto congelado"
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Revenue Total (€ EUR)</label>
              <input
                type="number"
                min="0"
                step="500"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {Number(passengersCount) === 1 ? "Asignación de Asiento (1 Asiento)" : "Plazas / Pasajeros (Pax)"}
              </label>
              {Number(passengersCount) === 1 ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: 1A, 2B"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    style={{ fontWeight: 700, color: '#047857' }}
                  />
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={passengersCount}
                    onChange={(e) => setPassengersCount(e.target.value)}
                    style={{ width: '70px' }}
                    title="Número de asientos"
                  />
                </div>
              ) : (
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(e.target.value)}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Etapa de Reserva</label>
              <select
                className="form-select"
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
              >
                {stages.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.displayName || s.name} ({s.win_probability}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Route Manager Asignado</label>
              <select
                className="form-select"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name} ({u.assigned_hub || u.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => {
                if (confirm(`¿Seguro que deseas eliminar la reserva "${deal.title}"?`)) {
                  onDeleteDeal(deal.id);
                  onClose();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} />
              Eliminar
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button type="submit" className="btn-primary-dark">
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
