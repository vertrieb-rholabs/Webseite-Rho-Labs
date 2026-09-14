import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Seo from '../components/Seo';
import { CONTACT_EMAIL } from '../constants';

/**
 * Widerrufsbelehrung — GERÜST.
 *
 * TODO(Rechtstext): Hier steht bewusst keine Belehrung. Für digitale Inhalte
 * hängt an dieser Seite die Zustimmung zur sofortigen Bereitstellung aus dem
 * Kaufformular (§ 356 Abs. 5 BGB); der Wortlaut beider Texte muss zueinander
 * passen und wird gemeinsam zugeliefert. Eine selbst formulierte Belehrung
 * wäre hier schlimmer als gar keine — eine fehlerhafte Belehrung verlängert
 * die Widerrufsfrist.
 */

/** Überschriften des künftigen Textes. Reine Gliederung, kein Inhalt. */
const ABSCHNITTE = [
  'Widerrufsrecht',
  'Ausübung des Widerrufs',
  'Folgen des Widerrufs',
  'Vorzeitiges Erlöschen des Widerrufsrechts bei digitalen Inhalten',
  'Muster-Widerrufsformular',
];

export default function Widerruf() {
  return (
    <>
      <Seo
        path="/widerruf"
        title="Widerrufsbelehrung — Rho-Labs"
        description="Widerrufsbelehrung für Verbraucher beim Kauf von Rho-Labs Kognitives Training."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rechtliches
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Widerrufsbelehrung
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          Für Verbraucher beim Kauf der Home-Version. Verkäufer ist Rho-Labs,
          Inhaber Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda.
        </p>

        <div className="callout" style={{ marginBottom: 28 }}>
          <h4>
            <AlertTriangle size={15} aria-hidden="true" /> Platzhalter — Text folgt
          </h4>
          <p>
            Der verbindliche Wortlaut dieser Belehrung wird derzeit erstellt und
            hier veröffentlicht, bevor die Home-Version bestellbar ist. Die
            folgende Gliederung zeigt nur, welche Abschnitte der Text enthalten
            wird. Ein Widerruf ist auch formlos möglich — eine Mail an{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> genügt.
          </p>
        </div>

        <div className="stack">
          {ABSCHNITTE.map((titel) => (
            <div className="legal-block" key={titel}>
              <h2>{titel}</h2>
              <p style={{ color: '#64748b' }}>
                Platzhalter — Inhalt wird zugeliefert.
              </p>
            </div>
          ))}
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Anbieterangaben im <Link to="/impressum">Impressum</Link>. Die
          Vertragsbedingungen stehen in den <Link to="/agb">AGB</Link>.
        </p>
      </div>
    </>
  );
}
