import React, { useState } from 'react';
import { X, Plus, Sparkles, Building, DollarSign, Plane, Users } from 'lucide-react';

export default function DealModal({
  isOpen,
  onClose,
  onSaveDeal,
  customers,
  users,
  stages
}) {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);
  const [flightNumber, setFlightNumber] = useState("AL-120");
  const [route, setRoute] = useState("BOG -> MAD");
  const [cabinClass, setCabinClass] = useState("Economy Group");
  const [passengersCount, setPassengersCount] = useState(45);
  const [seatNumber, setSeatNumber] = useState("2A");
  const [ownerId, setOwnerId] = useState(users[0]?.id || "");
  const [stageId, setStageId] = useState("s1");
  const [amount, setAmount] = useState(38000);
  const [status, setStatus] = useState("open");
  const [departureDate, setDepartureDate] = useState("2024-07-20");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Por favor ingresa un título para la reserva de vuelo.");
      return;
    }

    const paxNum = Number(passengersCount) || 1;

    onSaveDeal({
      title,
      customerId: isCreatingNewCustomer ? null : customerId,
      newCustomerName: isCreatingNewCustomer ? newCustomerName : null,
      flight_number: flightNumber,
      route,
      cabin_class: cabinClass,
      booking_type: paxNum === 1 ? "individual" : "group",
      passengers_count: paxNum,
      seat_number: paxNum === 1 ? seatNumber : null,
      ownerId,
      stageId,
      amount: Number(amount) || 0,
      currency: "EUR",
      status,
      departure_date: departureDate,
      expectedCloseDate: departureDate
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316' }}>
              <Plane size={18} />
            </div>
            <h3 className="modal-title">Nueva Reserva / Bloque de Vuelo</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título del Acuerdo / Reserva</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Bloque 50 Asientos Temporada Verano"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Cliente selector o crear nuevo */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Agencia / Cuenta Corporativa</label>
              <button
                type="button"
                onClick={() => setIsCreatingNewCustomer(!isCreatingNewCustomer)}
                style={{ fontSize: '11px', color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                {isCreatingNewCustomer ? "← Seleccionar existente" : "+ Crear nueva agencia"}
              </button>
            </div>

            {isCreatingNewCustomer ? (
              <input
                type="text"
                className="form-input"
                placeholder="Nombre de la nueva agencia o empresa (ej. Global Travel Corp)"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                required
              />
            ) : (
              <select
                className="form-select"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name} ({c.industry || "Agencia"})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Vuelo y Ruta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Número de Vuelo (IATA)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: AL-120"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ruta de Vuelo</label>
              <select
                className="form-select"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
              >
                <option value="BOG → MAD">BOG → MAD (Bogotá - Madrid)</option>
                <option value="MAD → BOG">MAD → BOG (Madrid - Bogotá)</option>
                <option value="MDE → MIA">MDE → MIA (Medellín - Miami)</option>
                <option value="MIA → MDE">MIA → MDE (Miami - Medellín)</option>
                <option value="BOG → JFK">BOG → JFK (Bogotá - Nueva York)</option>
                <option value="MDE → BOG">MDE → BOG (Medellín - Bogotá)</option>
                <option value="MIA → MAD">MIA → MAD (Chárter Transatlántico)</option>
              </select>
            </div>
          </div>

          {/* Pasajeros, Asiento y Cabina */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Plazas / Pasajeros (Pax)</label>
              <input
                type="number"
                min="1"
                max="350"
                className="form-input"
                value={passengersCount}
                onChange={(e) => setPassengersCount(e.target.value)}
                required
              />
              <span style={{ fontSize: '11px', color: '#71717A', marginTop: '2px' }}>
                {Number(passengersCount) === 1 ? "✨ Venta individual de 1 asiento" : "👥 Reserva de grupo / bloque"}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                {Number(passengersCount) === 1 ? "Asignación de Asiento" : "Tipo de Cabina"}
              </label>
              {Number(passengersCount) === 1 ? (
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: 1A, 2B, 14F"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                />
              ) : (
                <select
                  className="form-select"
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                >
                  <option value="Economy Group">Economy Group</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business Class">Business Class</option>
                  <option value="Executive Charter">Executive Charter</option>
                </select>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Valor monetario */}
            <div className="form-group">
              <label className="form-label">Revenue Estimado (€ EUR)</label>
              <input
                type="number"
                min="500"
                step="500"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Fecha de salida */}
            <div className="form-group">
              <label className="form-label">Fecha Programada de Vuelo</label>
              <input
                type="date"
                className="form-input"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Route Manager */}
            <div className="form-group">
              <label className="form-label">Route Manager Asignado</label>
              <select
                className="form-select"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.assigned_hub || u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Etapa inicial */}
            <div className="form-group">
              <label className="form-label">Etapa de Reserva</label>
              <select
                className="form-select"
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.displayName || s.name} ({s.win_probability}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado inicial */}
          <div className="form-group">
            <label className="form-label">Estado Inicial</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">En Proceso (Open) - En Pipeline</option>
              <option value="won">Emitido / Confirmado (Won) - Sumará a Revenue</option>
              <option value="lost">Cancelado / No-show (Lost)</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-dark">
              Crear Reserva de Vuelo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
