import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import Seo from '../components/Seo';
import {
  CONTACT_EMAIL,
  WIDERRUF_FORM_ACTION,
  WIDERRUF_FUNKTION_LABEL,
  WIDERRUF_FUNKTION_PFAD,
} from '../constants';
import { rueckwegKasten, rueckwegSkript, vorabSchichtAusblenden } from '../rueckwege';

/* ── Rueckweg-Kennung des Auslieferungsdienstes ────────────────────────────
   `eingabe` — Angaben unvollstaendig oder ungueltig; der Leser soll etwas
   aendern. `zuviele` — Ratengrenze; warten. Alles andere wird ignoriert,
   damit ein unbekannter Wert nicht wie ein Tippfehler aussieht.

   Genau an dieser Stelle verschluckte die Kaufseite den Wert `derzeit` und
   zeigte dem Kaeufer gar nichts. Deshalb steht hier von Anfang an ein
   vollstaendiger Satz zu jedem Wert, den der Dienst wirklich sendet — und
   nichts anderes sendet er.

   ── Gelesen wird die Kennung jetzt ZWEIMAL (22.09.2026) ────────────────────
   Bis dahin geschah das nur in einem `useEffect`, also erst nach dem
   Einhaengen von React. Wer abgewiesen wurde, sah bis dahin dasselbe leere
   Formular ein zweites Mal — ohne Grund, ohne Hinweis, bei einer
   fristgebundenen Erklaerung; und wessen Buendel gar nicht lud, sah nie etwas.
   Deshalb steht derselbe Kasten jetzt zusaetzlich vorgerendert und verborgen
   im HTML, und ein synchrones Skript macht ihn sichtbar, waehrend der Browser
   die Seite liest. Sobald React uebernimmt, blendet es diese Vorab-Schicht aus
   und zeigt seine eigene Fassung. Einzelheiten und der Messwert dazu in
   `src/rueckwege.ts`.
   -------------------------------------------------------------------------- */
type Formfehler = 'eingabe' | 'zuviele';

const FORMFEHLER_TEXT: Record<Formfehler, string> = {
  eingabe:
    'Der Widerruf ließ sich so nicht entgegennehmen. Bitte prüfen Sie Ihre Angaben: Name, Angaben zum Vertrag und E-Mail-Adresse müssen ausgefüllt sein.',
  zuviele:
    'Von Ihrem Anschluss kamen gerade zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut — an Ihren Angaben liegt es nicht. Eilt es, genügt eine formlose E-Mail an uns.',
};

function formfehlerLesen(wert: string | null): Formfehler | null {
  if (wert === 'eingabe' || wert === 'zuviele') return wert;
  return null;
}

/** Die Kennungen, die gelten — aus derselben Pruefung wie eh und je. */
const FORMFEHLER_KENNUNGEN = Object.keys(FORMFEHLER_TEXT).filter(
  (kennung) => formfehlerLesen(kennung) !== null,
);

/** Die Kaesten, vorgerendert und verborgen. */
const RUECKWEG_HTML = FORMFEHLER_KENNUNGEN
  .map((kennung) => rueckwegKasten(kennung, FORMFEHLER_TEXT[kennung as Formfehler]))
  .join('');

/** Das Skript, das den passenden Kasten sichtbar macht. */
const RUECKWEG_SKRIPT = rueckwegSkript([
  { parameter: 'fehler', werte: FORMFEHLER_KENNUNGEN },
]);

