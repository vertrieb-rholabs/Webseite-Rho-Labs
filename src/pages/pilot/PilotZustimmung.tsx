import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { Head } from 'vite-react-ssg';
import Seo from '../../components/Seo';
import {
  CONTACT_EMAIL,
  PILOT_ZUSTIMMUNG_ACTION,
  PILOT_ZUSTIMMUNG_INFO_URL,
} from '../../constants';
import { PILOT_FASSUNG } from '../../pilotbedingungen';

/* ── Diese Seite trägt einen Einmal-Link ─────────────────────────────────────
   Der Link in der E-Mail an die Ansprechperson lautet
   `/pilotpartner/zustimmung?t=<Token>`. Der Token ist ein Geheimnis: Wer ihn
   hat, kann die Pilotbedingungen für den Träger annehmen. Deshalb:

     - `<meta name="referrer" content="no-referrer">` auf dieser Seite, und
       `referrerPolicy="no-referrer"` an jeder Anfrage und an jedem Link, der
       von hier abgeht. Der Token verlässt die Seite weder als Referer noch in
       einer anderen Adresse.
     - Der Token wird nirgends protokolliert: kein `console.*`, kein Speicher
       (kein `localStorage`, kein Cookie), keine Fehlermeldung, die ihn nennt.
     - Er geht genau zweimal an den Dienst: als `t` in der Abfrage der Anzeige
       (`GET …/zustimmung/info`) und als verstecktes Feld `t` im Formular
       (`POST …/zustimmung`), also im Rumpf und nicht in der Adresse.
     - Er wird vor der Verwendung auf Form und Länge geprüft (nur
       `A–Z a–z 0–9 _ -`, höchstens 128 Zeichen), damit die Seite nichts
       Fremdes weiterreicht.
   Die Seite trägt `noindex`.

   ── Was die Seite weiß, und was nicht ───────────────────────────────────────
   Vorgerendert kennt sie keinen Token und kein Angebot. Ohne JavaScript steht
   deshalb nur ein Hinweis da — Formular und Angebot erscheinen erst, wenn der
   Dienst die Anzeige bestätigt hat. Das ist Absicht: Ein Formular, das ein
   Angebot nicht zeigen kann, soll nicht absendbar sein; der Vertrag kommt erst
   mit der Annahme eines Angebots zustande, das die Person gesehen hat.
   -------------------------------------------------------------------------- */

type Angebot = {
  einrichtung: string;
  geplanterStart: string;
  letzterTag: string;
  geraete: number;
};

type Zustand =
  | { art: 'start' }
  | { art: 'laden' }
  | { art: 'ungueltig' }
  | { art: 'fassung' }
  | { art: 'nichtgeladen' }
  | { art: 'bereit'; token: string; angebot: Angebot };

const TOKEN_MUSTER = /^[A-Za-z0-9_-]{1,128}$/;
const DATUM_MUSTER = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `2026-11-02` → `02.11.2026`; alles andere → `null`. */
function datumAnzeigen(iso: unknown): string | null {
  if (typeof iso !== 'string') return null;
  const t = DATUM_MUSTER.exec(iso);
  if (!t) return null;
  return `${t[3]}.${t[2]}.${t[1]}`;
}

/** Start + 41 Tage (letzter Nutzungstag), falls der Dienst ihn nicht mitliefert. */
function letzterNutzungstag(startIso: string): string | null {
  const t = DATUM_MUSTER.exec(startIso);
  if (!t) return null;
  const d = new Date(Date.UTC(Number(t[1]), Number(t[2]) - 1, Number(t[3])));
  d.setUTCDate(d.getUTCDate() + 41);
  return d.toISOString().slice(0, 10);
}

