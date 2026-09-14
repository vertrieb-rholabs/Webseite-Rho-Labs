import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import StatusPage from '../demo/StatusPage';

/** Ziel bei abgebrochener Zahlung (cancel_url des Auslieferungsdienstes). */
export default function KaufAbgebrochen() {
  return (
    <StatusPage
      path="/kauf/abgebrochen/"
      title="Die Zahlung wurde abgebrochen"
      tone="amber"
      icon={<X size={24} />}
      body="Es wurde nichts berechnet und keine Bestellung ausgelöst. Du kannst den Kauf jederzeit neu beginnen."
      note="Wenn etwas unklar geblieben ist: Die Demo läuft 14 Tage kostenlos, und auf Fragen antworten wir in der Regel innerhalb von 24 Stunden."
      action={
        <Link to="/home" className="btn btn--primary">
          Zurück zur Home-Version
        </Link>
      }
    />
  );
}
