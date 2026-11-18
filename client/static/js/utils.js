/** Спільні допоміжні функції. */

/** Відкладає виклик fn, доки не мине delay мс без нових викликів. */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Екранує HTML, щоб дані з API не могли внести розмітку на сторінку. */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

/** '2026-11-20' → '20 листопада 2026 р.' */
export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
