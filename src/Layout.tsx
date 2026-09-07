import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import useSpotlight from './hooks/useSpotlight';
import './styles/site.css';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useSpotlight();

  return (
    <div className="shell">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main className="shell__main" id="inhalt">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
