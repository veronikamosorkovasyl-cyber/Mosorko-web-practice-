/** Сторінка сеансу: дані сеансу з API, вибір місць на схемі, підсумок, модальне підтвердження. */
import { getSession } from './api.js';
import { openModal } from './ui.js';
import { escapeHtml, formatDate } from './utils.js';

const form = document.querySelector('#seat-form');
if (form) init();

const MAX_SEATS = 6;

async function init() {
  const hall = form.querySelector('.hall');
  const info = document.querySelector('.session-info');
  const note = form.querySelector('#seat-note');
  const listEl = form.querySelector('#selected-list');
  const countEl = form.querySelector('#ticket-count');
  const totalEl = form.querySelector('#ticket-total');
  const submitBtn = form.querySelector('.summary .btn');
  const seatInputs = () => [...form.querySelectorAll('input[name="seat"]')];

  const modal = document.querySelector('#confirm-modal');
  const modalList = modal.querySelector('#modal-list');
  const modalTotal = modal.querySelector('#modal-total');
  const modalText = modal.querySelector('#modal-text');
  const confirmBtn = modal.querySelector('#confirm-btn');

  await loadSession();
  update();

  /* Дані сеансу з films.json ------------------------------------------------ */
  async function loadSession() {
    const params = new URLSearchParams(location.search);
    try {
      const { data, film, session } = await getSession(params.get('film') ?? 1, params.get('session'));
      if (!film) throw new Error('Сеанс не знайдено');
      const cinema = data.cinemas[session.cinema];

      info.innerHTML = `
        <strong>${escapeHtml(film.title)}</strong>,
        <time datetime="${session.date}">${formatDate(session.date)}</time>,
        <time datetime="${session.start}">${session.start}</time>–<time datetime="${session.end}">${session.end}</time>,
        ${escapeHtml(cinema.name)}, ${escapeHtml(film.genre)}`;
      form.querySelector('.summary__place').textContent = `${cinema.name}, ${cinema.address}`;
      document.title = `Вибір місця — ${film.title} — Cinema-Ua`;

      const taken = new Set(session.taken);
      for (const input of seatInputs()) {
        const isTaken = taken.has(input.value);
        input.disabled = isTaken;
        input.checked = false;
        const [row, seat] = input.value.split('-');
        input.nextElementSibling.querySelector('.visually-hidden').textContent =
          `Ряд ${row}, місце ${seat}, ${input.dataset.price} грн${isTaken ? ', зайняте' : ''}`;
      }
    } catch (err) {
      info.innerHTML = `<span role="alert">Не вдалося завантажити сеанс: ${escapeHtml(err.message)}</span>`;
      seatInputs().forEach((i) => { i.disabled = true; });
    }
  }

  /* Підсумок --------------------------------------------------------------- */
  function selectedSeats() {
    return seatInputs()
      .filter((i) => i.checked)
      .map((i) => {
        const [row, seat] = i.value.split('-').map(Number);
        return { row, seat, price: Number(i.dataset.price), vip: i.closest('.hall-row--vip') !== null };
      })
      .sort((a, b) => a.row - b.row || a.seat - b.seat);
  }

  const seatLabel = (s) => `Ряд ${s.row}, місце ${s.seat}${s.vip ? ' (VIP)' : ''}`;

  function update() {
    const seats = selectedSeats();
    const total = seats.reduce((sum, s) => sum + s.price, 0);

    listEl.innerHTML = seats.length
      ? seats.map((s) => `<li><span>${seatLabel(s)}</span><span>${s.price} грн</span></li>`).join('')
      : '<li class="summary__empty">Обрані місця будуть тут</li>';
    countEl.textContent = seats.length;
    totalEl.textContent = total;
    submitBtn.disabled = seats.length === 0;
  }

  /* Делегування: один обробник change на всю схему залу --------------------- */
  hall.addEventListener('change', (e) => {
    const input = e.target.closest('input[name="seat"]');
    if (!input) return;
    if (input.checked && selectedSeats().length > MAX_SEATS) {
      input.checked = false;
      note.textContent = `За одне замовлення можна обрати не більше ${MAX_SEATS} місць.`;
    } else {
      note.textContent = '';
    }
    update();
  });

  /* Модальне підтвердження ------------------------------------------------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const seats = selectedSeats();
    if (!seats.length) return;
    modalList.innerHTML = seats.map((s) => `<li><span>${seatLabel(s)}</span><span>${s.price} грн</span></li>`).join('');
    modalTotal.textContent = seats.reduce((sum, s) => sum + s.price, 0);
    modalText.textContent = 'Перевірте обрані місця та підтвердіть замовлення.';
    confirmBtn.hidden = false;
    openModal(modal);
  });

  confirmBtn.addEventListener('click', () => {
    // Демо: «бронюємо» — обрані місця стають зайнятими
    for (const input of seatInputs().filter((i) => i.checked)) {
      input.checked = false;
      input.disabled = true;
    }
    update();
    modalText.textContent = 'Дякуємо! Місця заброньовано (навчальний проєкт, оплата не виконується).';
    confirmBtn.hidden = true;
  });
}
