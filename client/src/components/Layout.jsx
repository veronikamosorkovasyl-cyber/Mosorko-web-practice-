import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Partners from './Partners.jsx';

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main">Перейти до основного вмісту</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      {pathname === '/' && <Partners />}
      <Footer />
    </>
  );
}
