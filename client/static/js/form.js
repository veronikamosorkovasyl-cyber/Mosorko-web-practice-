/** Валідація форми звернення: на input/blur та submit, aria-describedby, блокування кнопки. */
import { postContact } from './api.js';

const form = document.querySelector('#return');
if (form) initForm(form);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+380\d{9}$/;
const TICKET_RE = /^\d{6,10}$/;

// Правило повертає текст помилки або '' якщо поле коректне
const rules = {
  name: (el) => {
    const v = el.value.trim();
    if (!v) return "Вкажіть ім'я";
    if (v.length < 2) return "Ім'я має містити щонайменше 2 символи";
    return '';
  },
  email: (el) => {
    const v = el.value.trim();
    if (!v) return 'Вкажіть email';
    return EMAIL_RE.test(v) ? '' : 'Введіть email у форматі name@example.com';
  },
  phone: (el) => {
    const v = el.value.trim();
    if (!v) return 'Вкажіть телефон';
    return PHONE_RE.test(v) ? '' : 'Телефон у форматі +380 і 9 цифр, наприклад +380501234567';
  },
  topic: (el) => (el.value ? '' : 'Оберіть тему звернення'),
  ticket: (el) => {
    const v = el.value.trim();
    if (!v) return ''; // необов'язкове
    return TICKET_RE.test(v) ? '' : 'Номер квитка — від 6 до 10 цифр';
  },
  message: (el) => {
    const v = el.value.trim();
    if (!v) return 'Напишіть повідомлення';
    return v.length < 10 ? `Ще ${10 - v.length} симв. до мінімуму (10)` : '';
  },
  agree: (el) => (el.checked ? '' : 'Потрібна згода на обробку персональних даних'),
};

function initForm(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#form-status');
  const fields = [...form.elements].filter((el) => rules[el.name]);
  const touched = new Set();

  // Для кожного поля створюємо контейнер помилки й прив'язуємо через aria-describedby
  for (const el of fields) {
    const error = document.createElement('span');
    error.className = 'field-error';
    error.id = `${el.id}-error`;
    error.hidden = true;
    // Помилка йде після підказки (якщо вона є), інакше — одразу після поля
    const hint = el.getAttribute('aria-describedby') && form.querySelector(`#${el.getAttribute('aria-describedby')}`);
    (hint ?? el).insertAdjacentElement('afterend', error);
    el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
  }

  function messageOf(el) {
    return rules[el.name](el);
  }

  function showError(el) {
    const msg = messageOf(el);
    const error = form.querySelector(`#${el.id}-error`);
    error.textContent = msg;
    error.hidden = !msg;
    el.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  function isFormValid() {
    return fields.every((el) => !messageOf(el)); // тихо, без показу помилок
  }

  function refreshButton() {
    const valid = isFormValid();
    submitBtn.disabled = !valid;
    submitBtn.setAttribute('aria-disabled', String(!valid));
  }

  function touch(el) {
    touched.add(el);
    showError(el);
    refreshButton();
  }

  // Перевірка під час введення. Помилку показуємо тільки після першої взаємодії з полем.
  form.addEventListener('input', (e) => {
    if (!fields.includes(e.target)) return;
    if (touched.has(e.target) || e.target.type === 'checkbox') touch(e.target);
    else refreshButton();
    status.textContent = '';
  });
  form.addEventListener('change', (e) => { if (fields.includes(e.target)) touch(e.target); });
  form.addEventListener('focusout', (e) => { if (fields.includes(e.target)) touch(e.target); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid = null;
    for (const el of fields) {
      touched.add(el);
      if (!showError(el) && !firstInvalid) firstInvalid = el;
    }
    refreshButton();
    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = 'Перевірте форму: є поля з помилками.';
      status.className = 'form-status form-status--error';
      return;
    }

    const payload = Object.fromEntries(
      fields.map((el) => [el.name, el.type === 'checkbox' ? el.checked : el.value.trim()]),
    );

    submitBtn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Надсилаємо…';
    try {
      await postContact(payload);
      form.reset();
      touched.clear();
      for (const el of fields) showError(el);
      status.className = 'form-status form-status--ok';
      status.textContent = 'Дякуємо! Ваше звернення прийнято, ми відповімо протягом робочого дня.';
    } catch (err) {
      status.className = 'form-status form-status--error';
      status.textContent = `Не вдалося надіслати: ${err.message}`;
    } finally {
      refreshButton();
    }
  });

  refreshButton();
}
