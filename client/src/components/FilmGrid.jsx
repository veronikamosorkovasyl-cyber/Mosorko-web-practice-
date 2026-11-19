import FilmCard from './FilmCard.jsx';

export default function FilmGrid({ films }) {
  return (
    <ul className="film-grid">
      {films.map((f) => (
        <li key={f.id}><FilmCard film={f} /></li>
      ))}
    </ul>
  );
}
