import { useState } from 'react';

const GENRES = ['Бойовик','Комедія','Драма','Мультфільм','Трилер','Фантастика','Жахи','Мелодрама','Пригоди','Документальний'];

export default function Filters({ initial = {}, onApply }) {
  const [v, setV] = useState({ cinema: '', genre: '', date: '', ...initial });

  const change = (e) => setV({ ...v, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); onApply(v); };

  return (
    <form className="filters" aria-label="Фільтри афіші" onSubmit={submit}>
      <div>
        <label htmlFor="cinema">Виберіть кінотеатр</label>
        <select id="cinema" name="cinema" value={v.cinema} onChange={change}>
          <option value="">Усі кінотеатри</option>
          <option value="a">Локація А</option>
          <option value="b">Локація Б</option>
          <option value="c">Локація В</option>
        </select>
      </div>
      <div>
        <label htmlFor="genre">Жанр</label>
        <select id="genre" name="genre" value={v.genre} onChange={change}>
          <option value="">Усі жанри</option>
          {GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="date">Дата</label>
        <input id="date" name="date" type="date" min="2026-11-19" value={v.date} onChange={change} />
      </div>
      <button className="btn" type="submit">Показати</button>
    </form>
  );
}
