import { Link } from 'react-router-dom';
import { Check, Download } from 'lucide-react';
import StatusPage from './StatusPage';
import { DOWNLOAD_URL } from '../../constants';

/** Ziel nach dem Klick auf den Bestaetigungslink (ZIEL_FERTIG). */
export default function DemoDone() {
  return (
    <StatusPage
      path="/demo/fertig/"
      title="Dein Demo-Schlüssel ist unterwegs"
      tone="cyan"
      icon={<Check size={24} strokeWidth={2.4} />}
      body="In wenigen Augenblicken liegt er in deinem Postfach. Die Demo läuft 14 Tage, enthält den vollen Funktionsumfang und gilt für ein Gerät, Windows oder Android; unter Android zählt jedes Nutzerprofil als eigenes Gerät. Danach kannst du deine Daten weiter ansehen, exportieren und löschen. Den Schlüssel gibst du in der Anwendung unter „Lizenz“ ein."
      note="Das Programm selbst lädst du hier herunter. Für Android-Tablets gibt es eine eigene Installationsdatei auf der Android-Seite."
      action={
        <div className="btn-row btn-row--center">
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            <Download size={17} /> Download für Windows
          </a>
          <Link to="/android/" className="btn btn--ghost">
            <Download size={17} /> Download für Android
          </Link>
        </div>
      }
    />
  );
}
