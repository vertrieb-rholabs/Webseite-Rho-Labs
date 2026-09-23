import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import StatusPage from '../demo/StatusPage';
import {
  CONTACT_EMAIL, DOWNLOAD_URL, WIDERRUF_FUNKTION_LABEL, WIDERRUF_FUNKTION_PFAD,
} from '../../constants';

/**
 * Ziel nach einer Zahlung (return_url des Auslieferungsdienstes).
 *
 * Die Seite weiss nicht, ob dieser Besuch zu einem Kauf gehoert: sie hat
 * keinen Vorgangsstand. Deshalb steht hier nur, was in dem Fall gilt, und
 * wie man uns erreicht, wenn die Mail ausbleibt.
 */
export default function KaufFertig() {
  return (
    <StatusPage
      path="/kauf/fertig/"
      title="Wenn Ihr Kauf durchgelaufen ist"
      tone="cyan"
      icon={<Mail size={24} />}
      body="Dann gehen Lizenzschlüssel und Rechnung an die E-Mail-Adresse, die Sie beim Bestellen angegeben haben. Den Schlüssel geben Sie in der Anwendung unter „Lizenz“ ein."
      note={
        <>
          Liegt die Nachricht nicht im Postfach und nicht im Spam-Ordner,
          schreiben Sie uns unter{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {' '}— am besten mit der Adresse, die Sie beim Bestellen verwendet
          haben. Das Programm für Windows 10/11 laden Sie{' '}
          <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
            hier
          </a>{' '}
          herunter. Falls der Kauf nicht abgeschlossen war, können Sie ihn neu
          beginnen.
        </>
      }
      action={
        <>
          {/* § 356a Abs. 1 Satz 3 — „hervorgehoben platziert und für den
              Verbraucher leicht zugänglich".

              Diese Seite kennt den Vorgang nicht und weiß deshalb nicht, ob
              das Widerrufsrecht schon nach § 356 Abs. 6 Nr. 2 erloschen ist.
              Genau darum steht der Link hier: Die Seite darf ihn nicht
              weglassen, weil sie ihn für entbehrlich HÄLT. Ob das Recht im
              Einzelfall noch besteht, entscheidet nicht diese Seite — und
              schon gar nicht dadurch, dass sie den Weg dorthin verschweigt. */}
          <p className="widerruf-hinweis" style={{ marginBottom: 20 }}>
            Sie möchten den Vertrag widerrufen?{' '}
            <Link to={WIDERRUF_FUNKTION_PFAD}>{WIDERRUF_FUNKTION_LABEL}</Link>
          </p>
          <div className="btn-row btn-row--center">
            <Link to="/kontakt" className="btn btn--primary">
              Kontakt
            </Link>
            <Link to="/home#kaufen" className="btn btn--ghost">
              Erneut versuchen
            </Link>
            <Link to="/home" className="btn btn--ghost">
              Zur Home-Version
            </Link>
          </div>
        </>
      }
    />
  );
}
