import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link className="logo" to="/">
        <img src="/assets/Logo_Cinema.svg" alt="" width="32" height="32" />
        <span>Cinema-Ua</span>
      </Link>
      <nav aria-labelledby="footer-info">
        <h2 id="footer-info">Корисна інформація</h2>
        <ul>
        <li><Link to="/admin">Керування сеансами</Link></li>
          <li><Link to="/catalog">Афіші</Link></li>
          <li><Link to="/contacts#return">Повернення квитків</Link></li>
          <li><Link to="/contacts">Контакти</Link></li>
        </ul>
      </nav>
      <section aria-labelledby="footer-social">
        <h2 id="footer-social">Наші соц мережі:</h2>
        <ul>
          <li><a href="https://instagram.com/" rel="noopener" target="_blank">Instagram</a></li>
          <li><a href="https://facebook.com/" rel="noopener" target="_blank">Facebook</a></li>
          <li><a href="https://t.me/" rel="noopener" target="_blank">Telegram</a></li>
        </ul>
      </section>
      <p><small>Cinema-Ua © <time dateTime="2026">2026</time>. Навчальний проєкт, сайт не справжній.</small></p>
    </footer>
  );
}
