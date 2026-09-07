import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import StatusPage from './StatusPage';

/** Ziel bei abgelaufenem oder bereits benutztem Link (ZIEL_ABGELAUFEN). */
export default function DemoExpired() {
  return (
    <StatusPage
      path="/demo/link-abgelaufen/"
      title="Dieser Link geht nicht mehr"
      tone="amber"
      icon={<X size={24} />}
      body="Der Bestätigungslink ist abgelaufen oder wurde schon benutzt. Fordere die Demo einfach neu an."
      note="Zurück zum Formular auf der Kontaktseite."
      action={
        <Link to="/kontakt" className="btn btn--primary">
          Demo neu anfordern
        </Link>
      }
    />
  );
}
