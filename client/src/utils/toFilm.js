export const toFilm = (s) => ({
  id: s.id,
  title: s.filmTitle,
  genre: s.genre,
  poster: s.poster,
  cinemas: [s.cinema],
  dates: [s.date],
});
