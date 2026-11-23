'use client';

import { useState } from 'react';
import { ShoppingCart, Check, BookText, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function BookCard({ book }) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState(null);

  const outOfStock = book.stock <= 0;
  const lowStock = book.stock > 0 && book.stock <= 5;

  const handleAdd = () => {
    const result = addItem(book, 1);
    if (result.ok) {
      setFeedback({ type: 'ok', text: 'Agregado' });
    } else {
      setFeedback({ type: 'warn', text: result.reason });
    }
    setTimeout(() => setFeedback(null), 1800);
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-navy-900/85 text-white backdrop-blur-sm">
          {book.category}
        </span>
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
            outOfStock
              ? 'bg-rose-600 text-white'
              : lowStock
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
          }`}
        >
          {outOfStock ? 'Agotado' : lowStock ? `Últimas ${book.stock}` : `Stock: ${book.stock}`}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <BookText className="w-3.5 h-3.5 text-amber-600" />
          <span>{book.format || 'PDF / EPUB'}</span>
          {book.pages ? <span>· {book.pages} págs.</span> : null}
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-navy-700 font-medium mt-1">{book.author}</p>
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 flex-1">{book.description}</p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block">Licencia digital</span>
            <span className="text-xl font-extrabold text-navy-900">
              {formatCurrency(book.price)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              outOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : feedback?.type === 'ok'
                  ? 'bg-emerald-600 text-white'
                  : feedback?.type === 'warn'
                    ? 'bg-amber-600 text-white'
                    : 'bg-navy-700 text-white hover:bg-navy-800'
            }`}
          >
            {feedback?.type === 'ok' ? (
              <>
                <Check className="w-4 h-4" />
                <span>{feedback.text}</span>
              </>
            ) : feedback?.type === 'warn' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Tope</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{outOfStock ? 'Sin stock' : 'Agregar'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
