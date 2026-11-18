/** Робота з даними: fetch + async/await. */

const DATA_URL = new URL('../data/films.json', import.meta.url);

// У ПР 8 змінити на false і вказати адресу сервера (VITE_API_URL у React-версії).
const USE_MOCK = true;
const API_URL = '/api';

let cache = null;

/** Завантажує афішу (фільми, сеанси, кінотеатри). Кидає помилку, якщо відповідь не ok. */
export async function getData({ signal } = {}) {
  if (cache) return cache;
  const response = await fetch(DATA_URL, { signal });
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити афішу (HTTP ${response.status})`);
  }
  cache = await response.json();
  return cache;
}

/** Фільм і сеанс за параметрами ?film=&session= (за замовчуванням — перший сеанс). */
export async function getSession(filmId, sessionId) {
  const data = await getData();
  const film = data.films.find((f) => String(f.id) === String(filmId));
  if (!film) return { data, film: null, session: null };
  const session = film.sessions.find((s) => s.id === sessionId) ?? film.sessions[0];
  return { data, film, session };
}

/** Надсилає форму звернення. Поки немає сервера (ПР 8) — імітація відповіді. */
export async function postContact(payload) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { id: Date.now(), ...payload };
  }
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.errors?.join('; ') || `Помилка сервера (HTTP ${response.status})`);
  }
  return body;
}
