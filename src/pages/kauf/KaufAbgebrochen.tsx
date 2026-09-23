import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import StatusPage from '../demo/StatusPage';
import { CONTACT_EMAIL } from '../../constants';

/**
 * Ziel bei abgebrochener Zahlung (cancel_url des Auslieferungsdienstes).
 *
 * Wie /kauf/fertig: die Seite sieht nur, dass jemand hier gelandet ist,
 * nicht ob in diesem Moment wirklich abgebrochen wurde. Der Text beschreibt
 * den Fall, fuer den die Adresse da ist.
 */
export default function KaufAbgebrochen() {
  return (
    <StatusPage
      path="/kauf/abgebrochen/"
      title="Wenn die Zahlung nicht zustande kam"
      tone="amber"
      icon={<X size={24} />}
      body="Dann wird keine Bestellung ausgelöst. Sie können den Kauf jederzeit neu beginnen."
      note={
        <>
          Falls etwas unklar geblieben ist: Die Demo läuft 14 Tage kostenlos,
          und auf Fragen antworten wir in der Regel innerhalb von 24 Stunden
          unter{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </>
      }
      action={
        <div className="btn-row btn-row--center">
          <Link to="/home#kaufen" className="btn btn--primary">
            Erneut versuchen
          </Link>
          <Link to="/kontakt" className="btn btn--ghost">
            Kontakt
          </Link>
          <Link to="/home" className="btn btn--ghost">
            Zur Home-Version
          </Link>
        </div>
      }
    />
  );
}
