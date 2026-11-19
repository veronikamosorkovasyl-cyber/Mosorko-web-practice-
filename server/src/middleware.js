export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// 1) логування запитів
export function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
}

// 2) невідомий маршрут
export function notFound(req, res) {
  res.status(404).json({ message: `Маршрут ${req.method} ${req.originalUrl} не знайдено` });
}

// 3) централізована обробка помилок (4 аргументи — обов’язково)
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Некоректний JSON у тілі запиту' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    message: status === 500 ? 'Внутрішня помилка сервера' : err.message,
    ...(err.errors && { errors: err.errors }),
  });
}

export function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new HttpError(500, 'ADMIN_TOKEN не налаштовано на сервері');
  if (req.get('x-admin-token') !== token) throw new HttpError(401, 'Потрібен токен адміністратора');
  next();
}
