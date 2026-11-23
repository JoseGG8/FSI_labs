'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function AuthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'login') {
        const res = await login({ email, password });
        if (res.user?.role === 'administrador' && redirectTo === '/') {
          router.push('/admin');
        } else {
          router.push(redirectTo);
        }
      } else {
        await register({ name, email, password });
        router.push(redirectTo);
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error en la autenticación');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setMode('login');
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 sm:p-8">
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              mode === 'register' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Crear cuenta
          </button>
        </div>

        <h1 className="text-2xl font-extrabold text-navy-900">
          {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta de lector'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {mode === 'login'
            ? 'Accede a tu biblioteca digital, pedidos y seguimiento en tiempo real.'
            : 'Regístrate para comprar eBooks y descargarlos de forma segura.'}
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-navy-700 text-white font-semibold text-sm hover:bg-navy-800 transition-colors disabled:opacity-60"
          >
            <span>
              {submitting
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Ingresar a eBookStore'
                  : 'Registrar cuenta'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo credentials helper for laboratory testing */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Acceso rápido de pruebas (seed)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('cliente@ebookstore.com', 'Cliente123!')}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              <span className="block font-bold text-navy-800">Cliente Demo</span>
              <span className="text-[11px] text-slate-500">cliente@ebookstore.com</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@ebookstore.com', 'Admin123!')}
              className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/50 text-xs font-medium text-slate-700 hover:bg-amber-50 text-left"
            >
              <span className="block font-bold text-amber-800">Administrador</span>
              <span className="text-[11px] text-slate-500">admin@ebookstore.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-12 text-center text-sm text-slate-500">
          Cargando autenticación...
        </div>
      }
    >
      <AuthFormContent />
    </Suspense>
  );
}
