'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Package,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  RefreshCw,
  Radio
} from 'lucide-react';
import { apiRequest, formatCurrency, formatDate } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';

const STATUS_STEPS = ['pendiente', 'procesando', 'enviado', 'entregado'];

const STATUS_META = {
  pendiente: { label: 'Pendiente', color: 'bg-slate-100 text-slate-700', icon: Clock },
  procesando: { label: 'Procesando', color: 'bg-sky-100 text-sky-800', icon: Package },
  enviado: { label: 'Enviado', color: 'bg-amber-100 text-amber-800', icon: Truck },
  entregado: { label: 'Entregado', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  cancelado: { label: 'Cancelado', color: 'bg-rose-100 text-rose-800', icon: XCircle }
};

export default function PedidosPage() {
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const { lastEvent, connected } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/orders/me', { token });
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, token, authLoading, fetchOrders]);

  // Actualización en tiempo real al recibir eventos de Socket.IO
  useEffect(() => {
    if (!lastEvent?.payload?.order) return;
    const updatedOrder = lastEvent.payload.order;

    setOrders((prev) => {
      const exists = prev.some((o) => o._id === updatedOrder._id);
      if (exists) {
        return prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
      }
      if (lastEvent.event === 'order:created') {
        return [updatedOrder, ...prev];
      }
      return prev;
    });
  }, [lastEvent]);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
          <Package className="w-12 h-12 text-navy-700 mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-navy-900">Mis Libros y Pedidos</h1>
          <p className="text-sm text-slate-600 mt-2 mb-6">
            Inicia sesión para consultar tus eBooks comprados, descargar archivos y seguir el estado
            de tus entregas en tiempo real.
          </p>
          <Link
            href="/auth?redirect=/pedidos"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Mis Libros e Historial de Pedidos
          </h1>
          <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
            <Radio className={`w-4 h-4 ${connected ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
            {connected
              ? 'Seguimiento en tiempo real activo — los cambios de estado aparecen al instante.'
              : 'Conectando al canal en tiempo real...'}
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Aún no tienes compras registradas</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Explora el catálogo y adquiere tu primer eBook.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const meta = STATUS_META[order.status] || STATUS_META.pendiente;
            const StatusIcon = meta.icon;
            const stepIndex = STATUS_STEPS.indexOf(order.status);
            const isPaid = order.paymentStatus === 'pagado';

            return (
              <article
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-navy-900">
                        Pedido #{order._id.slice(-8)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pago: {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      Fecha: {formatDate(order.createdAt)} · Entrega digital: {order.emailDelivery}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total</span>
                    <span className="text-xl font-extrabold text-navy-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                {order.status !== 'cancelado' && (
                  <div className="grid grid-cols-4 gap-2 my-4">
                    {STATUS_STEPS.map((step, idx) => {
                      const active = idx <= stepIndex;
                      return (
                        <div key={step} className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full transition-colors ${
                              active ? 'bg-navy-700' : 'bg-slate-200'
                            }`}
                          />
                          <span
                            className={`block text-[11px] capitalize font-medium ${
                              active ? 'text-navy-900' : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Order Items */}
                <div className="mt-4 space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.bookId}-${idx}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">
                          {item.author} · Cantidad: {item.quantity} ·{' '}
                          {formatCurrency(item.unitPrice)} c/u
                        </p>
                      </div>

                      {isPaid && item.downloadUrl ? (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Descargar eBook
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Descarga bloqueada hasta confirmar pago
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {!isPaid && order.status !== 'cancelado' && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                    <Link
                      href={`/carrito?orderId=${order._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
                    >
                      <CreditCard className="w-4 h-4" />
                      Completar pago con PayPal Sandbox
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
