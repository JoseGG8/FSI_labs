'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'ebookstore_token';
const USER_KEY = 'ebookstore_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (typeof window !== 'undefined') {
      if (nextToken && nextUser) {
        localStorage.setItem(TOKEN_KEY, nextToken);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
        if (!storedToken) {
          if (active) setLoading(false);
          return;
        }

        const data = await apiRequest('/api/auth/me', { token: storedToken });
        if (active && data?.user) {
          persistSession(storedToken, data.user);
        }
      } catch {
        if (active) persistSession(null, null);
      } finally {
        if (active) setLoading(false);
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, [persistSession]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession]
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      });
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    persistSession(null, null);
  }, [persistSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        isAdmin: user?.role === 'administrador',
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
