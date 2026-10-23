import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CornerDownLeft,
  Settings,
  Cpu
} from 'lucide-react';

const DEFAULT_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://lab3fsi.app.n8n.cloud/webhook/5581c101-57a2-445d-bd21-08705955f777";

export default function N8nChatWidget({ metrics, deals, users }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("bizlink_n8n_webhook_url") || DEFAULT_WEBHOOK_URL;
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-bizlink-${Date.now()}`);

  const handleUpdateWebhookUrl = (newUrl) => {
    const trimmed = newUrl.trim();
    setWebhookUrl(trimmed);
    localStorage.setItem("bizlink_n8n_webhook_url", trimmed);
  };

  const [messages, setMessages] = useState([
    {
      id: "m-welcome",
      sender: "ai",
      text: "✈️ ¡Hola! Soy tu **Agente de IA para Revenue Management de AeroLink**, conectado a tu workflow de **N8N**.\n\nPuedo ayudarte a consultar ingresos de vuelos emitidos, analizar cupos de agencias, revisar cuotas de tus Route Managers o evaluar tarifas para acuerdos corporativos y chárters.\n\n¿En qué te puedo asistir hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const quickPrompts = [
    "¿Cuál es el Load Factor y RASK actual de la red?",
    "¿Qué rutas superan la meta del 82% de ocupación?",
    "¿Cuál es el Revenue total emitido y el Win Rate?",
    "¿Cómo va el cumplimiento de cuota de Antony Cárdenas en BOG/MAD?"
  ];

  const handleSendMessage = async (textToSend = null) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent || isLoading) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Preparar contexto del CRM en vivo con métricas nativas de Revenue Management Aéreo
    const crmContext = {
      // Métricas de Rendimiento de Vuelo (Revenue Management)
      loadFactor: `${metrics.loadFactor}%`,
      loadFactorTarget: `${metrics.loadFactorTarget}%`,
      loadFactorMet: metrics.isLoadFactorMet,
      wonSeats: metrics.wonSeats,
      availableSeats: metrics.availableSeats,
      rask: `${metrics.raskFormatted} / ASK (${metrics.raskCents} ¢/ASK)`,
      yield: `${metrics.yieldFormatted} / RPK (${metrics.yieldCents} ¢/RPK)`,
      totalRPK: `${(metrics.totalRPK / 1000000).toFixed(2)}M RPK`,
      totalASK: `${(metrics.totalASK / 1000000).toFixed(2)}M ASK`,
      routesPerformance: (metrics.routesPerformance || []).map(r => ({
        route: r.route,
        loadFactor: `${r.loadFactor}%`,
        isTargetMet: r.isTargetMet,
        wonSeats: r.wonSeats,
        capacity: r.capacity,
        revenue: r.wonRevenue
      })),

      // Métricas Comerciales Generales
      totalRevenue: metrics.totalRevenue,
      activeDealsCount: metrics.activeDealsCount,
      activePipelineValue: metrics.activePipelineValue,
      winRate: `${metrics.winRate}%`,
      avgDealSize: metrics.avgDealSize,
      targetQuota: metrics.targetQuota,
      quotaAttainment: `${metrics.quotaAttainment}%`,
      stagesSummary: metrics.pipelineByStage.map(s => ({ stage: s.name, count: s.count, amount: s.amount })),
      topDeals: deals.slice(0, 5).map(d => ({ title: d.title, route: d.route, amount: d.amount, status: d.status, stage_id: d.stage_id })),
      salesTeam: users.map(u => ({ name: u.full_name, role: u.role, quota: u.quota_amount }))
    };

    // Payload compatible con N8N Webhook y N8N AI Agent Chat Trigger
    const payload = {
      message: messageContent,
      chatInput: messageContent,
      text: messageContent,
      prompt: messageContent,
      sessionId: sessionId,
      crmContext: crmContext,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let responseData = null;
      let rawText = "";

      if (!response.ok) {
        try {
          responseData = await response.json();
        } catch {
          rawText = await response.text();
        }
        const errorMsg = responseData?.message || rawText || `HTTP Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      // Procesar respuesta de N8N
      let aiReplyText = "";
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        // Extraer texto según la convención del nodo de N8N
        if (data.output) {
          aiReplyText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output, null, 2);
        } else if (data.text) {
          aiReplyText = data.text;
        } else if (data.response) {
          aiReplyText = data.response;
        } else if (data.reply) {
          aiReplyText = data.reply;
        } else if (data.content) {
          aiReplyText = data.content;
        } else if (data.message && data.message !== "Workflow was started") {
          aiReplyText = data.message;
        } else if (Array.isArray(data) && data[0]?.output) {
          aiReplyText = data[0].output;
        } else if (data.message === "Workflow was started") {
          aiReplyText = `✅ **Workflow de N8N iniciado correctamente.**\n\nEl webhook recibió tu mensaje: *"${messageContent}"* y comenzó la ejecución en tu servidor N8N.\n\n*(Nota: Si deseas que el agente responda con texto directo en este chat, asegúrate de que tu workflow en N8N finalice con un nodo **"Respond to Webhook"** o **"Chat Response"** devolviendo el resultado del modelo).*`;
        } else {
          aiReplyText = JSON.stringify(data, null, 2);
        }
      } else {
        const textContent = await response.text();
        aiReplyText = textContent || "Respuesta recibida desde el webhook de N8N.";
      }

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error communicating with N8N Webhook:", error);
      let errorExplanation = `⚠️ **No se pudo conectar con el Webhook de N8N**\n\n*Detalle del error:* ${error.message}`;

      if (error.message.includes("Error in workflow")) {
        errorExplanation = `⚠️ **Error en el flujo interno de N8N (\`Error in workflow\`)**\n\nEl webhook en \`${webhookUrl}\` recibió la petición con éxito (HTTP 200/500), pero la ejecución falló dentro de N8N.\n\n**Pasos para resolverlo en N8N:**\n1. Entra a tu instancia de N8N y abre este workflow.\n2. Ve a la pestaña **"Executions"** para ver qué nodo falló en rojo.\n3. Asegúrate de que las credenciales de la IA (OpenAI / Anthropic / Gemini) estén configuradas y con saldo.\n4. Si estás probando en modo edición, puedes usar la URL de prueba (\`webhook-test\`) configurándola en el botón de ajustes (⚙️).`;
      }

      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        isError: true,
        text: errorExplanation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (confirm("¿Deseas reiniciar la conversación con el agente?")) {
      setMessages([
        {
          id: "m-welcome-reset",
          sender: "ai",
          text: "Conversación reiniciada. ¿Qué consulta deseas hacer a tu agente de IA?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Formateador simple de markdown para negritas, listas y saltos de línea
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Reemplazo básico de negritas **texto**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx} style={{ display: 'block', minHeight: line.trim() === '' ? '8px' : 'auto' }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} style={{ fontWeight: 700, color: '#18181B' }}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx}>{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Botón Flotante para Abrir el Chat (Bottom Right) */}
      {!isOpen && (
        <button
          className="n8n-chat-floating-btn"
          onClick={() => setIsOpen(true)}
          title="Abrir Asistente IA de N8N"
        >
          <div className="pulse-ring"></div>
          <div className="btn-inner">
            <Sparkles size={20} className="sparkle-icon" />
            <span className="btn-label">IA Copilot</span>
          </div>
          <span className="online-badge-dot"></span>
        </button>
      )}

      {/* Ventana de Chat Modal Flotante */}
      {isOpen && (
        <div className={`n8n-chat-window ${isExpanded ? 'expanded' : ''}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="agent-avatar-box">
                <Bot size={20} color="#FFFFFF" />
                <span className="active-dot"></span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 className="agent-name">AeroLink Copilot</h4>
                  <span className="n8n-pill">Airline AI</span>
                </div>
                <div className="agent-status-line">
                  <span className="status-indicator"></span>
                  <span>Webhook Conectado • POST</span>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                className="icon-btn-subtle"
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                title="Configuración de Webhook"
              >
                <Settings size={15} />
              </button>

              <button
                className="icon-btn-subtle"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Reducir ventana" : "Expandir ventana"}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              <button
                className="icon-btn-subtle"
                onClick={handleClearChat}
                title="Limpiar conversación"
              >
                <Trash2 size={15} />
              </button>

              <button
                className="icon-btn-subtle close-chat"
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Panel de Configuración del Webhook (Desplegable) */}
          {isConfigOpen && (
            <div className="webhook-config-drawer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#18181B' }}>URL del Webhook (N8N):</span>
                <button
                  onClick={() => setIsConfigOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '11px', color: '#71717A', cursor: 'pointer' }}
                >
                  Ocultar
                </button>
              </div>
              <input
                type="text"
                className="config-url-input"
                value={webhookUrl}
                onChange={(e) => handleUpdateWebhookUrl(e.target.value)}
                placeholder="https://.../webhook/..."
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: '#71717A' }}>
                <span>Método: <strong>POST</strong></span>
                <button
                  type="button"
                  onClick={() => handleUpdateWebhookUrl(DEFAULT_WEBHOOK_URL)}
                  style={{ background: 'none', border: 'none', color: '#F97316', cursor: 'pointer', fontWeight: 600 }}
                >
                  Restaurar default
                </button>
              </div>
            </div>
          )}

          {/* Historial de Mensajes */}
          <div className="chat-messages-container">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${isUser ? 'user-row' : 'ai-row'}`}
                >
                  {!isUser && (
                    <div className="msg-avatar ai">
                      <Sparkles size={13} color="#FF6B4A" />
                    </div>
                  )}

                  <div className={`chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'} ${msg.isError ? 'error-bubble' : ''}`}>
                    <div className="bubble-text">
                      {renderFormattedText(msg.text)}
                    </div>
                    <span className="bubble-timestamp">{msg.timestamp}</span>
                  </div>

                  {isUser && (
                    <div className="msg-avatar user">
                      <User size={13} color="#FFFFFF" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Indicador de "Escribiendo..." */}
            {isLoading && (
              <div className="chat-bubble-row ai-row">
                <div className="msg-avatar ai">
                  <Sparkles size={13} color="#FF6B4A" />
                </div>
                <div className="chat-bubble ai-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#71717A', marginLeft: '6px' }}>
                    Consultando con el agente de N8N...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas (Chips) */}
          <div className="chat-quick-prompts">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                className="prompt-chip"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input de Mensajes */}
          <div className="chat-input-bar">
            <textarea
              ref={inputRef}
              rows={1}
              className="chat-textarea"
              placeholder="Pregúntale a tu agente de IA..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />

            <button
              className="send-msg-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              title="Enviar mensaje (Enter)"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
