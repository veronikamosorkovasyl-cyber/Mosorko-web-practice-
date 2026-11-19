import Button from './Button.jsx';

export default function FilmCard({ film }) {
  const base = `/assets/posters/film-${film.poster ?? film.id}`;
  return (
    <article className="film-card">
      <figure>
        <picture>
          <source type="image/webp" srcSet={`${base}-400.webp 400w, ${base}-800.webp 800w`}
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw" />
          <img src={`${base}-400.jpg`} alt={`Постер фільму «${film.title}»`}
               width="400" height="600" loading="lazy" decoding="async" />
        </picture>
        <figcaption className="visually-hidden">Постер: {film.title}</figcaption>
      </figure>
      <h3>{film.title}</h3>
      <p className="film-card__genre">{film.genre}</p>
      <Button to={`/session/${film.id}`} aria-label={`Купити квиток на фільм «${film.title}»`}>
        Купити квиток
      </Button>
    </article>
  );
}
