import Seo from '../components/Seo';
import { PRIVACY_SECTIONS } from '../constants';

/** `**Leitmarke.** Rest` → die Leitmarke fett, der Rest unverändert dahinter. */
function Absatz({ text }: { text: string }) {
  const treffer = /^\*\*([^*]+)\*\*\s*([\s\S]*)$/.exec(text);
  if (!treffer) return <p>{text}</p>;
  return (
    <p>
      <strong>{treffer[1]}</strong> {treffer[2]}
    </p>
  );
}

export default function Privacy() {
  return (
    <>
      <Seo
        path="/datenschutz"
        title="Datenschutzerklärung — Rho-Labs"
        description="Welche Daten wir verarbeiten, auf welcher Rechtsgrundlage, wie lange — und welche Rechte du hast. Trainingsdaten bleiben auf dem Gerät."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Datenschutz
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Datenschutzerklärung
        </h1>
        <p className="lede" style={{ marginBottom: 36 }}>
          Verantwortlich ist Rho-Labs, Inhaber Patrick Feix, Feldstraße 15,
          99848 Wutha-Farnroda. Trainings- und Nutzerdaten der Anwendung bleiben
          auf dem Gerät und werden nicht an uns übertragen.
        </p>

        <div className="stack">
          {PRIVACY_SECTIONS.map((section) => (
            <div className="legal-block" key={section.title} id={section.id}>
              <h2>{section.title}</h2>
              <div className="stack" style={{ gap: 14 }}>
                {section.paragraphs.map((paragraph) => (
                  <Absatz text={paragraph} key={paragraph} />
                ))}
                {section.hervorgehoben && (
                  <blockquote>
                    <Absatz text={section.hervorgehoben} />
                  </blockquote>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Stand: Oktober 2026
        </p>
      </div>
    </>
  );
}