/** Aus der Antwort des Dienstes ein Angebot — oder `null`, wenn etwas nicht stimmt. */
function angebotLesen(daten: unknown): { angebot: Angebot; fassung: string | null } | null {
  if (!daten || typeof daten !== 'object') return null;
  const d = daten as Record<string, unknown>;
  if (d.gueltig !== true) return null;
  if (typeof d.einrichtung !== 'string' || d.einrichtung.trim() === '') return null;
  const start = datumAnzeigen(d.geplanter_start);
  const startIso = d.geplanter_start as string;
  if (!start) return null;
  const ende = datumAnzeigen(d.letzter_nutzungstag) ?? datumAnzeigen(letzterNutzungstag(startIso));
  if (!ende) return null;
  const geraete = Number(d.geraete);
  if (!Number.isInteger(geraete) || geraete < 1 || geraete > 3) return null;
  return {
    angebot: { einrichtung: d.einrichtung, geplanterStart: start, letzterTag: ende, geraete },
    fassung: typeof d.fassung === 'string' ? d.fassung : null,
  };
}

/**
 * Die Seite, auf der der Vertrag des Pilotprogramms zustande kommt.
 *
 * Sie liest `?t=`, holt vom Dienst das Angebot (Einrichtung, geplanter Start,
 * letzter Nutzungstag, Zahl der Geräte, Fassung) und zeigt es zusammen mit den
 * Formularfeldern: rechtlicher Träger, Anschrift, Name und Funktion der
 * zustimmenden Person und drei Bestätigungen. Erst „Pilotbedingungen annehmen“
 * schließt den Vertrag (§ 312i BGB, Art. 246c EGBGB; Text nach T1). Das
 * Formular geht als klassischer POST an den Dienst, der mit 303 auf
 * `/pilotpartner/zustimmung/fertig` oder `…/fehler?grund=…` zurückleitet.
 */
export default function PilotZustimmung() {
  const [suchParameter] = useSearchParams();
  const [zustand, setZustand] = useState<Zustand>({ art: 'start' });
  const token = suchParameter.get('t');

  useEffect(() => {
    if (token === null || !TOKEN_MUSTER.test(token)) {
      setZustand({ art: 'ungueltig' });
      return undefined;
    }

    const abbruch = new AbortController();
    let beendet = false;
    const frist = window.setTimeout(() => abbruch.abort(), 10000);
    setZustand({ art: 'laden' });

    const laden = async () => {
      try {
        const antwort = await fetch(`${PILOT_ZUSTIMMUNG_INFO_URL}?t=${encodeURIComponent(token)}`, {
          method: 'GET',
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
          signal: abbruch.signal,
        });
        if (beendet) return;
        // 429 trägt `{ gueltig: false }` — hier aber ist der Link nicht
        // ungültig, sondern die Anzeige gerade nicht abrufbar.
        if (antwort.status === 429) {
          setZustand({ art: 'nichtgeladen' });
          return;
        }
        const daten: unknown = await antwort.json();
        if (beendet) return;
        const gelesen = angebotLesen(daten);
        if (!gelesen) {
          setZustand({ art: 'ungueltig' });
        } else if (gelesen.fassung !== null && gelesen.fassung !== PILOT_FASSUNG) {
          setZustand({ art: 'fassung' });
        } else {
          setZustand({ art: 'bereit', token, angebot: gelesen.angebot });
        }
      } catch {
        // Kein Protokoll: nichts, was den Token enthalten könnte.
        if (!beendet) setZustand({ art: 'nichtgeladen' });
      } finally {
        window.clearTimeout(frist);
      }
    };
    void laden();

    return () => {
      beendet = true;
      window.clearTimeout(frist);
      abbruch.abort();
    };
  }, [token]);

  return (
    <>
      <Seo
        path="/pilotpartner/zustimmung"
        title="Pilotbedingungen bestätigen — Rho-Labs"
        description="Pilotbedingungen für das Pilotprogramm von Rho-Labs bestätigen."
        noindex
      />
      {/* Der Einmal-Link steht in der Adresszeile: kein Referer an irgendeine
          Anfrage, die diese Seite auslöst. */}
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>

      <div className="wrap wrap--form section">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Pilotprogramm
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 24 }}>
          Pilotbedingungen bestätigen
        </h1>

        <noscript>
          <div className="callout">
            <p>Bitte aktivieren Sie JavaScript oder antworten Sie auf unsere E-Mail.</p>
          </div>
        </noscript>

        {zustand.art === 'laden' && (
          <p className="lede" role="status">
            Ihr Angebot wird geladen …
          </p>
        )}

        {zustand.art === 'ungueltig' && (
          <div className="callout" role="alert">
            <p>
              Dieser Link ist nicht mehr gültig. Bitte schreiben Sie uns an{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        )}

        {zustand.art === 'fassung' && (
          <div className="callout" role="alert">
            <p>
              Die Pilotbedingungen wurden inzwischen aktualisiert. Bitte öffnen Sie den Link aus
              unserer E-Mail erneut. Bei Fragen schreiben Sie an{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        )}

        {zustand.art === 'nichtgeladen' && (
          <div className="callout" role="alert">
            <p>
              Ihr Angebot konnte gerade nicht geladen werden. Bitte laden Sie die Seite später neu
              oder schreiben Sie an <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        )}

        {zustand.art === 'bereit' && <Angebotsformular zustand={zustand} />}
      </div>
    </>
  );
}

