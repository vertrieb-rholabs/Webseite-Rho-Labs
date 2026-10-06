import { Info } from 'lucide-react';
import Seo from '../components/Seo';
import Closer from '../components/Closer';
import EvidenzText from '../components/EvidenzText';
import { ZWECKBESTIMMUNG } from '../constants';
import { EVIDENZ, EVIDENZ_STAND, type EvidenzQuelle } from '../data/evidenz';

/** Steht bei jeder Übung, die eine Quelle zeigt — wörtlich nach T1, Abschnitt 4 Punkt 6. */
const AUFGABENFORM_SATZ =
  'Die Übung greift eine Aufgabenform auf; sie ist kein normiertes Testverfahren.';

function Quelle({ q }: { q: EvidenzQuelle }) {
  const autoren =
    q.autoren.length === 0
      ? ''
      : q.autoren.join('; ') + (q.weitereAutoren > 0 ? ` u. a. (${q.weitereAutoren} weitere)` : '');
  const band = [q.band, q.seiten].filter(Boolean).join(', ');

  return (
    <li>
      {autoren && <>{autoren} </>}
      {q.jahr && <>({q.jahr}). </>}
      {q.titel}. <em>{q.zeitschrift}</em>
      {band && <>, {band}</>}.{' '}
      {q.url && (
        <a href={q.url} target="_blank" rel="noopener noreferrer">
          {q.doi ? `DOI ${q.doi}` : 'Quelle'}
          <span className="sr-only"> (öffnet in neuem Tab)</span>
        </a>
      )}
    </li>
  );
}

/**
 * Wissenschaftlicher Hintergrund — Herkunft der Übungen, nicht ihre Wirkung.
 *
 * Bis zum 06.10.2026 stellte die Seite je Übung zwei Einstufungen nebeneinander
 * („Verfahren“ und „Training“) und nannte im Einleitungssatz, „was das Üben
 * nachweislich bringt“. Das ist eine Wirkaussage, die Rho-Labs nicht belegen
 * will und nicht belegen muss (R1 Abschnitt 1.4; § 5 UWG, BGH I ZR 62/11). Die
 * Seite zeigt jetzt nur noch, auf welche bekannten Aufgabenformen der
 * kognitiven Psychologie die Übungen zurückgehen, mit den Quellen dazu.
 *
 * Die Daten kommen aus `src/data/evidenz.ts` (erzeugt, siehe
 * `scripts/evidenz-uebernehmen.mjs`); Quellen mit Krankheitsendpunkt und
 * Quellen zur Trainingswirkung führt die Seite nicht.
 */
export default function EvidencePage() {
  const mitQuelle = EVIDENZ.filter((s) => s.belegt);
  const ohneQuelle = EVIDENZ.filter((s) => !s.belegt);

  return (
    <>
      <Seo
        path="/evidenz"
        title="Wissenschaftlicher Hintergrund — Rho-Labs"
        description={`Auf welche bekannten Aufgabenformen der kognitiven Psychologie die Übungen zurückgehen — für ${mitQuelle.length} von ${EVIDENZ.length} Übungen mit Quellen zur Herkunft. Die Seite beschreibt Herkunft, nicht Wirkung.`}
      />

      <div className="wrap wrap--text section">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Wissenschaftlicher Hintergrund
        </p>
        <h1 className="h-page">Woher die Übungen kommen</h1>
        <p style={{ fontSize: 17.5, lineHeight: 1.7, color: '#94a3b8', margin: '0 0 32px' }}>
          Auf dieser Seite zeigen wir, auf welche bekannten Aufgabenformen der
          kognitiven Psychologie unsere Übungen zurückgehen. Sie beschreibt die
          Herkunft der Übungen, nicht ihre Wirkung; Wirkungen versprechen wir
          nicht.
        </p>

        {/* Die Zweckbestimmung, wortgleich wie auf der Produkt- und der
            Home-Seite. Sie steht hier, weil die Quellen einzeln lesbar sind. */}
        <div className="disclaimer" style={{ marginBottom: 20 }}>
          <span className="icon-box icon-box--sm icon-box--grey" aria-hidden="true">
            <Info size={17} />
          </span>
          <p>{ZWECKBESTIMMUNG}</p>
        </div>

        <div className="info-card" style={{ marginBottom: 44 }}>
          <p>
            Jede DOI wurde maschinell gegen <strong>Crossref</strong> geprüft;
            Autor, Jahr, Titel und Zeitschrift stammen von dort, nicht aus einer
            Zusammenfassung. Stand der Quellenliste: {EVIDENZ_STAND}.
          </p>
        </div>

        {/* ── Übungen mit Quelle ──────────────────────────────────────── */}
        <div className="stack">
          {mitQuelle.map((s) => (
            <div className="legal-block" key={s.key}>
              <div className="evidenz__kopf">
                <h2>{s.label}</h2>
                {s.kategorie && <span className="badge badge--dev">{s.kategorie}</span>}
              </div>
              {s.domaenen && <p className="evidenz__domaenen">{s.domaenen}</p>}

              {s.evidenztext && (
                <p className="evidenz__text">
                  <EvidenzText text={s.evidenztext} />
                </p>
              )}

              <p className="evidenz__text">{AUFGABENFORM_SATZ}</p>

              {s.quellen.length > 0 && (
                <ul className="reflist" style={{ marginTop: 18 }}>
                  {s.quellen.map((q, i) => (
                    <Quelle key={q.doi || i} q={q} />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* ── Übungen ohne hinterlegte Quelle ─────────────────────────── */}
        {ohneQuelle.length > 0 && (
          <>
            <h2 className="h-section" style={{ margin: '56px 0 16px', fontSize: 'clamp(22px, 2.4vw, 30px)' }}>
              Übungen ohne hinterlegte Quelle
            </h2>
            <div className="info-card" style={{ marginBottom: 20 }}>
              <p>
                Für diese {ohneQuelle.length} Übungen ist hier{' '}
                <span className="mark">keine Quelle hinterlegt</span>. Wir führen
                sie auf, statt sie zu verschweigen.
              </p>
            </div>
            <div className="grid grid--auto-240" style={{ gap: 12 }}>
              {ohneQuelle.map((s) => (
                <div className="evidenz__offen" key={s.key}>
                  {s.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Closer />
    </>
  );
}
