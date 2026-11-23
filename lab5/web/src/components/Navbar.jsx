'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ShoppingCart, Package, ShieldCheck, LogOut, User, Radio } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSocket } from '@/context/SocketContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { connected } = useSocket();

  const linkClass = (href) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === href
        ? 'bg-navy-700 text-white'
        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-800'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-navy-700 text-white flex items-center justify-center shadow-sm group-hover:bg-navy-800 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-navy-900">eBookStore</span>
            <span className="hidden sm:block text-[11px] text-slate-500 -mt-1">
              Biblioteca Digital
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/" className={linkClass('/')}>
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Catálogo</span>
          </Link>

          <Link href="/pedidos" className={linkClass('/pedidos')}>
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Mis Libros</span>
          </Link>

          {isAdmin && (
            <Link href="/admin" className={linkClass('/admin')}>
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          <Link href="/carrito" className={`${linkClass('/carrito')} relative`}>
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {itemCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-amber-500 text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && (
            <span
              title={connected ? 'Conectado en tiempo real (Socket.IO)' : 'Reconectando WebSocket...'}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                connected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${connected ? 'animate-pulse text-emerald-600' : ''}`} />
              {connected ? 'En vivo' : 'Offline'}
            </span>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col items-end leading-tight">
                <span className="text-xs font-semibold text-slate-800">{user.name}</span>
                <span className="text-[11px] uppercase tracking-wide text-amber-700 font-medium">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Ingresar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
