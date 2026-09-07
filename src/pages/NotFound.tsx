import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo
        path="/404"
        title="Seite nicht gefunden — Rho-Labs"
        description="Diese Seite gibt es nicht."
        noindex
      />

      <div className="wrap wrap--form">
        <div className="status-page">
          <p className="eyebrow">Fehler 404</p>
          <h1>Diese Seite gibt es nicht</h1>
          <p className="status-page__body">
            Vielleicht hat sich die Adresse geändert oder ein Zeichen ist beim
            Tippen verloren gegangen.
          </p>
          <div className="btn-row btn-row--center">
            <Link to="/" className="btn btn--primary">
              Zur Startseite
            </Link>
            <Link to="/kognitives-training" className="btn btn--ghost">
              Kognitives Training
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
