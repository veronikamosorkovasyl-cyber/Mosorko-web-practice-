import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]); // закрити меню після переходу

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/catalog?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="site-header">
      <Link className="logo" to="/">
        <img src="/assets/Logo_Cinema.svg" alt="" width="40" height="40" />
        <span>Cinema-Ua</span>
      </Link>

      <nav aria-label="Головна навігація">
        <ThemeToggle />
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-list"
          onClick={() => setOpen((o) => !o)}
        >
          Меню
        </button>
        <ul id="nav-list">
          <li><NavLink to="/" end>Головна</NavLink></li>
          <li><NavLink to="/catalog">Афіші</NavLink></li>
          <li><NavLink to="/contacts">Контакти</NavLink></li>
        </ul>
      </nav>

      <form className="site-search" role="search" onSubmit={onSearch}>
        <label className="visually-hidden" htmlFor="q">Пошук фільмів</label>
        <input id="q" type="search" placeholder="Пошук" autoComplete="off"
               value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit">Знайти</button>
      </form>

      <a className="lang" href="#" hrefLang="en" lang="en" title="Switch to English">EN</a>
    </header>
  );
}
