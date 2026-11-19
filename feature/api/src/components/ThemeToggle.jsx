import { useState } from 'react';

export default function ThemeToggle() {
  const root = document.documentElement;
  const [theme, setTheme] = useState(root.dataset.theme || 'light');

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
  };

  return (
    <button className="theme-toggle" type="button" aria-pressed={theme === 'dark'}
            aria-label="Темна тема" onClick={toggle}>
      <img className="theme-toggle__icon theme-toggle__icon--sun" src="/assets/icon-sun.svg" alt="" width="24" height="24" />
      <img className="theme-toggle__icon theme-toggle__icon--moon" src="/assets/icon-moon.svg" alt="" width="24" height="24" />
    </button>
  );
}
