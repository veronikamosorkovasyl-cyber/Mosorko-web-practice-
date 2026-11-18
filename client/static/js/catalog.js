/** Афіша: динамічні картки, стани loading/error/empty, пошук, фільтри, сортування. */
import { getData } from './api.js';
import { debounce, escapeHtml } from './utils.js';

const grid = document.querySelector('#film-grid');
const status = document.querySelector('#film-status');
const counter = document.querySelector('#results-count');
const limit = Number(grid?.dataset.limit) || Infinity; // на головній — лише кілька афіш
const isCatalog = grid && !grid.dataset.limit;

let data = null;

if (grid) init();

async function init() {
  showLoading();
  try {
    data = await getData();
  } catch (err) {
    showError(err);
    return;
  }
  fillGenres();
  if (isCatalog) {
    restoreFromUrl();
    bindControls();
  }
  render();
}

/* Стани -------------------------------------------------------------------- */
function showLoading() {
  grid.innerHTML = '';
  status.innerHTML = '<p class="state" role="status">Завантаження афіші…</p>';
}

function showError(err) {
  grid.innerHTML = '';
  if (counter) counter.textContent = '';
  status.innerHTML = `
    <div class="state state--error" role="alert">
      <p>Не вдалося завантажити афішу. ${escapeHtml(err.message)}</p>
      <button class="btn" type="button" data-action="retry">Спробувати ще раз</button>
    </div>`;
}

function showEmpty() {
  status.innerHTML = `
    <div class="state" role="status">
      <p>За вашим запитом фільмів не знайдено.</p>
      <button class="btn btn--secondary" type="button" data-action="reset">Скинути фільтри</button>
    </div>`;
}

/* Рендер ------------------------------------------------------------------- */
function cardHtml(film) {
  const title = escapeHtml(film.title);
  const base = escapeHtml(film.poster);
  return `
    <li>
      <article class="film-card" data-href="session.html?film=${film.id}">
        <figure>
          <picture>
            <source type="image/webp" srcset="${base}.webp 400w, ${base.replace('-400', '-800')}.webp 800w" sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw">
            <img src="${base}.jpg" alt="Постер фільму «${title}»" width="400" height="600" loading="lazy" decoding="async">
          </picture>
          <figcaption class="visually-hidden">Постер: ${title}</figcaption>
        </figure>
        <h3>${title}</h3>
        <p class="film-card__genre">${escapeHtml(film.genre)}</p>
        <a class="btn" href="session.html?film=${film.id}" aria-label="Купити квиток на фільм «${title}»">Купити квиток</a>
      </article>
    </li>`;
}

function render() {
  const films = isCatalog ? applyFilters() : data.films;
  const shown = films.slice(0, limit);
  grid.innerHTML = shown.map(cardHtml).join('');
  if (counter) counter.textContent = `Знайдено фільмів: ${films.length}`;
  if (shown.length) status.innerHTML = '';
  else showEmpty();
}

/* Фільтрація та сортування ------------------------------------------------- */
const el = {
  q: () => document.querySelector('#q'),
  cinema: () => document.querySelector('#cinema'),
  genre: () => document.querySelector('#genre'),
  date: () => document.querySelector('#date'),
  sort: () => document.querySelector('#sort'),
};

function readState() {
  return {
    q: el.q()?.value.trim().toLowerCase() ?? '',
    cinema: el.cinema()?.value ?? '',
    genre: el.genre()?.value ?? '',
    date: el.date()?.value ?? '',
    sort: el.sort()?.value ?? 'default',
  };
}

function applyFilters() {
  const { q, cinema, genre, date, sort } = readState();

  const list = data.films.filter((film) => {
    if (q && !film.title.toLowerCase().includes(q) && !film.genre.toLowerCase().includes(q)) return false;
    if (genre && film.genre !== genre) return false;
    if (cinema || date) {
      const hasSession = film.sessions.some(
        (s) => (!cinema || s.cinema === cinema) && (!date || s.date === date),
      );
      if (!hasSession) return false;
    }
    return true;
  });

  const firstDate = (f) => f.sessions.map((s) => s.date).sort()[0];
  const sorters = {
    title: (a, b) => a.title.localeCompare(b.title, 'uk', { numeric: true }),
    genre: (a, b) => a.genre.localeCompare(b.genre, 'uk'),
    date: (a, b) => firstDate(a).localeCompare(firstDate(b)),
  };
  if (sorters[sort]) list.sort(sorters[sort]);
  return list;
}

function fillGenres() {
  const select = el.genre();
  if (!select) return;
  const current = select.value;
  select.innerHTML = '<option value="">Усі жанри</option>' +
    data.genres.map((g) => `<option>${escapeHtml(g)}</option>`).join('');
  select.value = current;
}

/* Синхронізація з адресою (?q=&cinema=&genre=&date=&sort=) ------------------- */
function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  for (const key of Object.keys(el)) {
    const field = el[key]();
    if (field && params.has(key)) field.value = params.get(key);
  }
}

function syncUrl() {
  const params = new URLSearchParams();
  const state = readState();
  for (const [key, value] of Object.entries(state)) {
    if (value && value !== 'default') params.set(key, key === 'q' ? el.q().value.trim() : value);
  }
  const query = params.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
}

function update() {
  syncUrl();
  render();
}

function bindControls() {
  const debouncedUpdate = debounce(update, 300);

  // Пошук: debounce 300 мс на кожен символ
  el.q()?.addEventListener('input', debouncedUpdate);
  el.q()?.form?.addEventListener('submit', (e) => { e.preventDefault(); update(); });

  // Фільтри — одразу при зміні; кнопка «Показати» теж не перезавантажує сторінку
  const filtersForm = document.querySelector('form.filters');
  filtersForm?.addEventListener('change', update);
  filtersForm?.addEventListener('submit', (e) => { e.preventDefault(); update(); });
}

/* Делегування подій -------------------------------------------------------- */
// Клік по будь-якому місцю картки веде на сторінку сеансу; одна підписка на весь список.
grid?.addEventListener('click', (e) => {
  if (e.target.closest('a')) return; // посилання працює само
  const card = e.target.closest('.film-card');
  if (card) location.href = card.dataset.href;
});

status?.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'retry') init();
  if (action === 'reset') {
    document.querySelector('form.filters')?.reset();
    if (el.q()) el.q().value = '';
    update();
  }
});
