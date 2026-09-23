import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import Seo from '../components/Seo';
import { CONTACT_EMAIL, KONTAKT_TELEFON } from '../constants';

export default function Imprint() {
  return (
    <>
      <Seo
        path="/impressum"
        title="Impressum — Rho-Labs"
        description="Angaben gemäß § 5 DDG: Rho-Labs, Inhaber Patrick Feix, Wutha-Farnroda."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Impressum
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 28 }}>
          Angaben gemäß § 5 DDG
        </h1>

        <div className="legal-block" style={{ marginBottom: 20 }}>
          <address>
            Rho-Labs — Einzelunternehmen
            <br />
            Inhaber: Patrick Feix
            <br />
            Feldstraße 15
            <br />
            99848 Wutha-Farnroda
            <br />
            Deutschland
          </address>
        </div>

        <div className="grid grid--auto-240" style={{ marginBottom: 20 }}>
          <div className="legal-block" style={{ padding: 24 }}>
            <p className="legal-label">Kontakt</p>
            <p className="legal-mono" style={{ marginBottom: 8 }}>
              Telefon: {KONTAKT_TELEFON}
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ fontSize: 14.5, fontWeight: 600 }}>
              {CONTACT_EMAIL}
            </a>
            <p className="legal-aside">
              Für eine unmittelbare Rückmeldung erreichen Sie uns außerdem über
              das <Link to="/kontakt">Kontaktformular</Link>.
            </p>
            {/* Aus Commit b6b834d — im Entwurf nicht enthalten, bewusst behalten. */}
            <a
              href="https://www.linkedin.com/in/patrick-feix-0b0106399/"
              target="_blank"
              rel="noopener noreferrer"
              className="legal-link"
            >
              <Linkedin size={15} aria-hidden="true" /> LinkedIn-Profil des Inhabers
            </a>
          </div>

          {/* Der Entwurf führt hier zusätzlich die Steuernummer und die
              Bezeichnung „W-IdNr.“. Beides ist bewusst nicht übernommen:
              Commit e4e6b50 hat die Steuernummer im Juli 2026 entfernt (in
              § 5 Abs. 1 Nr. 6 DDG nicht aufgeführt, personenbezogen, ein
              bekanntes Vehikel für gefälschte Rechnungen) und die Nummer
              korrekt als USt-IdNr. benannt — das Format DE + 9 Ziffern ist
              das der USt-IdNr.; eine W-IdNr. nach § 139c AO trüge zusätzlich
              ein fünfstelliges Unterscheidungsmerkmal. Der Entwurf ist an
              dieser Stelle älter als diese Entscheidung. */}
          <div className="legal-block" style={{ padding: 24 }}>
            <p className="legal-label">Steuerliche Angaben</p>
            <p className="legal-mono">USt-IdNr. DE461250542</p>
            <p className="legal-aside">
              Kleinunternehmen gemäß § 19 UStG — es wird keine Umsatzsteuer
              berechnet.
            </p>
          </div>
        </div>

        <p className="note">Stand: März 2026</p>

        <div className="legal-block" style={{ marginTop: 40 }}>
          <h2>Verantwortlich für den Inhalt</h2>
          <p>
            Patrick Feix, Anschrift wie oben. Inhaltlich verantwortlich gemäß
            § 18 Abs. 2 MStV.
          </p>
        </div>

        <div className="legal-block" style={{ marginTop: 20 }}>
          <h2>Streitbeilegung</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </div>
      </div>
    </>
  );
}
