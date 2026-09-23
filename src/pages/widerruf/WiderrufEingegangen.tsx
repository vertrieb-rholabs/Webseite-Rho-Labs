import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import StatusPage from '../demo/StatusPage';
import {
  CONTACT_EMAIL,
  WIDERRUF_FUNKTION_LABEL,
  WIDERRUF_FUNKTION_PFAD,
} from '../../constants';

/**
 * Ziel des Dienstes, nachdem der Widerruf eingegangen UND die
 * Eingangsbestaetigung versandt ist (§ 356a Abs. 4 BGB).
 *
 * ── Diese Seite sagt nur, was sie weiss ─────────────────────────────────────
 * Sie ist vorgerendert, statisch und oeffentlich. Sie kennt den einzelnen
 * Vorgang nicht — nicht den Namen, nicht den Zeitpunkt, nicht einmal, ob
 * ueberhaupt etwas eingegangen ist. Also behauptet sie nichts davon. Es gibt
 * genau eine Fassung; sie ist mit und ohne JavaScript dieselbe.
 *
 * ── Was hier bis zum 22.09.2026 stand, in zwei Stufen ───────────────────────
 * ERSTE FASSUNG: „Ihr Widerruf ist eingegangen", ohne Vorbehalt, fuer jeden,
 * der die Adresse eintippte. Bei einer fristgebundenen Rechtsausuebung ist das
 * der gefaehrlichste Satz, den eine Seite sagen kann, die nichts weiss: Der
 * Leser haelt den Widerruf fuer erklaert und tut nichts mehr, waehrend beim
 * Dienst nie etwas ankam.
 *
 * ZWEITE FASSUNG: derselbe Satz, aber nur noch bei einem „Nachweis" — entweder
 * `?eingang=bestaetigt` in der Adresszeile oder ein `document.referrer` vom
 * Ursprung des Dienstes. Beides war KEIN Nachweis, und zwar nachgemessen
 * (`scripts/ablauf.test.mjs`, Tests 1 bis 3):
 *
 *   `?eingang=bestaetigt` ist eine oeffentlich bekannte, feste Zeichenfolge.
 *   Jeder kann sie eintippen oder verlinken. Der Erfolgssatz war damit wieder
 *   frei ausloesbar — derselbe Fehler wie in der ersten Fassung, nur mit einem
 *   Anhaengsel davor.
 *
 *   `document.referrer` ist ebenso wenig an einen Vorgang gebunden: Er traegt
 *   den Ursprung der VORSEITE. Jede beliebige Seite unter dem Rechnernamen des
 *   Dienstes haette den Satz ausgeloest. Auf dem ECHTEN Weg dagegen ist er
 *   leer: Die Pruefen-Seite des Dienstes setzt `Referrer-Policy: no-referrer`,
 *   der zweite Schritt ist eine Formularsendung, und der anschliessende 303
 *   traegt den Referrer der urspruenglichen Anfrage weiter — also keinen. Der
 *   Weg war somit fuer den Faelscher offen und fuer den echten Absender
 *   geschlossen.
 *
 * ── Warum hier kein dritter Anlauf steht ────────────────────────────────────
 * Ein nicht erratbarer, vom Dienst ausgestellter Wert in der Adresszeile waere
 * faelschungssicher, aber er brauchte eine oeffentliche Auskunftsstelle beim
 * Dienst („gilt dieser Wert?"), legte eine Berechtigung in die Adresszeile, in
 * den Verlauf und in jeden Bildschirmabzug — und truege ohne JavaScript immer
 * noch nichts. Die vorgerenderte Fassung muesste also OHNEHIN diese hier
 * bleiben. Aufwand und neue Angriffsflaeche fuer einen Satz, den eine Seite
 * ohne Kenntnis des Vorgangs nicht zu sagen braucht.
 *
 * Wer den Vorgang kennt, ist der Dienst. Er hat die Seite dazu bereits:
 * `seiteEingegangen()` in `widerruf.ts` nennt den tatsaechlichen Zeitpunkt des
 * Eingangs aus der Datenbank und wird heute schon ausgeliefert, wenn der
 * Mailversand fehlschlaegt. Die richtige Stelle fuer den Erfolgssatz ist also
 * dort, nicht hier. Was der Dienst dafuer tun muesste, steht im Bericht zu
 * dieser Runde. Diese Seite wartet nicht darauf: Sie bleibt das Ziel des 303,
 * sie bleibt vorgerendert, und sie ist so, wie sie hier steht, in jedem Fall
 * wahr — vor und nach einer Aenderung am Dienst.
 *
 * ── Warum hier keine Uhrzeit steht ──────────────────────────────────────────
 * Aus demselben Grund. Massgeblich ist nach § 356a Abs. 5 der Zeitpunkt des
 * Eingangs; der steht in der Eingangsbestaetigung, und die ist der dauerhafte
 * Datentraeger, den Absatz 4 verlangt.
 *
 * Und sie sagt in keinem Fall, das Geld sei zurueck: die Rueckzahlung weist
 * der Inhaber gesondert an.
 */
export default function WiderrufEingegangen() {
  return (
    <StatusPage
      path="/vertrag-widerrufen/eingegangen/"
      title="Wenn Ihr Widerruf durchgelaufen ist"
      tone="amber"
      icon={<Mail size={24} />}
      body="Diese Seite kennt Ihren Vorgang nicht; von sich aus bestätigt sie keinen Eingang. Ist Ihre Erklärung bei uns angekommen, geht darüber unverzüglich eine Eingangsbestätigung an die E-Mail-Adresse, die Sie angegeben haben — mit dem Inhalt Ihrer Erklärung sowie dem Datum und der Uhrzeit des Eingangs. Diese E-Mail ist der Nachweis. Für die Frist kommt es auf den dort genannten Zeitpunkt an, nicht auf diese Seite und nicht darauf, wann Sie die E-Mail lesen."
      note={
        <>
          Bleibt die Bestätigung aus — auch im Spam-Ordner —, gehen Sie bitte
          davon aus, dass Ihre Erklärung uns nicht erreicht hat, und erklären
          Sie den Widerruf noch einmal: über{' '}
          <Link to={WIDERRUF_FUNKTION_PFAD}>{WIDERRUF_FUNKTION_LABEL}</Link>{' '}
          oder formlos per E-Mail an{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Eine
          Rückzahlung weisen wir in jedem Fall gesondert an, über dasselbe
          Zahlungsmittel — mit dieser Seite ist sie noch nicht ausgeführt.
        </>
      }
      action={
        <div className="btn-row btn-row--center">
          <Link to={WIDERRUF_FUNKTION_PFAD} className="btn btn--primary">
            {WIDERRUF_FUNKTION_LABEL}
          </Link>
          <Link to="/kontakt" className="btn btn--ghost">
            Kontakt
          </Link>
          <Link to="/widerruf" className="btn btn--ghost">
            Widerrufsbelehrung
          </Link>
        </div>
      }
    />
  );
}
