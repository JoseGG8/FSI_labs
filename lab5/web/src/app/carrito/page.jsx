'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  Download,
  Lock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { apiRequest, formatCurrency, PAYPAL_CLIENT_ID } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

function CartCheckoutContent() {
  const searchParams = useSearchParams();
  const resumeOrderId = searchParams.get('orderId');

  const { user, token, isAuthenticated } = useAuth();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  const [emailDelivery, setEmailDelivery] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [paidOrder, setPaidOrder] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (user?.email && !emailDelivery) {
      setEmailDelivery(user.email);
    }
  }, [user, emailDelivery]);

  // Permitir retomar pago de un pedido pendiente desde /pedidos
  useEffect(() => {
    if (!resumeOrderId || !token) return;
    let active = true;

    async function loadExistingOrder() {
      try {
        const res = await apiRequest(`/api/orders/${resumeOrderId}`, { token });
        if (!active) return;
        if (res.order.paymentStatus === 'pagado') {
          setPaidOrder(res.order);
        } else {
          setActiveOrder(res.order);
          setEmailDelivery(res.order.emailDelivery || user?.email || '');
        }
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    loadExistingOrder();
    return () => {
      active = false;
    };
  }, [resumeOrderId, token, user]);

  const handleCreateOrder = async () => {
    if (!isAuthenticated) return;
    setCreatingOrder(true);
    setError('');
    setStatusMessage('');

    try {
      const payload = {
        items: items.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity
        })),
        emailDelivery: emailDelivery.trim() || user.email
      };

      if (city.trim() || country.trim()) {
        payload.shippingAddress = {
          recipientName: user.name,
          city: city.trim(),
          country: country.trim()
        };
      }

      const data = await apiRequest('/api/orders', {
        method: 'POST',
        token,
        body: payload
      });

      setActiveOrder(data.order);
      setStatusMessage(
        'Pedido reservado en el servidor. Completa el pago con PayPal Sandbox para desbloquear tus eBooks.'
      );
    } catch (err) {
      setError(err.message || 'No se pudo crear el pedido');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (paidOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            ¡Pago confirmado y verificado!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Pedido <span className="font-mono font-semibold">#{paidOrder._id.slice(-8)}</span> ·
            Entrega digital a <strong>{paidOrder.emailDelivery}</strong> · Total pagado:{' '}
            <strong>{formatCurrency(paidOrder.total)}</strong>
          </p>

          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Tus eBooks listos para descarga
            </h2>
            {paidOrder.items.map((item, idx) => (
              <div
                key={`${item.bookId}-${idx}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {item.author} · Cantidad: {item.quantity} · {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                {item.downloadUrl && (
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar eBook
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pedidos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800"
            >
              Ver seguimiento en Mis Libros
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Seguir explorando el catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-6">
        Carrito y Checkout Digital
      </h1>

      {error && (
        <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {statusMessage && (
        <div className="mb-6 rounded-2xl bg-sky-50 border border-sky-200 p-4 text-sm text-sky-900">
          {statusMessage}
        </div>
      )}

      {!activeOrder && items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Tu carrito está vacío</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Agrega uno o más eBooks desde el catálogo para iniciar tu compra.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800"
          >
            Ir al catálogo de eBooks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items */}
          <div className="lg:col-span-7 space-y-4">
            {activeOrder ? (
              <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Pedido reservado #{activeOrder._id.slice(-8)}
                    </span>
                    <h2 className="text-lg font-bold text-navy-900">
                      Artículos confirmados en servidor
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Pendiente de pago
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {activeOrder.items.map((item, idx) => (
                    <div key={`${item.bookId}-${idx}`} className="py-3 flex justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">
                          {item.author} · {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-navy-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.bookId}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 shadow-sm"
                >
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.author}</p>
                    <p className="text-sm font-extrabold text-navy-900 mt-2">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.bookId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Quitar eBook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-700"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Summary & PayPal Checkout */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-navy-900">Resumen del pedido</h2>

            {!activeOrder && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo para entrega digital *
                  </label>
                  <input
                    type="email"
                    required
                    value={emailDelivery}
                    onChange={(e) => setEmailDelivery(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ciudad (opcional)
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Medellín"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      País (opcional)
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Colombia"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-b border-slate-100 py-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Entrega digital</span>
                <span className="text-emerald-700 font-semibold">Gratis</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-navy-900 pt-1">
                <span>Total a pagar (USD)</span>
                <span>{formatCurrency(activeOrder ? activeOrder.total : subtotal)}</span>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-sm text-amber-950 font-medium mb-3">
                  Inicia sesión o regístrate para confirmar tu pedido y pagar con PayPal.
                </p>
                <Link
                  href="/auth?redirect=/carrito"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800"
                >
                  <Lock className="w-4 h-4" />
                  Iniciar sesión para comprar
                </Link>
              </div>
            ) : !activeOrder ? (
              <button
                onClick={handleCreateOrder}
                disabled={creatingOrder}
                className="w-full py-3 px-4 rounded-xl bg-navy-700 text-white font-semibold text-sm hover:bg-navy-800 transition-colors disabled:opacity-60"
              >
                {creatingOrder
                  ? 'Verificando stock y reservando...'
                  : '1. Confirmar pedido y habilitar PayPal'}
              </button>
            ) : !PAYPAL_CLIENT_ID ? (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                Falta configurar <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> en el entorno del
                frontend.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600">
                  2. Paga de forma segura con tu cuenta cliente de PayPal Sandbox:
                </p>
                <PayPalScriptProvider
                  options={{
                    clientId: PAYPAL_CLIENT_ID,
                    currency: 'USD',
                    intent: 'capture'
                  }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                    createOrder={async () => {
                      setError('');
                      const res = await apiRequest('/api/payments/paypal/order', {
                        method: 'POST',
                        token,
                        body: { orderId: activeOrder._id }
                      });
                      return res.paypalOrderId;
                    }}
                    onApprove={async (data) => {
                      try {
                        setError('');
                        setStatusMessage('Verificando monto y capturando pago en servidor...');
                        const res = await apiRequest('/api/payments/paypal/capture', {
                          method: 'POST',
                          token,
                          body: {
                            orderId: activeOrder._id,
                            paypalOrderId: data.orderID
                          }
                        });
                        clearCart();
                        setPaidOrder(res.order);
                        setActiveOrder(null);
                      } catch (err) {
                        setError(err.message || 'Error al capturar el pago en el servidor');
                      }
                    }}
                    onCancel={() => {
                      setStatusMessage(
                        'Pago cancelado en PayPal. Tu pedido sigue reservado; puedes reintentar cuando quieras.'
                      );
                    }}
                    onError={(err) => {
                      console.error('PayPal SDK error:', err);
                      setError('Error con el botón de PayPal Sandbox. Reintenta nuevamente.');
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CarritoPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-12 text-center text-sm text-slate-500">
          Cargando carrito...
        </div>
      }
    >
      <CartCheckoutContent />
    </Suspense>
  );
}
