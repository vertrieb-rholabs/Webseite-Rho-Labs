import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import StatusPage from '../demo/StatusPage';

/**
 * Ziel nach der Zustimmung (`ZIEL_ZUSTIMMUNG_FERTIG` im Dienst).
 *
 * Der Dienst leitet hierher, sobald das Protokoll geschrieben ist — und auch,
 * wenn derselbe Link ein zweites Mal abgesendet wird (Doppelklick); dann
 * entsteht kein zweites Protokoll. Der Text gilt also für jeden, der auf dem
 * vorgesehenen Weg ankommt. Er ist der Text aus T1 Abschnitt 3.
 *
 * Die Seite ist vorgerendert und kennt den einzelnen Vorgang nicht. Wer die
 * Adresse von Hand aufruft, sieht denselben Text; folgenlos, weil der
 * Vertragsschluss und die Bestätigungs-E-Mail beim Dienst liegen, nicht hier.
 * `noindex` kommt aus `StatusPage`.
 */
export default function PilotZustimmungFertig() {
  return (
    <StatusPage
      path="/pilotpartner/zustimmung/fertig/"
      title="Vielen Dank"
      tone="cyan"
      icon={<Check size={24} />}
      body="Ihre Zustimmung ist gespeichert. Eine Bestätigung mit den Pilotbedingungen erhalten Sie per E-Mail."
      note="Wir melden uns, um das Onboarding zu vereinbaren. Ihren Lizenzschlüssel erhalten Sie zum Pilotstart."
      action={
        <div className="btn-row btn-row--center">
          <Link to="/" className="btn btn--ghost">
            Zur Startseite
          </Link>
          <Link to="/pilotbedingungen/" className="btn btn--ghost">
            Pilotbedingungen lesen
          </Link>
        </div>
      }
    />
  );
}
