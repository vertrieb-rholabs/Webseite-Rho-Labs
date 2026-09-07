import Seo from '../components/Seo';
import { PRIVACY_SECTIONS } from '../constants';

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
            <div className="legal-block" key={section.title}>
              <h2>{section.title}</h2>
              <div className="stack" style={{ gap: 14 }}>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Stand: September 2026
        </p>
      </div>
    </>
  );
}
