export const GENRES = ['Бойовик','Комедія','Драма','Мультфільм','Трилер','Фантастика','Жахи','Мелодрама','Пригоди','Документальний'];

export const CINEMAS = {
  a: { name: 'Локація А', address: 'вул. Приклад, 1' },
  b: { name: 'Локація Б', address: 'вул. Приклад, 2' },
  c: { name: 'Локація В', address: 'вул. Приклад, 3' },
};

export const DEFAULT_HALL = {
  rows: 7,
  seatsPerRow: 11,
  vipRows: [7],
  prices: { standard: 220, vip: 550 },
  taken: [],
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+380\d{9}$/;

export function validateItem(body = {}) {
  const errors = {};
  const filmTitle = String(body.filmTitle ?? '').trim();
  const date = String(body.date ?? '');
  const start = String(body.start ?? '');
  const end = String(body.end ?? '');
  const poster = String(body.poster ?? '1');

  if (filmTitle.length < 2 || filmTitle.length > 100) errors.filmTitle = 'Назва: від 2 до 100 символів';
  if (!GENRES.includes(body.genre)) errors.genre = 'Невідомий жанр';
  if (!Object.hasOwn(CINEMAS, body.cinema)) errors.cinema = 'Кінотеатр: a, b або c';
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) errors.date = 'Дата у форматі РРРР-ММ-ДД';
  if (!TIME_RE.test(start)) errors.start = 'Час початку у форматі ГГ:ХХ';
  if (!TIME_RE.test(end)) errors.end = 'Час завершення у форматі ГГ:ХХ';
  if (!errors.start && !errors.end && end <= start) errors.end = 'Завершення має бути пізніше за початок';
  if (!/^\d{1,2}$/.test(poster)) errors.poster = 'Номер постера: 1–2 цифри';

  if (Object.keys(errors).length) return { errors };

  const cinema = CINEMAS[body.cinema];
  const dateLabel = new Date(`${date}T00:00:00`)
    .toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    .replace(' р.', '');

  return {
    errors,
    value: {
      filmTitle, genre: body.genre, cinema: body.cinema,
      cinemaName: cinema.name, address: cinema.address,
      date, dateLabel, start, end, poster,
    },
  };
}

export function validateContact(v = {}) {
  const e = {};
  if (String(v.name ?? '').trim().length < 2) e.name = 'Вкажіть ім’я (мінімум 2 символи)';
  if (!EMAIL_RE.test(v.email ?? '')) e.email = 'Введіть коректний email';
  if (!PHONE_RE.test(v.phone ?? '')) e.phone = 'Формат: +380 і 9 цифр';
  if (!['refund', 'exchange', 'bonus', 'other'].includes(v.topic)) e.topic = 'Оберіть тему';
  if (v.ticket && !/^\d{6,10}$/.test(v.ticket)) e.ticket = 'Від 6 до 10 цифр';
  if (String(v.message ?? '').trim().length < 10) e.message = 'Мінімум 10 символів';
  if (v.agree !== true) e.agree = 'Потрібна згода на обробку даних';
  return e;
}
