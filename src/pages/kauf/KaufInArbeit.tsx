import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import StatusPage from '../demo/StatusPage';
import { CONTACT_EMAIL } from '../../constants';

/**
 * Ziel, wenn die Zahlung durch ist, die Auslieferung aber noch hakt.
 *
 * Der Ton ist Absicht: beunruhigen waere falsch, verschweigen auch. Die
 * Seite kennt den einzelnen Vorgang trotzdem nicht — deshalb der
 * Bedingungssatz, und deshalb kein „erneut versuchen“: wer wirklich
 * bezahlt hat, soll nicht ein zweites Mal bestellen.
 */
export default function KaufInArbeit() {
  return (
    <StatusPage
      path="/kauf/in-arbeit/"
      title="Wenn die Auslieferung noch dauert"
      tone="amber"
      icon={<Clock size={24} />}
      body="Wenn die Zahlung durch ist, der Lizenzschlüssel aber noch nicht im Postfach liegt: Die Bestellung geht nicht verloren. Wir stellen sie von Hand zu, in der Regel noch am selben Werktag. Bitte bestellen Sie nicht erneut."
      note={
        <>
          Wenn Sie nachfragen möchten, genügt eine kurze Mail an{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {' '}— am besten mit der E-Mail-Adresse, die Sie bei der Bestellung
          angegeben haben.
        </>
      }
      action={
        <div className="btn-row btn-row--center">
          <Link to="/kontakt" className="btn btn--primary">
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
