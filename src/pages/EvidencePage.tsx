import { BookOpen, Info } from 'lucide-react';
import Seo from '../components/Seo';
import Closer from '../components/Closer';
import EvidenzText from '../components/EvidenzText';
import {
  EVIDENZ,
  EVIDENZ_ERKLAERUNG,
  EVIDENZ_HINWEIS,
  EVIDENZ_STAND,
  grundstufe,
  type EvidenzQuelle,
  type EvidenzSpiel,
} from '../data/evidenz';

const STUFEN_KLASSE = {
  STARK: 'stufe stufe--stark',
  MODERAT: 'stufe stufe--moderat',
  SCHWACH: 'stufe stufe--schwach',
} as const;

function Einstufung({
  titel,
  wert,
}: {
  titel: string;
  wert: EvidenzSpiel['paradigma'];
}) {
  if (!wert) return null;
  return (
    <div className="einstufung">
      <p className="einstufung__titel">{titel}</p>
      <p>
        <span className={STUFEN_KLASSE[grundstufe(wert.stufe)]}>{wert.stufe}</span>
        {wert.einschraenkung && (
          <span className="einstufung__zusatz">{wert.einschraenkung}</span>
        )}
      </p>
    </div>
  );
}

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
        </a>
      )}
    </li>
  );
}

export default function EvidencePage() {
  const belegt = EVIDENZ.filter((s) => s.belegt);
  const ohneBeleg = EVIDENZ.filter((s) => !s.belegt);

  return (
    <>
      <Seo
        path="/evidenz"
        title="Wissenschaftlicher Hintergrund — Rho-Labs"
        description={`Auf welchem Verfahren jede Übung beruht und wie gut die Trainingswirkung untersucht ist — für ${belegt.length} von ${EVIDENZ.length} Übungen mit geprüften Quellen, getrennt nach Verfahren und Training.`}
      />

      <div className="wrap wrap--text section">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Wissenschaftlicher Hintergrund
        </p>
        <h1 className="h-page">Woher die Übungen kommen</h1>
        <p style={{ fontSize: 17.5, lineHeight: 1.7, color: '#94a3b8', margin: '0 0 32px' }}>
          Für jede Übung steht hier zweierlei getrennt: auf welchem Verfahren sie
          beruht — und was das Üben nachweislich bringt. Beides wird oft
          vermischt, und genau das soll diese Seite verhindern.
        </p>

        {/* Pflichthinweis aus dem Register. Er MUSS hier stehen: die Quellen
            sind einzeln lesbar, ein Verweis auf das Register genügt dafür
            nicht. */}
        <div className="disclaimer" style={{ marginBottom: 20 }}>
          <span className="icon-box icon-box--sm icon-box--grey" aria-hidden="true">
            <Info size={17} />
          </span>
          <p>{EVIDENZ_HINWEIS}</p>
        </div>

        <div className="info-card info-card--cyan" style={{ marginBottom: 20 }}>
          <h3>
            <BookOpen size={17} aria-hidden="true" /> Zwei Fragen, zwei Antworten
          </h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#cbd5e1', margin: '0 0 8px' }}>
            <strong style={{ color: '#fff' }}>Verfahren</strong> — {EVIDENZ_ERKLAERUNG.paradigma}
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#cbd5e1', margin: '0 0 12px' }}>
            <strong style={{ color: '#fff' }}>Training</strong> — {EVIDENZ_ERKLAERUNG.training}
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#94a3b8', margin: 0 }}>
            Ein starkes Verfahren mit schwacher Trainingsevidenz ist der{' '}
            <span className="mark">Normalfall</span>, kein Mangel. Eine
            Einschränkung wie „für nahe Aufgaben" gehört zur Aussage — wir lassen
            sie nirgends weg.
          </p>
        </div>

        <div className="info-card" style={{ marginBottom: 44 }}>
          <p>
            Jede DOI wurde maschinell gegen <strong>Crossref</strong> geprüft;
            Autor, Jahr, Titel und Zeitschrift stammen von dort, nicht aus einer
            Zusammenfassung. Stand des Registers: {EVIDENZ_STAND}.
          </p>
        </div>

        {/* ── Übungen mit Beleg ───────────────────────────────────────── */}
        <div className="stack">
          {belegt.map((s) => (
            <div className="legal-block" key={s.key}>
              <div className="evidenz__kopf">
                <h2>{s.label}</h2>
                {s.kategorie && <span className="badge badge--dev">{s.kategorie}</span>}
              </div>
              {s.domaenen && <p className="evidenz__domaenen">{s.domaenen}</p>}

              <div className="evidenz__stufen">
                <Einstufung titel="Verfahren" wert={s.paradigma} />
                <Einstufung titel="Training" wert={s.training} />
              </div>

              {s.evidenztext && (
                <p className="evidenz__text">
                  <EvidenzText text={s.evidenztext} />
                </p>
              )}

              {s.quellen.length > 0 && (
                <ul className="reflist" style={{ marginTop: 18 }}>
                  {s.quellen.map((q, i) => (
                    <Quelle key={q.doi || i} q={q} />
                  ))}
                </ul>
              )}

              {s.quellenstatus !== 'dokumentiert' && (
                <p className="evidenz__status">{s.quellenstatus}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Übungen ohne Beleg ──────────────────────────────────────── */}
        {ohneBeleg.length > 0 && (
          <>
            <h2 className="h-section" style={{ margin: '56px 0 16px', fontSize: 'clamp(22px, 2.4vw, 30px)' }}>
              Übungen ohne dokumentierten Beleg
            </h2>
            <div className="info-card" style={{ marginBottom: 20 }}>
              <p>
                Diese {ohneBeleg.length} Übungen stammen aus der ersten Fassung der
                Anwendung. Für sie ist <span className="mark">keine Quelle hinterlegt</span>.
                Wir führen sie hier auf, statt sie zu verschweigen — sie werden
                aber weder in der Anwendung noch hier als belegt dargestellt.
              </p>
            </div>
            <div className="grid grid--auto-240" style={{ gap: 12 }}>
              {ohneBeleg.map((s) => (
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
