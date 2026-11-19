import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import usePageTitle from '../hooks/usePageTitle.js';
import Filters from '../components/Filters.jsx';
import FilmGrid from '../components/FilmGrid.jsx';
import { API_URL } from '../api.js';
import { toFilm } from '../utils/toFilm.js';

export default function Catalog() {
  usePageTitle('Афіші — усі фільми');
  const [params, setParams] = useSearchParams();
    const { data: items, loading, error } = useFetch(`${API_URL}/api/items`);
    const films = useMemo(() => items?.map(toFilm), [items]);

  const q = (params.get('q') || '').toLowerCase();
  const cinema = params.get('cinema') || '';
  const genre = params.get('genre') || '';
  const date = params.get('date') || '';

  const visible = useMemo(() => (films || []).filter((f) =>
    (!q || f.title.toLowerCase().includes(q)) &&
    (!genre || f.genre === genre) &&
    (!cinema || f.cinemas.includes(cinema)) &&
    (!date || f.dates.includes(date))
  ), [films, q, genre, cinema, date]);

  const apply = (v) => setParams(Object.fromEntries(Object.entries(v).filter(([, val]) => val)));

  return (
    <>
      <h1>Афіші</h1>
      <section aria-labelledby="filters-title">
        <h2 id="filters-title" className="visually-hidden">Фільтри</h2>
        <Filters initial={{ cinema, genre, date }} onApply={apply} />
      </section>

      <section aria-labelledby="list-title">
        <h2 id="list-title">Всі фільми</h2>
        {loading && <p>Завантаження…</p>}
        {error && <p role="alert">Помилка завантаження: {error}</p>}
        {films && (
          <>
            <p id="results-count" aria-live="polite">Знайдено фільмів: {visible.length}</p>
            {visible.length ? <FilmGrid films={visible} /> : <p>Нічого не знайдено. Змініть фільтри.</p>}
          </>
        )}
      </section>
    </>
  );
}
