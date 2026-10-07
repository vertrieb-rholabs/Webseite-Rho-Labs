import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import StatusPage from '../demo/StatusPage';
import { CONTACT_EMAIL } from '../../constants';
import { rueckwegKasten, rueckwegSkript, vorabSchichtAusblenden } from '../../rueckwege';

/* ── Grund-Kennung des Auslieferungsdienstes ───────────────────────────────
   Scheitert die Zustimmung, leitet der Dienst auf
   `/pilotpartner/zustimmung/fehler?grund=<kennung>` — und schreibt den Token
   NICHT in die Weiterleitung. Die Kennungen sind fest:

     abgelaufen  — Link unbekannt, abgelaufen oder schon verwendet
     fassung     — die Pilotbedingungen wurden inzwischen aktualisiert
     eingabe     — Angaben fehlen oder die drei Bestätigungen sind nicht gesetzt
     zu_viele    — Ratengrenze
     intern      — Fehler im Dienst

   Alles andere wird ignoriert; der Wert gelangt nie in die Seite, nur in einen
   Vergleich. Gelesen wird zweimal wie bei den anderen Rückwegen: vorgerendert
   und verborgen, vom synchronen Skript sichtbar gemacht, danach von React
   (`src/rueckwege.ts`). Die Texte sind die aus T1 Abschnitt 3; die
   Kontaktadresse steht bei jedem darunter.
   -------------------------------------------------------------------------- */
type Grund = 'abgelaufen' | 'fassung' | 'eingabe' | 'zu_viele' | 'intern';

export const GRUND_TEXT: Record<Grund, string> = {
  abgelaufen: 'Dieser Link ist abgelaufen oder wurde bereits verwendet.',
  fassung:
    'Die Pilotbedingungen wurden inzwischen aktualisiert. Bitte öffnen Sie den Link aus unserer E-Mail erneut.',
  eingabe: 'Bitte füllen Sie alle Felder aus und bestätigen Sie alle drei Punkte.',
  zu_viele: 'Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.',
  intern:
    'Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an info@rholabs.de.',
};

function grundLesen(wert: string | null): Grund | null {
  if (
    wert === 'abgelaufen' ||
    wert === 'fassung' ||
    wert === 'eingabe' ||
    wert === 'zu_viele' ||
    wert === 'intern'
  ) {
    return wert;
  }
  return null;
}

const GRUND_KENNUNGEN = Object.keys(GRUND_TEXT).filter((kennung) => grundLesen(kennung) !== null);

const RUECKWEG_HTML = GRUND_KENNUNGEN.map((kennung) =>
  rueckwegKasten(kennung, GRUND_TEXT[kennung as Grund]),
).join('');

const RUECKWEG_SKRIPT = rueckwegSkript([{ parameter: 'grund', werte: GRUND_KENNUNGEN }]);

/**
 * Ziel, wenn die Zustimmung nicht zustande kam (`zielZustimmungFehler` im
 * Dienst). `noindex` kommt aus `StatusPage`.
 *
 * Der Grundtext sagt nur, was in jedem Fall stimmt: Mit diesem Link ließ sich
 * die Bestätigung nicht abschließen. Der Grund steht darunter, sobald die
 * Kennung bekannt ist. Auf dieser Seite steht kein Token und es geht keiner
 * in einen Link.
 */
export default function PilotZustimmungFehler() {
  const [suchParameter] = useSearchParams();
  const [grund, setGrund] = useState<Grund | null>(null);
  const grundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    vorabSchichtAusblenden();
    setGrund(grundLesen(suchParameter.get('grund')));
  }, [suchParameter]);

  useEffect(() => {
    if (grund) grundRef.current?.focus();
  }, [grund]);

  return (
    <StatusPage
      path="/pilotpartner/zustimmung/fehler/"
      title="Bestätigung nicht abgeschlossen"
      tone="amber"
      icon={<AlertCircle size={24} />}
      body="Mit diesem Link ließ sich die Bestätigung der Pilotbedingungen nicht abschließen."
      extra={
        <>
          {/* Vorab-Schicht: vorgerendert und verborgen; das Skript deckt den
              passenden Kasten auf, noch bevor React da ist. */}
          <div
            className="rueckwege"
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: RUECKWEG_HTML }}
          />
          <script dangerouslySetInnerHTML={{ __html: RUECKWEG_SKRIPT }} />

          {/* Die Fassung, die React verantwortet, sobald es übernommen hat. */}
          <div aria-live="polite">
            {grund && (
              <div className="callout" style={{ marginBottom: 12 }} tabIndex={-1} ref={grundRef}>
                <p>{GRUND_TEXT[grund]}</p>
              </div>
            )}
          </div>
        </>
      }
      note={
        <>
          Ist der Link aus unserer E-Mail noch gültig, können Sie ihn erneut öffnen und es noch
          einmal versuchen. Sonst schreiben Sie uns an{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </>
      }
      action={null}
    />
  );
}
