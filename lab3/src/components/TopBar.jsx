import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, UserCheck, Plus, Plane, Filter } from 'lucide-react';

export default function TopBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedOwnerId,
  onSelectOwner,
  onOpenAddModal,
  selectedStageFilter,
  onSelectStageFilter,
  stages
}) {
  return (
    <div className="top-bar">
      {/* Search Input for Airline Deals, Flights, and Routes */}
      <div className="search-container" style={{ width: '380px' }}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar vuelo, ruta, agencia o convenio (ej. AL-120, BOG-MAD)..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            style={{
              position: 'absolute',
              right: '12px',
              border: 'none',
              background: 'none',
              color: '#A1A1AA',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Top Action Pills */}
      <div className="top-actions">
        {/* Sort selector */}
        <button
          className="action-pill-btn"
          onClick={() => {
            const nextSort = sortBy === 'amount_desc' ? 'amount_asc' : sortBy === 'amount_asc' ? 'newest' : 'amount_desc';
            onSortChange(nextSort);
          }}
          title="Alternar orden por importe"
        >
          <ArrowUpDown size={14} />
          <span>
            {sortBy === 'amount_desc'
              ? 'Mayor Revenue'
              : sortBy === 'amount_asc'
              ? 'Menor Revenue'
              : 'Más Recientes'}
          </span>
        </button>

        {/* Stage Filter Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            className="action-pill-btn"
            style={{ appearance: 'none', paddingRight: '28px', cursor: 'pointer' }}
            value={selectedStageFilter || ""}
            onChange={(e) => onSelectStageFilter(e.target.value || null)}
          >
            <option value="">Todas las Etapas de Reserva</option>
            {stages.map(s => (
              <option key={s.id} value={s.id}>{s.displayName || s.name}</option>
            ))}
          </select>
          <Filter size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#71717A' }} />
        </div>

        {/* Quick 'Me' filter */}
        <button
          className={`action-pill-btn ${selectedOwnerId === 'u1' ? 'active' : ''}`}
          onClick={() => onSelectOwner(selectedOwnerId === 'u1' ? null : 'u1')}
          title="Filtrar acuerdos asignados a mí (Antony Cárdenas - Route Manager)"
        >
          <UserCheck size={14} />
          <span>Mis Rutas</span>
        </button>

        {/* Primary Action Button */}
        <button className="btn-primary-dark" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Nueva Reserva</span>
        </button>
      </div>
    </div>
  );
}
