import { Link } from 'react-router-dom';
import { MessageSquare, ShoppingCart } from 'lucide-react';
import Seo from '../components/Seo';
import {
  CONTACT_EMAIL,
  DEMO_FORM_ACTION,
  NEWSLETTER_EINWILLIGUNG,
  SALES_EMAIL,
} from '../constants';

export default function ContactPage() {
  return (
    <>
      <Seo
        path="/kontakt"
        title="Kontakt & Demo anfordern — Rho-Labs"
        description="Demo-Schlüssel anfordern: 14 Tage, voller Funktionsumfang. Oder direkt schreiben — Antwort in der Regel innerhalb von 24 Stunden."
      />

      <div className="wrap wrap--form section">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Kontakt
        </p>
        <h1 className="h-page" style={{ marginBottom: 40 }}>
          Demo holen oder Frage stellen
        </h1>

        <div className="grid grid--auto-320">
          {/* ── Demo-Formular ───────────────────────────────────────────
              Sendet unmittelbar an den Auslieferungsdienst; der antwortet
              mit einer Weiterleitung auf /demo/danke/. Deshalb ein echtes
              HTML-Formular ohne JavaScript — es funktioniert auch dann,
              wenn das Skript der Seite nicht geladen hat.
              ------------------------------------------------------------ */}
          <div className="form-card">
            <p className="eyebrow" style={{ letterSpacing: '0.2em', marginBottom: 14 }}>
              Kostenlos testen
            </p>
            <h2>Demo-Schlüssel anfordern</h2>
            <p className="form-card__lede">
              14 Tage, voller Funktionsumfang, ein Gerät. Adresse eintragen,
              Bestätigungslink in der E-Mail anklicken — den Schlüssel gibt es
              dann sofort.
            </p>

            <form method="post" action={DEMO_FORM_ACTION} className="form">
              <div className="field">
                <label htmlFor="demo-email">E-Mail-Adresse</label>
                <input
                  id="demo-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="name@beispiel.de"
                />
              </div>

              <div className="field">
                <label htmlFor="demo-name">
                  Name <span className="field__hint">— freiwillig, für die Anrede</span>
                </label>
                <input
                  id="demo-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={80}
                  placeholder="Wie sollen wir dich ansprechen?"
                />
              </div>

              {/* Honigtopf. Für Menschen unsichtbar, für Bots verlockend —
                  ist das Feld gefüllt, verwirft der Server die Anfrage. */}
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="webseite">Webseite</label>
                <input id="webseite" type="text" name="webseite" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="consent">
                <input type="checkbox" required />
                <span>
                  Ich bin einverstanden, dass meine E-Mail-Adresse zur Zusendung
                  des Demo-Schlüssels verarbeitet wird. Näheres in der{' '}
                  <Link to="/datenschutz">Datenschutzerklärung</Link>.
                </span>
              </label>

              {/* Zweite Einwilligung, deutlich abgesetzt: sie betrifft etwas
                  anderes als die Demo und muss nach Art. 7 Abs. 2 DSGVO klar
                  unterscheidbar sein. Optional und nicht vorbelegt — die Demo
                  hängt nicht daran (Art. 7 Abs. 4 DSGVO). */}
              <label className="consent consent--optional">
                <input type="checkbox" name="newsletter" value="ja" />
                <span>
                  {NEWSLETTER_EINWILLIGUNG}{' '}
                  <span className="consent__aside">
                    Kein Pflichtfeld — die Demo bekommst du auch ohne.
                  </span>
                </span>
              </label>

              <button type="submit" className="form__submit">
                Kostenlose Demo anfordern
              </button>
            </form>

            <p className="form__note">
              Ohne das zweite Häkchen bekommst du nur den Demo-Schlüssel und
              sonst nichts. Eine Demo je Adresse und Jahr. Der
              Bestätigungslink gilt 24 Stunden.
            </p>
          </div>

          {/* ── Direkte Wege ───────────────────────────────────────────── */}
          <div className="stack">
            <div
              className="card card--edge card--hover-purple contact-card"
              data-edge="1"
              style={{ padding: 28 }}
            >
              <span
                className="icon-box icon-box--sm icon-box--purple"
                style={{ marginBottom: 16 }}
                aria-hidden="true"
              >
                <MessageSquare size={17} />
              </span>
              <h3>Allgemeine Anfragen</h3>
              <p>
                Technische Fragen, Rückmeldungen oder Anpassungen an der
                Software.
              </p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-purple">
                {CONTACT_EMAIL}
              </a>
            </div>

            <div
              className="card card--edge card--hover-purple contact-card"
              data-edge="1"
              style={{ padding: 28 }}
            >
              <span className="icon-box icon-box--sm" style={{ marginBottom: 16 }} aria-hidden="true">
                <ShoppingCart size={17} />
              </span>
              <h3>Vertrieb &amp; Lizenzen</h3>
              <p>Bestellungen, Angebote, Volumenlizenzen für Einrichtungen.</p>
              <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
            </div>

            <div className="info-card">
              <p>Antwort in der Regel innerhalb von 24 Stunden, spätestens nach 48.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
