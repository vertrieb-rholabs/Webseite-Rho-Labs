import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Seo from '../components/Seo';
import { CONTACT_EMAIL } from '../constants';

/**
 * Lizenzbedingungen — GERÜST.
 *
 * TODO(Rechtstext): Diese Seite enthält bewusst keine Lizenzbedingungen. Sie
 * regeln später, was der Käufer mit der Software tun darf — Gerätezahl,
 * Aktivierung, Weitergabe, Open-Source-Bestandteile. Der Wortlaut ist eine
 * Zulieferung.
 */

/** Überschriften des künftigen Textes. Reine Gliederung, kein Inhalt. */
const ABSCHNITTE = [
  'Gegenstand der Lizenz',
  'Umfang der Nutzung und Anzahl der Geräte',
  'Aktivierung und Gerätebindung',
  'Aktualisierungen und Fehlerbehebungen',
  'Weitergabe und Untersagungen',
  'Bestandteile Dritter und Open-Source-Komponenten',
  'Laufzeit und Beendigung',
  'Gewährleistung und Haftung',
];

export default function Lizenzbedingungen() {
  return (
    <>
      <Seo
        path="/lizenzbedingungen"
        title="Lizenzbedingungen — Rho-Labs"
        description="Lizenzbedingungen für die Nutzung von Rho-Labs Kognitives Training."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rechtliches
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Lizenzbedingungen
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          Für die Nutzung von Rho-Labs Kognitives Training — Home-Lizenz und
          gewerbliche Lizenzen.
        </p>

        <div className="callout" style={{ marginBottom: 28 }}>
          <h4>
            <AlertTriangle size={15} aria-hidden="true" /> Platzhalter — Text folgt
          </h4>
          <p>
            Der verbindliche Wortlaut dieser Bedingungen wird derzeit erstellt
            und hier veröffentlicht, bevor die Home-Version bestellbar ist. Die
            folgende Gliederung zeigt nur, welche Abschnitte der Text enthalten
            wird. Fragen bis dahin gerne an{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>

        <div className="stack">
          {ABSCHNITTE.map((titel, i) => (
            <div className="legal-block" key={titel}>
              <h2>
                {i + 1}. {titel}
              </h2>
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
