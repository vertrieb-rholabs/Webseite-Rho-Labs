import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import StatusPage from '../demo/StatusPage';

/**
 * Ziel nach der Bewerbung (`ZIEL_BEWERBUNG_DANKE` im Dienst).
 *
 * Der Dienst leitet hierher, wenn die Bewerbung gespeichert ist — und, weil
 * er Wiederholungen und Lockfeld still wie einen Erfolg behandelt, auch dann,
 * wenn nichts Neues angelegt wurde. Für einen Menschen, der das Formular
 * ausgefüllt hat, stimmt der Text in jedem dieser Fälle: Seine Angaben
 * liegen vor (oder lagen binnen 24 Stunden schon vor). Fehler führen nicht
 * hierher, sondern zurück auf das Formular (`?fehler=…`).
 *
 * Gesagt wird nur, was die Bewerbung bedeutet: Rückmeldung binnen fünf
 * Werktagen, und noch kein Vertrag. Es geht keine E-Mail an die Bewerberadresse
 * (Datenschutzerklärung, Abschnitt Pilotprogramm); die Seite verspricht auch
 * keine. `noindex` kommt aus `StatusPage`. Text: T1 Abschnitt 3.
 */
export default function PilotDanke() {
  return (
    <StatusPage
      path="/pilotpartner/danke/"
      title="Danke für Ihre Bewerbung"
      tone="cyan"
      icon={<Check size={24} />}
      body="Wir prüfen Ihre Angaben und melden uns innerhalb von fünf Werktagen per E-Mail."
      note="Mit der Bewerbung ist noch kein Vertrag entstanden."
      action={
        <div className="btn-row btn-row--center">
          <Link to="/" className="btn btn--ghost">
            Zur Startseite
          </Link>
          <Link to="/pilotbedingungen" className="btn btn--ghost">
            Pilotbedingungen lesen
          </Link>
        </div>
      }
    />
  );
}
