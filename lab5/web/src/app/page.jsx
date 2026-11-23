'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, BookOpen, RefreshCw, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import BookCard from '@/components/BookCard';

export default function CatalogPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category !== 'all') params.set('category', category);
      if (sort) params.set('sort', sort);
      if (inStockOnly) params.set('inStock', 'true');

      const data = await apiRequest(`/api/books?${params.toString()}`);
      setBooks(data.books || []);
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      setError(err.message || 'No se pudo cargar el catálogo de eBooks');
    } finally {
      setLoading(false);
    }
  }, [query, category, sort, inStockOnly]);

  useEffect(() => {
    const timer = setTimeout(fetchCatalog, 220);
    return () => clearTimeout(timer);
  }, [fetchCatalog]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white p-7 sm:p-10 shadow-md mb-8 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Entrega digital inmediata · Pago seguro con PayPal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Libros electrónicos técnicos para potenciar tu carrera
          </h1>
          <p className="text-slate-200 mt-3 text-sm sm:text-base leading-relaxed">
            Explora nuestro catálogo curado de eBooks en formato PDF y EPUB. Control de licencias en
            tiempo real, validación de pagos en servidor y seguimiento instantáneo de tus entregas.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, autor o temática (ej. Node.js, IA, Seguridad)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Ordenar catálogo"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-700"
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="title">Título (A-Z)</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-navy-700 focus:ring-navy-700"
              />
              <span>Solo con stock</span>
            </label>

            <button
              onClick={fetchCatalog}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="Actualizar catálogo"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              category === 'all'
                ? 'bg-navy-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas las categorías
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                category === cat
                  ? 'bg-navy-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Catalog Grid */}
      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 text-rose-800 text-sm mb-6">
          <p className="font-semibold">Error cargando el catálogo</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 h-96 animate-pulse p-4 space-y-3"
            >
              <div className="h-44 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">No se encontraron eBooks</h2>
          <p className="text-sm text-slate-500 mt-1">
            Prueba cambiando los filtros de búsqueda o seleccionando otra categoría.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
            <span>
              Mostrando <strong className="text-slate-900">{books.length}</strong>{' '}
              {books.length === 1 ? 'eBook' : 'eBooks'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
