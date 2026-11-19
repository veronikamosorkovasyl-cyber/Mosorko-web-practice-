import usePageTitle from '../hooks/usePageTitle.js';
import ContactForm from '../components/ContactForm.jsx';

export default function Contacts() {
  usePageTitle('Контакти та повернення квитків');
  return (
    <>
      <h1>Контакти</h1>

      <section aria-labelledby="hours-title">
        <h2 id="hours-title">Графік роботи контакт-центру</h2>
        <ul>
          <li>Понеділок–Четвер: 9:00–21:00</li>
          <li>П’ятниця–Неділя: 9:00–22:00</li>
        </ul>
        <address>
          Телефон: <a href="tel:+380000000000">+38 (000) 000-00-00</a><br />
          Email: <a href="mailto:info@cinema-ua.example">info@cinema-ua.example</a>
        </address>
      </section>

      <section id="ai-chat" aria-labelledby="ai-title">
        <h2 id="ai-title">Чат підтримка з ШІ</h2>
        <p>Швидкі відповіді на загальні питання про роботу кінотеатру, повітряні тривоги, бонуси та знижки. Якщо відповіді не знайдеться, до чату підключиться оператор.</p>
      </section>

      <section id="message" aria-labelledby="form-title">
        <h2 id="form-title">Напиши нам / повернення квитків</h2>
        <p>Якщо сеанс скасовано через повітряну тривогу чи інший форс-мажор, ми повернемо кошти, обміняємо квиток, нарахуємо бонуси або надамо промокод.</p>
        <ContactForm />
      </section>

      <section aria-labelledby="map-title">
        <h2 id="map-title">Як нас знайти</h2>
        <iframe title="Карта розташування кінотеатру в Івано-Франківську"
          src="https://www.openstreetmap.org/export/embed.html?bbox=24.69%2C48.90%2C24.75%2C48.94&layer=mapnik"
          width="600" height="400" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </section>
    </>
  );
}
