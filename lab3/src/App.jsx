import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TopAnalyticsBanner from './components/TopAnalyticsBanner';
import KpiCards from './components/KpiCards';
import PipelineBoard from './components/PipelineBoard';
import ChartsSection from './components/ChartsSection';
import DealsTable from './components/DealsTable';
import DealModal from './components/DealModal';
import DealDetailModal from './components/DealDetailModal';
import N8nChatWidget from './components/N8nChatWidget';

import {
  initialUsers,
  initialStages,
  initialCustomers,
  initialDeals
} from './data/mockData';

import { computeDashboardMetrics } from './utils/calculations';
import { Columns3, BarChart2, Table2, RotateCcw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Estado local reactivo (Mock Data Store)
  const [users, setUsers] = useState(initialUsers);
  const [stages, setStages] = useState(initialStages);
  const [customers, setCustomers] = useState(initialCustomers);
  const [deals, setDeals] = useState(initialDeals);

  // Filtros y Vistas
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStageFilter, setSelectedStageFilter] = useState(null);
  const [currentView, setCurrentView] = useState("pipeline"); // 'pipeline' | 'analytics' | 'table'

  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (message) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filtrado y ordenamiento en tiempo real
  const processedDeals = useMemo(() => {
    let result = [...deals];

    // 1. Filtro por Vendedor
    if (selectedOwnerId) {
      result = result.filter(d => d.owner_id === selectedOwnerId);
    }

    // 2. Filtro por Etapa
    if (selectedStageFilter) {
      result = result.filter(d => d.stage_id === selectedStageFilter);
    }

    // 3. Búsqueda por texto (Empresa, Trato, Industria)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const customerMap = customers.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {});

      result = result.filter(d => {
        const c = customerMap[d.customer_id];
        return (
          d.title.toLowerCase().includes(q) ||
          (c && c.company_name.toLowerCase().includes(q)) ||
          (c && c.industry.toLowerCase().includes(q))
        );
      });
    }

    // 4. Ordenamiento
    if (sortBy === "amount_desc") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "amount_asc") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [deals, selectedOwnerId, selectedStageFilter, searchQuery, sortBy, customers]);

  // Cálculos dinámicos de KPIs basados en el estado
  const metrics = useMemo(() => {
    return computeDashboardMetrics(deals, stages, users, selectedOwnerId);
  }, [deals, stages, users, selectedOwnerId]);

  // Handler: Crear nuevo Deal
  const handleSaveDeal = ({
    title,
    customerId,
    newCustomerName,
    ownerId,
    stageId,
    amount,
    currency,
    status,
    expectedCloseDate
  }) => {
    let resolvedCustomerId = customerId;

    // Si se creó una empresa nueva
    if (newCustomerName) {
      const newCustId = `c${Date.now()}`;
      const newCustomer = {
        id: newCustId,
        company_name: newCustomerName,
        industry: "General B2B",
        contact_person: "Contacto Principal",
        email: `info@${newCustomerName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: "+1 (555) 000-0000",
        address: "Oficinas Centrales",
        description: `Cliente B2B de ${newCustomerName}`,
        created_at: new Date().toISOString()
      };
      setCustomers(prev => [...prev, newCustomer]);
      resolvedCustomerId = newCustId;
    }

    const newDeal = {
      id: `d${Date.now()}`,
      title,
      customer_id: resolvedCustomerId,
      owner_id: ownerId,
      stage_id: stageId,
      amount: Number(amount) || 0,
      currency: currency || "EUR",
      status: status || "open",
      created_at: new Date().toISOString(),
      expected_close_date: expectedCloseDate,
      closed_at: status === "won" ? new Date().toISOString() : null,
      comments_count: 0,
      attachments_count: 0
    };

    setDeals(prev => [newDeal, ...prev]);

    if (status === "won") {
      confetti({ particleCount: 70, spread: 60 });
    }

    showToast(`Oportunidad "${title}" creada con éxito.`);
  };

  // Handler: Actualizar Deal existente
  const handleUpdateDeal = (updatedDeal) => {
    setDeals(prev => prev.map(d => (d.id === updatedDeal.id ? updatedDeal : d)));
    showToast(`Trato actualizado. Los KPIs y gráficos se han recalculado.`);
  };

  // Handler: Eliminar Deal
  const handleDeleteDeal = (dealId) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
    showToast("Trato eliminado.");
  };

  // Handler: Cambio rápido de estado en tabla
  const handleUpdateDealStatus = (dealId, newStatus) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const isWon = newStatus === 'won';
        if (isWon) {
          confetti({ particleCount: 80, spread: 50, origin: { y: 0.7 } });
        }
        return {
          ...d,
          status: newStatus,
          stage_id: isWon ? 's4' : (newStatus === 'lost' ? 's5' : d.stage_id),
          closed_at: isWon ? new Date().toISOString() : d.closed_at
        };
      }
      return d;
    }));
    showToast(`Estado actualizado a "${newStatus}". KPIs actualizados.`);
  };

  // Handler: Cambio rápido de etapa en tabla
  const handleUpdateDealStage = (dealId, newStageId) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const isWonStage = newStageId === 's4';
        const isLostStage = newStageId === 's5';
        if (isWonStage) {
          confetti({ particleCount: 70, spread: 60 });
        }
        return {
          ...d,
          stage_id: newStageId,
          status: isWonStage ? 'won' : (isLostStage ? 'lost' : 'open'),
          closed_at: isWonStage ? new Date().toISOString() : d.closed_at
        };
      }
      return d;
    }));
    showToast(`Etapa actualizada.`);
  };

  // Resetear a datos iniciales
  const handleResetData = () => {
    if (confirm("¿Deseas restaurar la base de datos simulada a los valores iniciales?")) {
      setDeals(initialDeals);
      setCustomers(initialCustomers);
      setUsers(initialUsers);
      setSelectedOwnerId(null);
      setSearchQuery("");
      showToast("Datos restaurados correctamente.");
    }
  };

  // Seleccionar trato para el modal de detalle
  const activeCustomer = selectedDeal ? customers.find(c => c.id === selectedDeal.customer_id) : null;
  const activeOwner = selectedDeal ? users.find(u => u.id === selectedDeal.owner_id) : null;

  return (
    <div className="app-container">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#18181B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={16} color="#10B981" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. Sidebar Fijo Estilo BizLink */}
      <Sidebar
        users={users}
        selectedOwnerId={selectedOwnerId}
        onSelectOwner={setSelectedOwnerId}
        currentView={currentView}
        onChangeView={setCurrentView}
        openDealsCount={metrics.activeDealsCount}
      />

      {/* 2. Área Principal de Contenido */}
      <main className="main-wrapper">
        {/* Top Navigation Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedOwnerId={selectedOwnerId}
          onSelectOwner={setSelectedOwnerId}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          selectedStageFilter={selectedStageFilter}
          onSelectStageFilter={setSelectedStageFilter}
          stages={stages}
        />

        {/* Top Analytics Banner (BizLink Header: Bar chart + Radial Gauge + Stats) */}
        <TopAnalyticsBanner
          metrics={metrics}
          onViewTasks={() => setCurrentView('pipeline')}
          onViewRevenue={() => setCurrentView('analytics')}
        />

        {/* Pestañas de Vista y Controles de Navegación */}
        <div className="view-mode-tabs">
          <div className="tabs-group">
            <button
              className={`tab-btn ${currentView === 'pipeline' ? 'active' : ''}`}
              onClick={() => setCurrentView('pipeline')}
            >
              <Columns3 size={15} />
              <span>Flight Pipeline</span>
            </button>

            <button
              className={`tab-btn ${currentView === 'analytics' ? 'active' : ''}`}
              onClick={() => setCurrentView('analytics')}
            >
              <BarChart2 size={15} />
              <span>Revenue & Yield</span>
            </button>

            <button
              className={`tab-btn ${currentView === 'table' ? 'active' : ''}`}
              onClick={() => setCurrentView('table')}
            >
              <Table2 size={15} />
              <span>Registro de Vuelos</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedOwnerId && (
              <span style={{ fontSize: '12px', color: '#71717A' }}>
                Filtrado por: <strong style={{ color: '#18181B' }}>{users.find(u => u.id === selectedOwnerId)?.full_name}</strong>
              </span>
            )}
            <button
              onClick={handleResetData}
              className="action-pill-btn"
              style={{ fontSize: '11px', color: '#71717A' }}
              title="Restaurar datos simulados de fábrica"
            >
              <RotateCcw size={12} />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* 4 KPIs Superiores Requeridos */}
        <KpiCards metrics={metrics} />

        {/* Contenido según la pestaña activa */}
        {currentView === 'pipeline' && (
          <PipelineBoard
            stages={stages}
            deals={processedDeals}
            customers={customers}
            users={users}
            onSelectDeal={setSelectedDeal}
            onQuickMoveStage={handleUpdateDealStage}
            onQuickMarkWon={(id) => handleUpdateDealStatus(id, 'won')}
            onQuickMarkLost={(id) => handleUpdateDealStatus(id, 'lost')}
          />
        )}

        {currentView === 'analytics' && (
          <ChartsSection
            metrics={metrics}
            stages={stages}
            users={users}
          />
        )}

        {currentView === 'table' && (
          <DealsTable
            deals={processedDeals}
            stages={stages}
            customers={customers}
            users={users}
            onSelectDeal={setSelectedDeal}
            onUpdateDealStatus={handleUpdateDealStatus}
            onUpdateDealStage={handleUpdateDealStage}
          />
        )}

        {/* Si estamos en vista Pipeline, mostramos también la sección de Gráficos abajo para una experiencia completa */}
        {currentView === 'pipeline' && (
          <div style={{ marginTop: '36px' }}>
            <ChartsSection
              metrics={metrics}
              stages={stages}
              users={users}
            />
            <DealsTable
              deals={processedDeals.slice(0, 10)}
              stages={stages}
              customers={customers}
              users={users}
              onSelectDeal={setSelectedDeal}
              onUpdateDealStatus={handleUpdateDealStatus}
              onUpdateDealStage={handleUpdateDealStage}
            />
          </div>
        )}
      </main>

      {/* Modal para Crear Deal */}
      <DealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveDeal={handleSaveDeal}
        customers={customers}
        users={users}
        stages={stages}
      />

      {/* Modal de Detalle y Edición en Tiempo Real */}
      <DealDetailModal
        deal={selectedDeal}
        customer={activeCustomer}
        owner={activeOwner}
        stages={stages}
        users={users}
        onClose={() => setSelectedDeal(null)}
        onUpdateDeal={handleUpdateDeal}
        onDeleteDeal={handleDeleteDeal}
      />

      {/* Ventana de Chat con Agente IA de N8N */}
      <N8nChatWidget
        metrics={metrics}
        deals={deals}
        users={users}
      />
    </div>
  );
}
