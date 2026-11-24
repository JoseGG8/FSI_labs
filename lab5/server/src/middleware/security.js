function sanitizeObject(value) {
  if (!value || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  const cleaned = {};
  for (const [key, val] of Object.entries(value)) {
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleaned[key] = sanitizeObject(val);
  }
  return cleaned;
}

// Mitigación de NoSQL Injection (elimina operadores MongoDB como $ne, $gt, etc.)
export function sanitizeNoSql(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  next();
}

// Rate limiter en memoria por IP (ventana fija con limpieza periódica)
export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 100, message } = {}) {
  const hits = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, Math.min(windowMs, 5 * 60 * 1000));
  if (cleanup.unref) cleanup.unref();

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(ip);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(ip, entry);
    }

    entry.count += 1;
    const remaining = Math.max(max - entry.count, 0);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    if (entry.count > max) {
      return res.status(429).json({
        ok: false,
        message: message || 'Demasiadas solicitudes desde esta IP. Intenta nuevamente más tarde.'
      });
    }

    return next();
  };
}
