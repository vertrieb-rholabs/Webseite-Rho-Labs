import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Seo from '../components/Seo';
import { CONTACT_EMAIL } from '../constants';

/**
 * Allgemeine Geschäftsbedingungen — GERÜST.
 *
 * TODO(Rechtstext): Diese Seite enthält bewusst keinen Vertragstext. Die
 * Abschnitte stehen nur als Struktur; der Wortlaut ist eine Zulieferung und
 * wird anwaltlich erstellt. Bis dahin darf /home nicht öffentlich verlinkt
 * und nicht scharfgeschaltet werden — das Kaufformular verweist auf diese
 * Seite.
 */

/** Überschriften des künftigen Textes. Reine Gliederung, kein Inhalt. */
const ABSCHNITTE = [
  'Geltungsbereich',
  'Vertragspartner und Vertragsgegenstand',
  'Zustandekommen des Vertrages',
  'Preise und Zahlung',
  'Bereitstellung der Software und des Lizenzschlüssels',
  'Widerrufsrecht',
  'Nutzungsrechte',
  'Gewährleistung',
  'Haftung',
  'Streitbeilegung',
  'Schlussbestimmungen',
];

export default function Agb() {
  return (
    <>
      <Seo
        path="/agb"
        title="Allgemeine Geschäftsbedingungen — Rho-Labs"
        description="Allgemeine Geschäftsbedingungen für den Kauf von Rho-Labs Kognitives Training."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rechtliches
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          Für Verträge über Rho-Labs Kognitives Training zwischen Rho-Labs,
          Inhaber Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda, und dem
          Käufer.
        </p>

        {/* Der Platzhalter steht bewusst oben und auffällig — niemand soll
            diese Seite für einen fertigen Text halten. */}
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
                § {i + 1} {titel}
              </h2>
              <p style={{ color: '#64748b' }}>
                Platzhalter — Inhalt wird zugeliefert.
              </p>
            </div>
          ))}
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Anbieterangaben im <Link to="/impressum">Impressum</Link>. Zur
          Verarbeitung personenbezogener Daten siehe{' '}
          <Link to="/datenschutz">Datenschutzerklärung</Link>.
        </p>
      </div>
    </>
  );
}
