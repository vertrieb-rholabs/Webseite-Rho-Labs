import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Abschliessender Aufruf zur Demo.
 *
 * Bewusst nicht im Layout, sondern je Seite eingebunden: auf der
 * Kontaktseite steht das Formular selbst, und auf den Bestaetigungsseiten
 * waere eine zweite Aufforderung zur Demo irrefuehrend.
 */
export default function Closer() {
  return (
    <section className="closer">
      <div className="closer__inner">
        <h2>Einmal selbst ausprobieren?</h2>
        <p>
          Die Demo läuft 14 Tage mit vollem Funktionsumfang. Sie brauchen nur
          eine E-Mail-Adresse.
        </p>
        <Link to="/kontakt" className="btn btn--primary">
          Demo anfordern <ArrowRight size={17} strokeWidth={2.2} />
        </Link>
      </div>
    </section>
  );
}
