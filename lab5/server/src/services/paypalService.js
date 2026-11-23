import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

let cachedToken = null;
let tokenExpiresAt = 0;

export function getPaypalBaseUrl() {
  return env.paypalMode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

export function isPaypalConfigured() {
  const invalidPlaceholders = [
    '',
    'tu_paypal_sandbox_client_id',
    'tu_paypal_sandbox_client_secret'
  ];
  return (
    !invalidPlaceholders.includes((env.paypalClientId || '').trim()) &&
    !invalidPlaceholders.includes((env.paypalClientSecret || '').trim())
  );
}

function assertPaypalConfigured() {
  if (!isPaypalConfigured()) {
    throw new AppError(
      'Credenciales de PayPal Sandbox no configuradas. Agrega PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en server/.env.',
      503
    );
  }
}

export async function getPaypalAccessToken() {
  assertPaypalConfigured();

  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const credentials = Buffer.from(`${env.paypalClientId}:${env.paypalClientSecret}`).toString(
    'base64'
  );

  const response = await fetch(`${getPaypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new AppError(
      'No se pudo autenticar con PayPal Sandbox. Verifica PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET.',
      502,
      data
    );
  }

  const ttlMs = Math.max((Number(data.expires_in) || 300) - 60, 30) * 1000;
  cachedToken = data.access_token;
  tokenExpiresAt = now + ttlMs;

  return cachedToken;
}

export async function createPaypalOrder({ orderId, total, currency = env.paypalCurrency }) {
  const accessToken = await getPaypalAccessToken();
  const formattedTotal = Number(total).toFixed(2);

  const response = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `ebookstore-create-${orderId}`
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: String(orderId),
          custom_id: String(orderId),
          description: `Compra de eBooks en eBookStore (Pedido ${String(orderId).slice(-6)})`,
          amount: {
            currency_code: currency.toUpperCase(),
            value: formattedTotal
          }
        }
      ],
      application_context: {
        brand_name: 'eBookStore',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW'
      }
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id) {
    throw new AppError('Error creando la orden en PayPal Sandbox', 502, data);
  }

  return data;
}

export async function capturePaypalOrder(paypalOrderId) {
  const accessToken = await getPaypalAccessToken();

  const response = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `ebookstore-capture-${paypalOrderId}`
      }
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const issue = data?.details?.[0]?.issue;
    if (issue === 'ORDER_ALREADY_CAPTURED') {
      return getPaypalOrderDetails(paypalOrderId);
    }
    throw new AppError('Error capturando el pago en PayPal Sandbox', 502, data);
  }

  return data;
}

export async function getPaypalOrderDetails(paypalOrderId) {
  const accessToken = await getPaypalAccessToken();

  const response = await fetch(
    `${getPaypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AppError('Error consultando la orden en PayPal Sandbox', 502, data);
  }

  return data;
}
