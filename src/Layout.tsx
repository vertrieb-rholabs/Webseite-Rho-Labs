import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import useSpotlight from './hooks/useSpotlight';
import './styles/site.css';

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Mit Sprungmarke (/#forschung, /datenschutz/#pilotprogramm) zum Ziel
    // statt nach oben — sonst setzt das Hydrieren den Sprung zurueck, den der
    // Browser beim Laden schon gemacht hat.
    const ziel = hash ? document.getElementById(hash.slice(1)) : null;
    if (ziel) {
      ziel.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

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
