import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import usePageTitle from '../hooks/usePageTitle.js';
import Field from '../components/Field.jsx';
import { API_URL, api } from '../api.js';

const GENRES = ['Бойовик','Комедія','Драма','Мультфільм','Трилер','Фантастика','Жахи','Мелодрама','Пригоди','Документальний'];
const EMPTY = { filmTitle: '', genre: 'Бойовик', cinema: 'a', date: '', start: '', end: '', poster: '1' };

function AdminPanel({ onLogout }) {
  usePageTitle('Керування сеансами');
  const [reload, setReload] = useState(0);
  // зміна параметра r змінює url і змушує useFetch завантажити список знову
  const { data: items, loading, error } = useFetch(`${API_URL}/api/items?r=${reload}`);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    try {
      await api.create(values);
      setValues(EMPTY);
      setReload((n) => n + 1);
      setMessage('Сеанс додано.');
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      setErrors(err.errors || {});
      setMessage(err.errors ? '' : err.message);
    }
  };

  const del = async (item) => {
    if (!window.confirm(`Видалити сеанс «${item.filmTitle}» (${item.dateLabel}, ${item.start})?`)) return;
    try {
      await api.remove(item.id);
      setReload((n) => n + 1);
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      setMessage(err.message);
    }
  };

  return (
    <>
      <h1>Керування сеансами</h1>

      <section aria-labelledby="add-title">
        <h2 id="add-title">Новий сеанс</h2>
        <form id="return" onSubmit={submit} noValidate>
          <fieldset>
            <legend>Дані сеансу</legend>
            <Field id="filmTitle" label="Назва фільму" value={values.filmTitle} onChange={change} error={errors.filmTitle} />
            <Field id="genre" label="Жанр" as="select" value={values.genre} onChange={change} error={errors.genre}>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </Field>
            <Field id="cinema" label="Кінотеатр" as="select" value={values.cinema} onChange={change} error={errors.cinema}>
              <option value="a">Локація А</option>
              <option value="b">Локація Б</option>
              <option value="c">Локація В</option>
            </Field>
            <Field id="date" label="Дата" type="date" value={values.date} onChange={change} error={errors.date} />
            <Field id="start" label="Початок" type="time" value={values.start} onChange={change} error={errors.start} />
            <Field id="end" label="Завершення" type="time" value={values.end} onChange={change} error={errors.end} />
            <Field id="poster" label="Номер постера (1–10)" value={values.poster} onChange={change} error={errors.poster} inputMode="numeric" />
          </fieldset>
          <button className="btn" type="submit">Додати сеанс</button>
          {message && <p role="status">{message}</p>}
        </form>
      </section>

      <section aria-labelledby="list-title">
        <h2 id="list-title">Усі сеанси</h2>
        {loading && <p>Завантаження…</p>}
        {error && <p role="alert">Помилка: {error}</p>}
        {items && (
          <ul>
            {items.map((i) => (
              <li key={i.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span>
                  <strong>{i.filmTitle}</strong>, {i.cinemaName}, {i.dateLabel}, {i.start}–{i.end}
                </span>
                <button className="btn btn--secondary" type="button" onClick={() => del(i)}>
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
  const [input, setInput] = useState('');

  const login = (e) => {
    e.preventDefault();
    sessionStorage.setItem('adminToken', input.trim());
    setToken(input.trim());
    setInput('');
  };
  const logout = () => {
    sessionStorage.removeItem('adminToken');
    setToken('');
  };

  if (!token) {
    return (
      <>
        <h1>Керування сеансами</h1>
        <form onSubmit={login} style={{ maxWidth: '24rem' }}>
          <p>
            <label htmlFor="token">Токен адміністратора</label>
            <input id="token" type="password" value={input}
                   onChange={(e) => setInput(e.target.value)} autoComplete="off" />
          </p>
          <button className="btn" type="submit">Увійти</button>
        </form>
      </>
    );
  }

  return <AdminPanel onLogout={logout} />;
}
