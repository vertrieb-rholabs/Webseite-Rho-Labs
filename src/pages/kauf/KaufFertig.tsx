import { Download } from 'lucide-react';
import StatusPage from '../demo/StatusPage';
import { DOWNLOAD_URL } from '../../constants';

/**
 * Ziel nach erfolgreicher Zahlung (return_url des Auslieferungsdienstes).
 *
 * Wie die drei /demo/-Seiten über das gemeinsame Gerüst und mit `noindex`:
 * für die Suche haben diese Seiten keinen Wert.
 */
export default function KaufFertig() {
  return (
    <StatusPage
      path="/kauf/fertig/"
      title="Vielen Dank — der Kauf ist abgeschlossen"
      tone="cyan"
      icon={<Download size={24} strokeWidth={2.4} />}
      body="Lizenzschlüssel und Rechnung gehen gleich per E-Mail an die Adresse, die du angegeben hast. Den Schlüssel gibst du in der Anwendung unter „Lizenz“ ein."
      note="Das Programm selbst lädst du hier herunter — für Windows 10/11. Schau notfalls im Spam-Ordner nach."
      action={
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
        >
          <Download size={17} /> Download für Windows
        </a>
      }
    />
  );
}
