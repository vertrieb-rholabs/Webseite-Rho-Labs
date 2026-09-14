import { Clock } from 'lucide-react';
import StatusPage from '../demo/StatusPage';
import { CONTACT_EMAIL } from '../../constants';

/**
 * Ziel, wenn die Zahlung durch ist, die Auslieferung aber noch hakt.
 *
 * Der Ton ist Absicht: Es ist nichts verloren gegangen, die Bestellung liegt
 * vor, und wir melden uns von selbst. Beunruhigen wäre hier falsch — aber
 * verschweigen auch, deshalb steht der Kontaktweg gleich dabei.
 */
export default function KaufInArbeit() {
  return (
    <StatusPage
      path="/kauf/in-arbeit/"
      title="Deine Zahlung ist angekommen"
      tone="amber"
      icon={<Clock size={24} />}
      body="Die Auslieferung des Lizenzschlüssels dauert diesmal etwas länger. Deine Bestellung ist erfasst und geht nicht verloren — wir stellen sie von Hand zu, in der Regel noch am selben Werktag."
      note={
        <>
          Du musst nichts weiter tun und bitte nicht erneut bestellen. Wenn du
          nachfragen möchtest, genügt eine kurze Mail an{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — am besten mit
          der E-Mail-Adresse, die du bei der Bestellung angegeben hast.
        </>
      }
      action={
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--ghost">
          Nachfragen
        </a>
      }
    />
  );
}
