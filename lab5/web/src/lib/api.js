function normalizeBaseUrl(raw, fallback) {
  const trimmed = (raw || '').trim().replace(/\/$/, '');
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const protocol = /^localhost(:\d+)?$/i.test(trimmed) ? 'http://' : 'https://';
  return `${protocol}${trimmed}`;
}

export const API_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:4000'
);

export const SOCKET_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_SOCKET_URL,
  API_URL
);

export const PAYPAL_CLIENT_ID = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').trim();

export async function apiRequest(path, { method = 'GET', body, token, headers = {} } = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store'
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const details = Array.isArray(data.details) ? ` (${data.details.join(', ')})` : '';
    const err = new Error((data.message || `Error HTTP ${response.status}`) + details);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(amount || 0));
}

export function formatDate(isoDate) {
  if (!isoDate) return '-';
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(isoDate));
}