function Angebotsformular({ zustand }: { zustand: Extract<Zustand, { art: 'bereit' }> }) {
  const { angebot, token } = zustand;

  return (
    <>
      <p className="lede" style={{ marginBottom: 24 }}>
        Das ist Ihr Angebot zur Teilnahme am Pilotprogramm. Prüfen Sie die Angaben und lesen Sie die
        Pilotbedingungen, bevor Sie sie annehmen.
      </p>

      {/* Das Angebot, wie der Dienst es hält. */}
      <dl className="angebot">
        <div className="angebot__wide">
          <dt>Einrichtung</dt>
          <dd>{angebot.einrichtung}</dd>
        </div>
        <div>
          <dt>Geplanter Pilotstart</dt>
          <dd>{angebot.geplanterStart}</dd>
        </div>
        <div>
          <dt>Letzter Nutzungstag</dt>
          <dd>{angebot.letzterTag}</dd>
        </div>
        <div>
          <dt>Geräte</dt>
          <dd>{angebot.geraete}</dd>
        </div>
        <div>
          <dt>Fassung</dt>
          <dd>{PILOT_FASSUNG}</dd>
        </div>
      </dl>
      <p className="note" style={{ display: 'block', margin: '-8px 0 24px' }}>
        Der Pilotstart ist der erste Nutzungstag; der Pilotzeitraum umfasst 42 Kalendertage.
      </p>

      <p style={{ marginBottom: 28 }}>
        <a
          href="/pilotbedingungen"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="link-arrow"
        >
          Pilotbedingungen lesen
          <span className="sr-only"> (öffnet in neuem Tab)</span>
        </a>
      </p>

      <div className="info-card info-card--cyan" style={{ marginBottom: 20 }}>
        <h3>
          <Check size={17} aria-hidden="true" /> Das Wichtigste in Kürze
        </h3>
        <ul className="plain-list" style={{ color: '#cbd5e1' }}>
          <li>
            Die Teilnahme ist kostenlos, dauert 42 Tage ab dem Pilotstart und endet automatisch. Es
            besteht keine Kaufverpflichtung.
          </li>
          <li>
            Ihre Daten bleiben auf Ihren Geräten. Sie lassen sich auch nach dem Pilot ansehen,
            exportieren und löschen.
          </li>
          <li>Daten betreuter Personen übermitteln Sie nicht an Rho-Labs.</li>
          <li>Referenzen gibt es nur freiwillig und erst nach dem Pilot.</li>
        </ul>
      </div>

      {/* Hinweis zum Vertragsschluss (§ 312i BGB, Art. 246c EGBGB). */}
      <div className="callout" style={{ marginBottom: 28 }}>
        <h4>
          <Info size={15} aria-hidden="true" /> So kommt der Vertrag zustande
        </h4>
        <p>
          Der Vertrag entsteht, wenn Sie auf „Pilotbedingungen annehmen“ klicken. Ihre Eingaben
          können Sie vorher im Formular ändern. Vertragssprache ist Deutsch. Wir speichern den
          Vertragstext mit den Angaben dieses Angebots und senden Ihnen eine Abschrift per E-Mail.
        </p>
      </div>

      <div className="form-card">
        <form method="post" action={PILOT_ZUSTIMMUNG_ACTION} className="form">
          {/* Der Token geht im Rumpf mit, nicht in der Adresse. */}
          <input type="hidden" name="t" value={token} />
          <input type="hidden" name="fassung" value={PILOT_FASSUNG} />

          <p className="form__required">Alle Felder außer der letzten Option sind Pflichtfelder.</p>

          <div className="field">
            <label htmlFor="zustimmung-traeger">Rechtlicher Träger</label>
            <input
              id="zustimmung-traeger"
              type="text"
              name="traeger"
              required
              minLength={2}
              maxLength={200}
              autoComplete="organization"
              aria-describedby="zustimmung-traeger-hinweis"
            />
            <p className="field__help" id="zustimmung-traeger-hinweis">
              z. B. Name der Inhaberin oder des Inhabers der Praxis, Name der GmbH, des Vereins oder
              der Kommune
            </p>
          </div>

          <div className="field">
            <label htmlFor="zustimmung-anschrift">Anschrift des Trägers</label>
            <textarea
              id="zustimmung-anschrift"
              name="anschrift"
              required
              rows={3}
              minLength={5}
              maxLength={300}
              autoComplete="street-address"
            />
          </div>

          <div className="field">
            <label htmlFor="zustimmung-name">Ihr Name</label>
            <input
              id="zustimmung-name"
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="zustimmung-funktion">Ihre Funktion</label>
            <input
              id="zustimmung-funktion"
              type="text"
              name="funktion"
              required
              minLength={2}
              maxLength={100}
              autoComplete="organization-title"
              aria-describedby="zustimmung-funktion-hinweis"
            />
            <p className="field__help" id="zustimmung-funktion-hinweis">
              z. B. Inhaberin, Leitung, Geschäftsführung
            </p>
          </div>

          <label className="check">
            <input type="checkbox" name="bedingungen" value="ja" required />
            <span>
              Ich habe die Pilotbedingungen (Fassung {PILOT_FASSUNG}) gelesen und nehme sie für den
              oben genannten Träger an.
            </span>
          </label>

          <label className="check">
            <input type="checkbox" name="befugnis" value="ja" required />
            <span>Ich bin berechtigt, für diesen Träger zu handeln.</span>
          </label>

          <label className="check">
            <input type="checkbox" name="unternehmer" value="ja" required />
            <span>
              Der Träger handelt in seiner gewerblichen oder selbständigen beruflichen Tätigkeit
              oder als öffentliche Stelle, nicht als Verbraucher.
            </span>
          </label>

          {/* Freiwillig und abgesetzt: die Teilnahme hängt nicht daran. */}
          <label className="check consent--optional">
            <input type="checkbox" name="feedback_mails" value="ja" />
            <span>
              Ich möchte während des Pilotzeitraums höchstens einmal wöchentlich eine E-Mail mit
              Fragen zur Bedienung und Organisation erhalten. Ich kann das jederzeit abbestellen;
              die Teilnahme bleibt davon unberührt.
              <span className="check__aside">Freiwillig — Kein Pflichtfeld.</span>
            </span>
          </label>

          <button type="submit" className="form__submit">
            Pilotbedingungen annehmen
          </button>
        </form>
      </div>
    </>
  );
}
