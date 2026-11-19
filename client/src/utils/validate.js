export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^\+380\d{9}$/;

export function validateContact(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Вкажіть ім’я (мінімум 2 символи)';
  if (!EMAIL_RE.test(v.email)) e.email = 'Введіть коректний email';
  if (!PHONE_RE.test(v.phone)) e.phone = 'Формат: +380 і 9 цифр';
  if (!v.topic) e.topic = 'Оберіть тему';
  if (v.ticket && !/^\d{6,10}$/.test(v.ticket)) e.ticket = 'Від 6 до 10 цифр';
  if (v.message.trim().length < 10) e.message = 'Мінімум 10 символів';
  if (!v.agree) e.agree = 'Потрібна згода на обробку даних';
  return e;
}
