import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import StatusPage from './StatusPage';

/** Ziel nach dem Absenden des Formulars (ZIEL_ANGEFRAGT). */
export default function DemoThanks() {
  return (
    <StatusPage
      path="/demo/danke/"
      title="Fast geschafft"
      tone="cyan"
      icon={<Mail size={24} />}
      body="Wir haben dir eine E-Mail geschickt. Klick auf den Link darin, dann bekommst du deinen Demo-Schlüssel."
      note="Der Link gilt 24 Stunden. Schau notfalls im Spam-Ordner nach."
      action={
        <Link to="/kognitives-training" className="btn btn--ghost">
          Weiter zur Anwendung
        </Link>
      }
    />
  );
}
