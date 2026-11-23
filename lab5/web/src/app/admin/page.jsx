'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Package,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Radio,
  Plus,
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { apiRequest, formatCurrency, formatDate } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';

const ORDER_STATUSES = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

const INITIAL_NEW_BOOK = {
  title: '',
  author: '',
  description: '',
  category: 'Desarrollo Web',
  price: '19.99',
  stock: '15',
  coverImageUrl:
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
  downloadUrl: 'https://downloads.ebookstore.local/ebooks/nuevo-ebook.pdf',
  format: 'PDF / EPUB',
  pages: '280'
};

export default function AdminPage() {
  const { token, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { lastEvent, connected } = useSocket();

  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [stockDrafts, setStockDrafts] = useState({});
  const [priceDrafts, setPriceDrafts] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNewBookForm, setShowNewBookForm] = useState(false);
  const [newBook, setNewBook] = useState(INITIAL_NEW_BOOK);

  const fetchAdminData = useCallback(async () => {
    if (!token || !isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const [ordersData, booksData] = await Promise.all([
        apiRequest('/api/orders', { token }),
        apiRequest('/api/books', { token })
      ]);
      setOrders(ordersData.orders || []);
      const fetchedBooks = booksData.books || [];
      setBooks(fetchedBooks);
      setStockDrafts(
        Object.fromEntries(fetchedBooks.map((b) => [b._id, String(b.stock)]))
      );
      setPriceDrafts(
        Object.fromEntries(fetchedBooks.map((b) => [b._id, String(b.price)]))
      );
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los datos del panel');
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    if (isAuthenticated && isAdmin && token) {
      fetchAdminData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, token, authLoading, fetchAdminData]);

  // Escuchar eventos en tiempo real de nuevas ventas y cambios de estado
  useEffect(() => {
    if (!lastEvent?.payload?.order || !isAdmin) return;
    const incomingOrder = lastEvent.payload.order;

    setOrders((prev) => {
      const exists = prev.some((o) => o._id === incomingOrder._id);
      if (exists) {
        return prev.map((o) => (o._id === incomingOrder._id ? incomingOrder : o));
      }
      return [incomingOrder, ...prev];
    });

    if (lastEvent.event === 'order:created' || lastEvent.event === 'order:paid') {
      // Refrescar libros para reflejar stock actualizado en vivo
      apiRequest('/api/books', { token })
        .then((booksData) => {
          const fetchedBooks = booksData.books || [];
          setBooks(fetchedBooks);
          setStockDrafts(
            Object.fromEntries(fetchedBooks.map((b) => [b._id, String(b.stock)]))
          );
        })
        .catch(() => null);
    }
  }, [lastEvent, isAdmin, token]);

  const handleStatusChange = async (orderId, nextStatus) => {
    setSavingId(orderId);
    setError('');
    setMessage('');
    try {
      const res = await apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        token,
        body: { status: nextStatus }
      });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.order : o)));
      setMessage(res.message);
      if (nextStatus === 'cancelado') {
        fetchAdminData();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdateBook = async (bookId) => {
    setSavingId(bookId);
    setError('');
    setMessage('');
    try {
      const res = await apiRequest(`/api/books/${bookId}`, {
        method: 'PATCH',
        token,
        body: {
          stock: Number(stockDrafts[bookId]),
          price: Number(priceDrafts[bookId])
        }
      });
      setBooks((prev) => prev.map((b) => (b._id === bookId ? res.book : b)));
      setMessage(`"${res.book.title}" actualizado (stock: ${res.book.stock}).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    setSavingId('new-book');
    setError('');
    setMessage('');
    try {
      const res = await apiRequest('/api/books', {
        method: 'POST',
        token,
        body: {
          ...newBook,
          price: Number(newBook.price),
          stock: Number(newBook.stock),
          pages: Number(newBook.pages)
        }
      });
      setBooks((prev) => [res.book, ...prev]);
      setStockDrafts((prev) => ({ ...prev, [res.book._id]: String(res.book.stock) }));
      setPriceDrafts((prev) => ({ ...prev, [res.book._id]: String(res.book.price) }));
      setNewBook(INITIAL_NEW_BOOK);
      setShowNewBookForm(false);
      setMessage(`eBook "${res.book.title}" agregado al catálogo.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`¿Eliminar "${book.title}" del catálogo?`)) return;
    setSavingId(book._id);
    setError('');
    try {
      await apiRequest(`/api/books/${book._id}`, { method: 'DELETE', token });
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
      setMessage(`"${book.title}" eliminado.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const kpis = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === 'pagado');
    const revenue = paidOrders.reduce((acc, o) => acc + Number(o.total || 0), 0);
    const lowStockCount = books.filter((b) => b.stock <= 5).length;
    return {
      revenue,
      totalOrders: orders.length,
      paidCount: paidOrders.length,
      lowStockCount
    };
  }, [orders, books]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-navy-900">Acceso solo para Administradores</h1>
          <p className="text-sm text-slate-600 mt-2 mb-6">
            Inicia sesión con una cuenta con rol <strong>administrador</strong> para gestionar
            stock, pedidos y envíos digitales.
          </p>
          <Link
            href="/auth?redirect=/admin"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Panel de Gestión eBookStore
          </h1>
          <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
            <Radio className={`w-4 h-4 ${connected ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
            {connected
              ? 'Conectado a sala admins — nuevas ventas y pedidos aparecen en tiempo real.'
              : 'Conectando WebSocket...'}
          </p>
        </div>
        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Ingresos confirmados</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">
            {formatCurrency(kpis.revenue)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pedidos totales</span>
            <Package className="w-4 h-4 text-navy-700" />
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{kpis.totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Ventas pagadas (PayPal)</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{kpis.paidCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>eBooks con stock bajo (≤5)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-2">{kpis.lowStockCount}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setTab('orders')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'orders' ? 'bg-navy-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Pedidos y Envíos ({orders.length})
        </button>
        <button
          onClick={() => setTab('books')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'books' ? 'bg-navy-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Catálogo y Stock ({books.length})
        </button>
      </div>

      {/* Tab 1: Orders */}
      {tab === 'orders' ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {['all', ...ORDER_STATUSES].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                  statusFilter === st
                    ? 'bg-navy-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st === 'all' ? 'Todos' : st}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
              No hay pedidos en esta categoría todavía.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Pedido / Fecha</th>
                    <th className="px-4 py-3">Cliente / Entrega</th>
                    <th className="px-4 py-3">eBooks</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Pago</th>
                    <th className="px-4 py-3">Estado de envío</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5 align-top">
                        <span className="font-mono font-bold text-navy-900">
                          #{order._id.slice(-8)}
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <span className="font-semibold text-slate-900 block">
                          {order.userId?.name || 'Cliente'}
                        </span>
                        <span className="text-xs text-slate-500 block">{order.emailDelivery}</span>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <ul className="space-y-1 text-xs text-slate-700">
                          {order.items.map((it, idx) => (
                            <li key={`${it.bookId}-${idx}`}>
                              <strong>{it.quantity}×</strong> {it.title}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3.5 align-top font-bold text-navy-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'pagado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.paymentStatus === 'fallido'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <select
                          value={order.status}
                          disabled={savingId === order._id || order.status === 'cancelado'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white capitalize focus:outline-none focus:ring-2 focus:ring-navy-700 disabled:opacity-60"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        /* Tab 2: Books & Stock */
        <section className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowNewBookForm((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700"
            >
              <Plus className="w-4 h-4" />
              {showNewBookForm ? 'Cerrar formulario' : 'Agregar nuevo eBook'}
            </button>
          </div>

          {showNewBookForm && (
            <form
              onSubmit={handleCreateBook}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h3 className="md:col-span-2 font-bold text-navy-900">Nuevo libro electrónico</h3>
              <input
                required
                placeholder="Título del eBook"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <input
                required
                placeholder="Autor"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <input
                required
                placeholder="Categoría"
                value={newBook.category}
                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Precio USD"
                  value={newBook.price}
                  onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={newBook.stock}
                  onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <input
                required
                placeholder="URL de portada"
                value={newBook.coverImageUrl}
                onChange={(e) => setNewBook({ ...newBook, coverImageUrl: e.target.value })}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <input
                required
                placeholder="URL de descarga del eBook"
                value={newBook.downloadUrl}
                onChange={(e) => setNewBook({ ...newBook, downloadUrl: e.target.value })}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <textarea
                required
                rows={2}
                placeholder="Descripción"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="md:col-span-2 px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingId === 'new-book'}
                  className="px-5 py-2 rounded-xl bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800"
                >
                  {savingId === 'new-book' ? 'Guardando...' : 'Guardar eBook'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">eBook</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio (USD)</th>
                  <th className="px-4 py-3">Stock licencias</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-10 h-12 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{book.title}</p>
                          <p className="text-xs text-slate-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-600">{book.category}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={priceDrafts[book._id] ?? book.price}
                        onChange={(e) =>
                          setPriceDrafts((prev) => ({ ...prev, [book._id]: e.target.value }))
                        }
                        className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={stockDrafts[book._id] ?? book.stock}
                        onChange={(e) =>
                          setStockDrafts((prev) => ({ ...prev, [book._id]: e.target.value }))
                        }
                        className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateBook(book._id)}
                          disabled={savingId === book._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-700 text-white text-xs font-semibold hover:bg-navy-800 disabled:opacity-60"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Guardar
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book)}
                          disabled={savingId === book._id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Eliminar eBook"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
