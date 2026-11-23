'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SocketProvider } from '@/context/SocketContext';
import Navbar from '@/components/Navbar';
import ToastFeed from '@/components/ToastFeed';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <SocketProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-200 bg-white mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
                <p>eBookStore — Plataforma Full-Stack de Libros Electrónicos</p>
                <p>Next.js · Express · MongoDB Atlas · PayPal Sandbox · Socket.IO</p>
              </div>
            </footer>
          </div>
          <ToastFeed />
        </SocketProvider>
      </CartProvider>
    </AuthProvider>
  );
}
