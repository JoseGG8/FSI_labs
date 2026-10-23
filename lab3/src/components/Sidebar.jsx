import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Users,
  Settings,
  Plus,
  LogOut,
  Plane,
  Briefcase,
  Compass,
  Globe
} from 'lucide-react';

export default function Sidebar({
  users,
  selectedOwnerId,
  onSelectOwner,
  currentView,
  onChangeView,
  openDealsCount
}) {
  return (
    <aside className="sidebar">
      <div>
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-logo-icon" style={{ background: 'linear-gradient(135deg, #18181B, #27272A)' }}>
            <Plane size={18} color="#FF6B4A" />
          </div>
          <div>
            <span className="brand-name">AeroLink</span>
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: '#F97316', textTransform: 'uppercase' }}>
              Airline CRM
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="nav-group">
          <button
            className={`nav-item ${currentView === 'pipeline' ? 'active' : ''}`}
            onClick={() => onChangeView('pipeline')}
          >
            <div className="nav-item-content">
              <Compass size={18} />
              <span>Flight Pipeline</span>
            </div>
          </button>

          <button
            className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => onChangeView('analytics')}
          >
            <div className="nav-item-content">
              <LayoutDashboard size={18} />
              <span>Revenue & Yield</span>
            </div>
          </button>

          <button
            className={`nav-item ${currentView === 'table' ? 'active' : ''}`}
            onClick={() => onChangeView('table')}
          >
            <div className="nav-item-content">
              <Briefcase size={18} />
              <span>Flight Bookings</span>
            </div>
          </button>

          <button className="nav-item" onClick={() => alert("Módulo de Operaciones de Vuelo y Slots en desarrollo.")}>
            <div className="nav-item-content">
              <CheckSquare size={18} />
              <span>Flight Operations</span>
            </div>
            <span className="badge-counter">{openDealsCount > 0 ? openDealsCount : 0}</span>
          </button>

          <button className="nav-item" onClick={() => alert("Registro de actividad auditada de reservas y emisiones.")}>
            <div className="nav-item-content">
              <Activity size={18} />
              <span>Activity Log</span>
            </div>
          </button>

          <button className="nav-item" onClick={() => alert("Configuración de rutas, tarifas y cuotas de la aerolínea.")}>
            <div className="nav-item-content">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </button>
        </div>

        {/* Hubs & Route Networks */}
        <div className="nav-group">
          <div className="nav-title">Bases & Hubs</div>
          <div className="nav-item active" style={{ backgroundColor: 'transparent' }}>
            <div className="nav-item-content">
              <span style={{ fontSize: '13px', fontWeight: 600 }}>✈️ Hub Bogotá (BOG)</span>
            </div>
            <span className="badge-counter">9</span>
          </div>
          <div className="nav-item" style={{ fontSize: '13px' }}>
            <span>🌐 Hub Madrid (MAD)</span>
          </div>
          <div className="nav-item" style={{ fontSize: '13px' }}>
            <span>🌴 Hub Miami (MIA)</span>
          </div>
          <div className="nav-item" style={{ fontSize: '13px' }}>
            <span>🏔️ Hub Medellín (MDE)</span>
          </div>
        </div>

        {/* Airline Sales Team Members Filter */}
        <div className="nav-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px 8px 12px' }}>
            <span className="nav-title" style={{ padding: 0 }}>Route Managers</span>
            {selectedOwnerId && (
              <button
                onClick={() => onSelectOwner(null)}
                style={{ fontSize: '10px', color: '#FF6B4A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {users.map(member => {
              const isSelected = selectedOwnerId === member.id;
              const roleDisplay = 
                member.role === 'revenue_manager' ? 'Revenue Manager' :
                member.role === 'route_manager' ? `Route Manager (${member.assigned_hub || 'Hub'})` :
                'Corporate Sales';

              return (
                <div
                  key={member.id}
                  className={`member-item ${isSelected ? 'active-filter' : ''}`}
                  onClick={() => onSelectOwner(isSelected ? null : member.id)}
                  title={`Filtrar reservas asignadas a ${member.full_name} (${roleDisplay})`}
                >
                  <div className="avatar-wrapper">
                    <img src={member.avatar_url} alt={member.full_name} className="avatar-img" />
                    <span className="online-status"></span>
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.full_name}</span>
                    <span className="member-role">{roleDisplay}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User profile footer */}
      <div className="user-footer">
        <div className="user-profile">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Iona Rollins"
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#18181B' }}>Iona Rollins</span>
            <span style={{ fontSize: '11px', color: '#71717A' }}>Chief Commercial Officer (CCO)</span>
          </div>
        </div>
        <button
          style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer' }}
          title="Cerrar sesión"
          onClick={() => alert("Sesión activa de Iona Rollins (CCO AeroLink)")}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