/**
 * Die Widerrufsfunktion nach § 356a BGB, erste Stufe.
 *
 * ── Warum es diese Seite gibt ───────────────────────────────────────────────
 * § 356a Abs. 1 verlangt, dass der Verbraucher seine Widerrufserklaerung ueber
 * eine Funktion auf der Online-Benutzeroberflaeche abgeben kann, beschriftet
 * mit „Vertrag widerrufen", waehrend des Fristlaufs staendig verfuegbar und
 * hervorgehoben platziert. Absatz 2 zaehlt auf, was sie entgegennehmen muss:
 * Name, Angaben zur Identifizierung des Vertrags und das Kommunikationsmittel
 * fuer die Eingangsbestaetigung. Genau diese drei Felder stehen hier, und kein
 * viertes.
 *
 * ── Was hier absichtlich NICHT verlangt wird ────────────────────────────────
 * Kein Bestellnachweis, kein Konto, kein Vorgangslink und kein Pflichtfeld
 * fuer die Bestelladresse. Absatz 2 Nr. 2 verlangt, dass der Verbraucher
 * identifizierende Angaben „ohne Weiteres" machen ODER BESTAETIGEN kann — er
 * schreibt kein Feldformat vor. Wer ueber eine fremde Adresse bestellt hat,
 * sich vertippt oder die Bestellmail nie bekommen hat, darf von seinem
 * Widerrufsrecht nicht ausgesperrt werden. Ausgerechnet der, dessen Mail nie
 * ankam, faende einen Vorgangslink nicht.
 *
 * ── Zwei Schritte, und der zweite liegt beim Dienst ─────────────────────────
 * Dieses Formular ist Stufe eins. Der Knopf „Widerruf bestaetigen" nach
 * Absatz 3 steht auf der Seite, die der Auslieferungsdienst danach liefert:
 * Er kennt die eben eingegebenen Daten, diese vorgerenderte Seite kann sie
 * ohne JavaScript nicht kennen. Erklaert ist der Widerruf erst mit jenem
 * zweiten Knopf.
 *
 * Ein echtes HTML-Formular, absendbar ohne JavaScript. Eine Rechtsausuebung
 * darf nicht daran haengen, dass ein Skript geladen hat.
 */
