import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import StatusPage from './StatusPage';
import { CONTACT_EMAIL } from '../../constants';

/**
 * Ziel nach dem Absenden des Formulars (ZIEL_ANGEFRAGT).
 *
 * ── Diese Seite sagt nur, was sie weiss ─────────────────────────────────────
 * Sie ist vorgerendert, statisch und oeffentlich. Sie kennt die einzelne
 * Anfrage nicht — nicht die Adresse, nicht den Ausgang, nicht einmal, ob
 * ueberhaupt etwas abgesendet wurde. Also behauptet sie nichts davon.
 *
 * ── Was hier bis zum 22.09.2026 stand ───────────────────────────────────────
 * „Wir haben dir eine E-Mail geschickt." Ohne Vorbehalt, fuer jeden, der hier
 * ankam. Der Dienst leitet aber auf GENAU DIESE Seite weiter, sobald
 * `/demo/anfordern` erreicht ist — aus sieben Ausgaengen, und nur EINER davon
 * hat eine Mail abgeschickt (`demo.ts:178-253`, alle ueber denselben
 * Abschluss `antworten()` in Zeile 184):
 *
 *   1. Honigtopf-Feld ausgefuellt (187-190)         — keine Mail
 *   2. Adresse unzulaessig oder vertippt (193-197)  — keine Mail
 *   3. Ratenbegrenzung, je IP oder gesamt (200-203) — keine Mail
 *   4. Diese Adresse hatte im letzten Jahr schon eine Demo (208-216)
 *                                                   — keine Mail
 *   5. Es liegt schon eine offene Bestaetigung vor (219-227) — keine NEUE
 *      Mail; die aeltere gilt noch, laengstens 24 Stunden
 *   6. Alles in Ordnung (230-247)                   — Mail abgeschickt
 *   7. Ausnahme, auch ein SMTP-Fehler (248-251)     — Mail nicht abgeschickt
 *
 * Fuer den Besucher sah jeder dieser Ausgaenge nach erfolgreichem Versand aus.
 * Wer nichts bekam, suchte im Spam-Ordner und wartete — statt es noch einmal
 * zu versuchen oder sich zu melden.
 *
 * Dasselbe Muster wie auf der Widerrufs-Ergebnisseite, und derselbe Weg
 * heraus: Der Erfolgssatz ist ersatzlos gestrichen. Es steht jetzt da, was die
 * Seite wirklich weiss, und daneben der Weg fuer den Fall, dass nichts ankommt.
 *
 * ── Und was hier mit Absicht NICHT geloest wird ─────────────────────────────
 * Dass alle sieben Ausgaenge gleich aussehen, ist kein Versehen des Dienstes,
 * sondern eine Schutzmassnahme (`demo.ts`, Kopf, Punkt 5): Unterschiede in der
 * Antwort verrieten ueber ein oeffentliches Formular, ob zu einer fremden
 * Adresse schon eine Demo existiert — also wer Kunde ist. Jeder Zweig, der
 * hier den Ausgang anzeigte, waere genau dieses Leck; auch einer, der sich den
 * Ausgang vom Dienst mitteilen liesse.
 *
 * Deshalb: EIN Text, fuer alle derselbe, ohne Anhaengsel in der Adresszeile,
 * ohne `document.referrer`, ohne Nachfrage beim Dienst. Mit und ohne
 * JavaScript dieselbe Fassung. `scripts/befunde.test.mjs` (Test 15) haelt
 * beides zusammen: den fehlenden Erfolgssatz UND die Gleichheit der Antwort —
 * und schlaegt an, wenn der Dienst die Ausgaenge auseinanderzuziehen beginnt.
 *
 * Die Gruende beim Namen zu nennen, waere dagegen KEIN Leck: Der Text ist fuer
 * jeden Besucher derselbe, er unterscheidet nichts. Er tut es trotzdem nicht —
 * eine Liste moeglicher Fehlschlaege hilft niemandem weiter. Was hilft, ist
 * der naechste Schritt, und der ist fuer alle sieben Ausgaenge derselbe: noch
 * einmal anfordern, und wenn auch das nichts bringt, uns schreiben. Der zweite
 * Halbsatz traegt die Faelle, in denen das Anfordern allein nicht genuegt —
 * Ausgang 4 und 5 erzeugen auch beim zweiten Versuch keine neue Mail.
 *
 * ── Warum das hier die endgueltige Fassung ist ──────────────────────────────
 * Auf der Widerrufsseite liegt der Erfolgssatz beim Dienst, weil DER den
 * Vorgang kennt. Hier nicht: Der Dienst kennt den Ausgang zwar, darf ihn aber
 * gerade nicht verraten. Diese Seite wartet also auf keine Aenderung am
 * Dienst — sie ist in jedem der sieben Ausgaenge wahr.
 */
export default function DemoThanks() {
  return (
    <StatusPage
      path="/demo/danke/"
      title="Wenn eine Bestätigung unterwegs ist"
      tone="amber"
      icon={<Mail size={24} />}
      body="Diese Seite ist für jede Anfrage dieselbe — deine kennt sie nicht, und ob eine E-Mail rausgegangen ist, sagt sie dir deshalb nicht. Ist eine unterwegs, steht ein Bestätigungslink darin: Erst dein Klick darauf erzeugt den Demo-Schlüssel. Der Link gilt 24 Stunden."
      note={
        <>
          Schau bitte auch im Spam-Ordner nach. Ist nach ein paar Minuten
          nichts da, warte nicht länger — fordere die Demo noch einmal an.
          Kommt auch dann nichts an, schreib uns kurz an{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>; dann kümmern
          wir uns darum.
        </>
      }
      action={
        <div className="btn-row btn-row--center">
          <Link to="/kontakt" className="btn btn--ghost">
            Demo neu anfordern
          </Link>
          <Link to="/kognitives-training" className="btn btn--ghost">
            Weiter zur Anwendung
          </Link>
        </div>
      }
    />
  );
}
