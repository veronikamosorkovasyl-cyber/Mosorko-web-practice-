import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import usePageTitle from '../hooks/usePageTitle.js';
import SeatMap from '../components/SeatMap.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import Modal from '../components/Modal.jsx';
import { API_URL } from '../api.js';

export default function Session() {
  usePageTitle('Вибір місця в залі');
    const { id } = useParams();
    const { data: s, loading, error } = useFetch(`${API_URL}/api/items/${id}`);
  const [selected, setSelected] = useState({}); // { "2-5": 220 }
  const [done, setDone] = useState(false);

  if (loading) return <p>Завантаження…</p>;
    if (error || !s) {
      return (
        <>
          <h1>Сеанс не знайдено</h1>
          <p><Link to="/catalog">Повернутися до афіші</Link></p>
        </>
      );
    }

  const toggle = (key, price) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (key in next) delete next[key];
      else next[key] = price;
      return next;
    });

  const items = Object.entries(selected).map(([key, price]) => {
    const [row, seat] = key.split('-');
    return { key, row, seat, price };
  });
  const total = items.reduce((sum, i) => sum + i.price, 0);

  const submit = (e) => {
    e.preventDefault();
    if (items.length) setDone(true);
  };

  return (
    <>
      <h1>Вибір місця в залі</h1>
      <p className="session-info">
        <strong>{s.filmTitle}</strong>,{' '}
        <time dateTime={s.date}>{s.dateLabel}</time>,{' '}
        <time dateTime={s.start}>{s.start}</time>–<time dateTime={s.end}>{s.end}</time>,{' '}
        {s.cinemaName}, {s.genre}
      </p>

      <form id="seat-form" className="seat-picker" onSubmit={submit}>
        <section aria-labelledby="hall-title">
          <h2 id="hall-title">Схема залу</h2>
          <SeatMap hall={s.hall} selected={Object.keys(selected)} onToggle={toggle} />
        </section>
        <OrderSummary place={`${s.cinemaName}, ${s.address}`} items={items} total={total} />
      </form>

      <Modal open={done} onClose={() => setDone(false)} title="Місця заброньовано">
        <p>Квитків: {items.length}, сума: {total} грн. Це навчальний проєкт, оплата не виконується.</p>
      </Modal>
    </>
  );
}