export default function WiderrufErklaeren() {
  // Nur gelesen, nie geschrieben: unter dem statischen Router beim Vorrendern
  // waere ein Schreiben gar nicht moeglich, und noetig ist es auch nicht.
  const [suchParameter] = useSearchParams();
  const [formfehler, setFormfehler] = useState<Formfehler | null>(null);

  /* Auswertung erst nach dem Einhaengen. Wuerde die Kennung schon beim
     Rendern gelesen, unterschiede sich die erste Darstellung im Browser von
     der vorgerenderten Fassung — eine Hydrations-Differenz. Die Zeit bis
     hierher traegt die Vorab-Schicht; sie weicht mit derselben Bewegung, mit
     der React die Anzeige uebernimmt. */
  useEffect(() => {
    vorabSchichtAusblenden();
    setFormfehler(formfehlerLesen(suchParameter.get('fehler')));
  }, [suchParameter]);

  return (
    <>
      <Seo
        path={WIDERRUF_FUNKTION_PFAD}
        title={`${WIDERRUF_FUNKTION_LABEL} — Rho-Labs`}
        description="Widerrufsfunktion nach § 356a BGB: Ihren Vertrag mit Rho-Labs online widerrufen, in zwei Schritten, ohne Begründung. Die Eingangsbestätigung mit Datum und Uhrzeit kommt per E-Mail."
      />

      <div className="wrap wrap--form section">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Widerruf
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          {WIDERRUF_FUNKTION_LABEL}
        </h1>
        <p className="lede" style={{ marginBottom: 32 }}>
          Hier widerrufen Sie Ihren Vertrag mit Rho-Labs online. Sie brauchen
          dafür keine Begründung und keinen Bestellnachweis.
        </p>

        <div className="form-card">
          <h2>In zwei Schritten</h2>
          <p className="form-card__lede">
            Sie machen hier drei Angaben. Danach sehen Sie diese Angaben noch
            einmal und bestätigen den Widerruf mit einem zweiten Knopf. Erst
            dieser zweite Knopf erklärt den Widerruf. Anschließend senden wir
            Ihnen unverzüglich eine Eingangsbestätigung mit Datum und Uhrzeit
            des Eingangs — auf diese Uhrzeit kommt es für die Frist an
            (§ 356a Absatz 5 BGB).
          </p>

          {/* Die Vorab-Schicht: dieselben Hinweise, vorgerendert und
              verborgen, sichtbar gemacht vom Skript unter dem Formular. Sie
              traegt die Zeit bis zum Einhaengen und den Fall, dass das Buendel
              gar nicht laedt. */}
          <div
            className="rueckwege"
            dangerouslySetInnerHTML={{ __html: RUECKWEG_HTML }}
          />

          {/* Und die Fassung, die React verantwortet, sobald es uebernommen
              hat. Zwei Schichten, nie beide zugleich sichtbar. */}
          {formfehler && (
            <div className="callout" style={{ marginBottom: 24 }}>
              <p>{FORMFEHLER_TEXT[formfehler]}</p>
            </div>
          )}

          <form method="post" action={WIDERRUF_FORM_ACTION} className="form">
            <noscript>
              <div className="callout">
                <p>
                  Der Widerruf funktioniert auch ohne JavaScript. Was ohne
                  JavaScript nicht geht, ist die Rückmeldung: Weist der Dienst
                  Ihre Angaben zurück, schickt er Sie auf dieses Formular
                  zurück, und diese Seite kann Ihnen dann nicht anzeigen,
                  warum. <strong>Sehen Sie das leere Formular nach dem
                  Absenden erneut, ist Ihre Erklärung nicht angekommen.</strong>{' '}
                  Der Grund ist fast immer einer von zweien: Eine der drei
                  Angaben fehlte oder war unvollständig — oder von Ihrem
                  Anschluss kamen zu viele Anfragen, dann hilft eine Stunde
                  Abstand. Eilt es, erklären Sie den Widerruf formlos per
                  E-Mail an{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — das
                  wahrt die Frist ebenso, und wir bestätigen Ihnen den Eingang.
                </p>
              </div>
            </noscript>

            {/* § 356a Abs. 2 Nr. 1 — der Name des Verbrauchers. */}
            <div className="field">
              <label htmlFor="widerruf-name">Ihr Name</label>
              <input
                id="widerruf-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                maxLength={80}
                placeholder="Vor- und Nachname"
              />
            </div>

            {/* § 356a Abs. 2 Nr. 2 — Freitext, bewusst ohne Formatvorgabe und
                ohne Mindestlaenge. Der Hinweis sagt, was uns hilft; er
                verlangt nichts davon. */}
            <div className="field">
              <label htmlFor="widerruf-vertrag">
                Angaben zum Vertrag{' '}
                <span className="field__hint">— was Sie noch wissen, genügt</span>
              </label>
              <textarea
                id="widerruf-vertrag"
                name="vertragsangaben"
                required
                rows={4}
                maxLength={2000}
                placeholder="Zum Beispiel: die E-Mail-Adresse aus der Bestellung, das ungefähre Datum, der Betrag (39,90 € oder 35,90 €) oder die Rechnungsnummer."
              />
            </div>

            {/* § 356a Abs. 2 Nr. 3 — das elektronische Kommunikationsmittel,
                an das die Eingangsbestaetigung geht. */}
            <div className="field">
              <label htmlFor="widerruf-email">
                E-Mail-Adresse für die Eingangsbestätigung
              </label>
              <input
                id="widerruf-email"
                type="email"
                name="bestaetigung_an"
                required
                autoComplete="email"
                maxLength={120}
                placeholder="name@beispiel.de"
              />
            </div>

            {/* Honigtopf. Fuer Menschen unsichtbar, fuer Bots verlockend — ist
                das Feld gefuellt, verwirft der Dienst die Anfrage. */}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="widerruf-webseite">Webseite</label>
              <input
                id="widerruf-webseite"
                type="text"
                name="webseite"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <button type="submit" className="form__submit">
              Weiter zur Bestätigung
            </button>
          </form>

          {/* Synchron, unmittelbar hinter den Kaesten und dem Formular: Es
              laeuft, waehrend der Browser die Seite liest — also lange bevor
              das Buendel geladen und React eingehaengt ist. Ein Leser, den der
              Dienst zurueckgeschickt hat, sieht den Grund damit sofort und
              nicht erst nach der Hydration. */}
          <script dangerouslySetInnerHTML={{ __html: RUECKWEG_SKRIPT }} />

          <p className="form__note">
            Mit „Weiter zur Bestätigung“ ist noch nichts widerrufen. Sie sehen
            Ihre Angaben im nächsten Schritt noch einmal und können sie ändern.
          </p>
        </div>

        <div className="grid grid--auto-300" style={{ marginTop: 32 }}>
          <div className="callout">
            <h4>
              <Info size={15} aria-hidden="true" /> Es geht auch formlos
            </h4>
            <p>
              Dieses Formular ist ein Weg, nicht der einzige. Eine eindeutige
              Erklärung per E-Mail an{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> oder ein
              Brief genügt ebenso. Einzelheiten und das Muster-Widerrufsformular
              stehen in der <Link to="/widerruf">Widerrufsbelehrung</Link>.
            </p>
          </div>

          <div className="callout">
            <h4>
              <Info size={15} aria-hidden="true" /> Was mit Ihren Angaben geschieht
            </h4>
            <p>
              Wir speichern sie, um Ihren Widerruf zu bearbeiten und seinen
              Eingang nachzuweisen. Eine Rückzahlung weisen wir gesondert an,
              über dasselbe Zahlungsmittel. Näheres in der{' '}
              <Link to="/datenschutz">Datenschutzerklärung</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
