'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'ebookstore_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignorar carrito corrupto
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Ignorar errores de cuota
    }
  }, [items, hydrated]);

  const addItem = useCallback((book, quantity = 1) => {
    if (!book?._id || book.stock <= 0) return { ok: false, reason: 'Sin stock disponible' };
    let status = { ok: true };

    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === book._id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, book.stock);
        if (nextQty === existing.quantity) {
          status = { ok: false, reason: `Máximo stock disponible (${book.stock})` };
          return prev;
        }
        return prev.map((i) =>
          i.bookId === book._id ? { ...i, quantity: nextQty, stock: book.stock, price: book.price } : i
        );
      }
      return [
        ...prev,
        {
          bookId: book._id,
          title: book.title,
          author: book.author,
          price: Number(book.price),
          stock: Number(book.stock),
          coverImageUrl: book.coverImageUrl,
          format: book.format || 'PDF / EPUB',
          quantity: Math.min(quantity, book.stock)
        }
      ];
    });

    return status;
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.bookId !== bookId) return item;
          const clamped = Math.max(0, Math.min(quantity, item.stock || 99));
          return { ...item, quantity: clamped };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((bookId) => {
    setItems((prev) => prev.filter((item) => item.bookId !== bookId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => Number(items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        hydrated,
        addItem,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
