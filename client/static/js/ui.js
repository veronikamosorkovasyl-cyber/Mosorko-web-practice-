/** Спільний UI на всіх сторінках: бургер-меню, перемикач теми, модальні вікна. */
import './utils.js';

const root = document.documentElement;
root.classList.add('js');

/* 1. Бургер-меню ---------------------------------------------------------- */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-header nav');

function setMenu(open) {
  toggle?.setAttribute('aria-expanded', String(open));
}

toggle?.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

// Делегування: один обробник на весь список посилань
document.querySelector('#nav-list')?.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});

document.addEventListener('click', (e) => {
  if (nav && !nav.contains(e.target)) setMenu(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

/* 2. Перемикач теми (збереження в localStorage) --------------------------- */
const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
if (saved) root.dataset.theme = saved; // null → працює системна тема

const themeBtn = document.querySelector('.theme-toggle');

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeBtn?.setAttribute('aria-pressed', String(theme === 'dark'));
  try { localStorage.setItem('theme', theme); } catch { /* приватний режим */ }
}

themeBtn?.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
themeBtn?.addEventListener('click', () => {
  applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

/* 3. Модальне вікно на <dialog> ------------------------------------------- */
// Esc закриває браузер сам; клік по підкладці (::backdrop) обробляємо вручну.
export function openModal(dialog) {
  if (dialog && !dialog.open) dialog.showModal();
}

document.querySelectorAll('dialog.modal').forEach((dialog) => {
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close(); // клік поза вмістом
  });
});

document.addEventListener('click', (e) => {
  e.target.closest('[data-close]')?.closest('dialog')?.close();
});
