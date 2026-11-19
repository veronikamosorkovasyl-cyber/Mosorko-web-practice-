import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api.js';
import { toFilm } from '../utils/toFilm.js';
import useFetch from '../hooks/useFetch.js';
import usePageTitle from '../hooks/usePageTitle.js';
import Filters from '../components/Filters.jsx';
import FilmGrid from '../components/FilmGrid.jsx';
import Button from '../components/Button.jsx';

export default function Home() {
  usePageTitle('Афіша кіно та квитки онлайн з вибором місця');
  const navigate = useNavigate();
    const { data: items, loading, error } = useFetch(`${API_URL}/api/items`);
    const films = items?.map(toFilm);

  const apply = (v) => {
    const p = new URLSearchParams(Object.entries(v).filter(([, val]) => val));
    navigate(`/catalog?${p}`);
  };

  return (
    <>
      <section className="hero" aria-labelledby="page-title">
        <h1 id="page-title">Cinema-Ua: квитки в кіно онлайн</h1>
        <p>Обери фільм, сеанс і місце в залі на зручній схемі.</p>
        <Filters onApply={apply} />
      </section>

      <section aria-labelledby="now-playing">
        <h2 id="now-playing">Вже в кіно</h2>
        {loading && <p>Завантаження…</p>}
        {error && <p role="alert">Не вдалося завантажити афішу ({error}).</p>}
        {films && <FilmGrid films={films.slice(0, 5)} />}
        <p><Button to="/catalog" variant="secondary">Всі фільми</Button></p>
      </section>

      <section aria-labelledby="faq-title">
        <h2 id="faq-title">Маєш запитання?</h2>
        <p>Ми вже підготували відповіді на найпопулярніші з них. Зазирни сюди, щоб не чекати на оператора.</p>
        <div className="info-grid">
          <article>
            <h3>Чат підтримка з ШІ</h3>
            <p>Швидкі відповіді на загальні питання про роботу кінотеатру, повітряні тривоги, бонуси, знижки тощо. Якщо відповіді не знайдеться, до чату підключиться оператор контакт-центру.</p>
            <Button to="/contacts#ai-chat">Запитай</Button>
          </article>
          <article>
            <h3>Повернення квитків</h3>
            <p>Якщо сеанс скасовано через повітряну тривогу чи інший форс-мажор, не хвилюйся. Ми повернемо кошти, обміняємо квиток, нарахуємо бонуси або надамо промокод.</p>
            <Button to="/contacts#return">Заповни форму</Button>
          </article>
          <article>
            <h3>Напиши нам</h3>
            <p>Графік роботи:</p>
            <ul>
              <li>Понеділок–Четвер: 9:00–21:00</li>
              <li>П’ятниця–Неділя: 9:00–22:00</li>
            </ul>
            <Button to="/contacts#message">Написати</Button>
          </article>
          <article>
            <h3>Потелефонуй нам</h3>
            <p>Графік роботи контакт-центру:</p>
            <ul>
              <li>Понеділок–Четвер: 9:00–21:00</li>
              <li>П’ятниця–Неділя: 9:00–22:00</li>
            </ul>
            <a className="btn" href="tel:+380000000000">Зателефонувати</a>
          </article>
        </div>
      </section>
    </>
  );
}
