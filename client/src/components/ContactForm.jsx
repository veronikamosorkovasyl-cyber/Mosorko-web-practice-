import { useState } from 'react';
import { validateContact } from '../utils/validate.js';
import { api } from '../api.js';
import Field from './Field.jsx';

const EMPTY = { name: '', email: '', phone: '', topic: '', ticket: '', message: '', agree: false };


export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

  const change = (e) => {
    const { name, type, value, checked } = e.target;
    const next = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(next);
    if (Object.keys(errors).length) setErrors(validateContact(next)); // живе оновлення після першої спроби
  };

const submit = async (e) => {
  e.preventDefault();
  const errs = validateContact(values);
  setErrors(errs);
  if (Object.keys(errs).length) return;

  setStatus('sending');
  try {
    await api.sendContact(values);
    setStatus('sent');
    setValues(EMPTY);
  } catch (err) {
    if (err.errors) setErrors(err.errors); // помилки з сервера (код 400)
    setStatus('error');
  }
};

  return (
    <form id="return" onSubmit={submit} noValidate>
      <fieldset>
        <legend>Ваші дані</legend>
        <Field id="name" label="Ім’я *" value={values.name} onChange={change} error={errors.name}
               autoComplete="name" placeholder="Іван Петренко" />
        <Field id="email" label="Email *" type="email" value={values.email} onChange={change}
               error={errors.email} autoComplete="email" placeholder="name@example.com" />
        <Field id="phone" label="Телефон *" type="tel" value={values.phone} onChange={change}
               error={errors.phone} hint="Формат: +380 і 9 цифр" autoComplete="tel" placeholder="+380XXXXXXXXX" />
      </fieldset>

      <fieldset>
        <legend>Звернення</legend>
        <Field id="topic" label="Тема *" as="select" value={values.topic} onChange={change} error={errors.topic}>
          <option value="">— Оберіть тему —</option>
          <option value="refund">Повернення коштів</option>
          <option value="exchange">Обмін квитка</option>
          <option value="bonus">Бонуси / промокод</option>
          <option value="other">Інше питання</option>
        </Field>
        <Field id="ticket" label="Номер квитка" value={values.ticket} onChange={change}
               error={errors.ticket} inputMode="numeric" placeholder="123456" />
        <Field id="message" label="Повідомлення *" as="textarea" rows={5} value={values.message}
               onChange={change} error={errors.message} />
      </fieldset>

      <p>
        <input id="agree" name="agree" type="checkbox" checked={values.agree} onChange={change}
               aria-invalid={!!errors.agree} />
        <label htmlFor="agree">Погоджуюсь на обробку персональних даних</label>
      </p>
      {errors.agree && <small role="alert" style={{ color: 'var(--color-error)' }}>{errors.agree}</small>}

      <button className="btn" type="submit" disabled={status === 'sending'}>
      {status === 'sending' ? 'Надсилаємо…' : 'Надіслати'}
    </button>
    {status === 'sent' && <p role="status">Дякуємо! Ми отримали ваше звернення.</p>}
    {status === 'error' && <p role="alert">Не вдалося надіслати. Перевірте поля й спробуйте ще раз.</p>}
    </form>
  );
}
