import usePageTitle from '../hooks/usePageTitle.js';
import Button from '../components/Button.jsx';

export default function NotFound() {
  usePageTitle('Сторінку не знайдено');
  return (
    <>
      <h1>404 — сторінку не знайдено</h1>
      <p>Схоже, такої адреси не існує.</p>
      <p><Button to="/">На головну</Button></p>
    </>
  );
}
