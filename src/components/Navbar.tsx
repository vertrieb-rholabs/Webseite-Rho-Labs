import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Die drei /demo/- und die drei /kauf/-Seiten stehen hier bewusst nicht:
// sie sind Weiterleitungsziele des Auslieferungsdienstes, tragen noindex und
// haben ohne den vorangegangenen Schritt keinen Sinn.
const LINKS = [
  { to: '/', label: 'Start', end: true },
  { to: '/kognitives-training', label: 'Kognitives Training' },
  { to: '/home', label: 'Für zu Hause' },
  { to: '/evidenz', label: 'Evidenz' },
  { to: '/kontakt', label: 'Kontakt' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Beim Seitenwechsel die Schublade schliessen.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="masthead">
      <div className="masthead__inner">
        <Link to="/" className="brand" aria-label="Rho-Labs — zur Startseite">
          <img src="/logo.png" alt="" width={30} height={30} />
          <span className="brand__word">
            Rho<span>-Labs</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Hauptnavigation">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav__link">
              {link.label}
            </NavLink>
          ))}
          <Link to="/kontakt" className="btn btn--primary btn--sm">
            Demo anfordern
          </Link>
        </nav>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="hauptmenue"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="nav__drawer" id="hauptmenue" aria-label="Hauptnavigation">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav__link">
              {link.label}
            </NavLink>
          ))}
          <Link to="/kontakt" className="btn btn--primary btn--sm">
            Demo anfordern
          </Link>
        </nav>
      )}
    </header>
  );
}
