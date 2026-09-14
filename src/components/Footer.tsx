import { Link } from 'react-router-dom';
import { Facebook, Linkedin } from 'lucide-react';
import {
  LAB_PROJECTS,
  PIPELINE,
  SALES_EMAIL,
  SOZIALE_PROFILE,
  STATUS_LABELS,
} from '../constants';

const PROFIL_SYMBOL: Record<string, typeof Linkedin> = {
  LinkedIn: Linkedin,
  Facebook,
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__cols">
          <div className="footer__about">
            <Link to="/" className="brand" style={{ marginBottom: 16 }}>
              <img src="/logo.png" alt="" width={26} height={26} />
              <span className="brand__word">
                Rho<span>-Labs</span>
              </span>
            </Link>
            <p>
              Desktop-Software für kognitives Training und wissenschaftliche
              Anwendungen. Lokal. Fundiert. Durchdacht.
            </p>

            {SOZIALE_PROFILE.length > 0 && (
              <div className="footer__profile">
                {SOZIALE_PROFILE.map((profil) => {
                  const Symbol = PROFIL_SYMBOL[profil.name];
                  return (
                    <a
                      key={profil.name}
                      href={profil.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__profil"
                      aria-label={`Rho-Labs auf ${profil.name}`}
                      title={`Rho-Labs auf ${profil.name}`}
                    >
                      {Symbol ? <Symbol size={17} aria-hidden="true" /> : profil.name}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4>Produkte</h4>
            <ul>
              {PIPELINE.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link to={item.href} className="footer__link">
                      {item.name}
                    </Link>
                  ) : (
                    <span className="footer__soon">
                      {item.name} — {STATUS_LABELS[item.status]}
                    </span>
                  )}
                </li>
              ))}
              {/* Home ist kein eigenes Produkt, sondern eine Ausführung des
                  Kognitiven Trainings — deshalb nicht in PIPELINE, aber hier
                  erreichbar. */}
              <li>
                <Link to="/home" className="footer__link">
                  … für zu Hause
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Labor</h4>
            <ul>
              {LAB_PROJECTS.map((project) => (
                <li key={project.id}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__link"
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Information</h4>
            <ul>
              <li>
                <Link to="/evidenz" className="footer__link">
                  Wiss. Hintergrund
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="footer__link">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/impressum" className="footer__link">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="footer__link">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/agb" className="footer__link">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/widerruf" className="footer__link">
                  Widerruf
                </Link>
              </li>
              <li>
                <Link to="/lizenzbedingungen" className="footer__link">
                  Lizenzbedingungen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Vertrieb</h4>
            <a href={`mailto:${SALES_EMAIL}`} style={{ fontSize: 14, fontWeight: 600 }}>
              {SALES_EMAIL}
            </a>
            <p className="note" style={{ margin: '10px 0 0', lineHeight: 1.6 }}>
              Rho-Labs — Patrick Feix
              <br />
              Feldstraße 15, 99848 Wutha-Farnroda
              <br />
              Antwort in der Regel innerhalb von 24 Stunden.
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Rho-Labs — Patrick Feix. Made in Germany.</span>
          <span className="footer__stamp">Kein Medizinprodukt</span>
        </div>
      </div>
    </footer>
  );
}
