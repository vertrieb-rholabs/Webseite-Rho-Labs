import { BSFZ_SIEGEL } from '../constants';

/**
 * Das BSFZ-Siegel, verlinkt auf die Seite, die der Leitfaden der BSFZ für
 * digitale Anwendungen vorsieht.
 *
 * `breite` meint die ganze Bildfläche einschließlich Schutzraum (siehe
 * BSFZ_SIEGEL in constants.ts) — der sichtbare Ring ist rund drei Viertel
 * davon. Nicht kleiner als etwa 100 px setzen: Der Leitfaden verlangt, dass
 * die Schrift in der Mitte lesbar bleibt.
 *
 * Das Siegel wird nicht gedreht, umgefärbt oder beschnitten; der Hover
 * hebt es nur an.
 */
export default function BsfzSiegel({ breite }: { breite: number }) {
  return (
    <a
      href={BSFZ_SIEGEL.href}
      target="_blank"
      rel="noopener noreferrer"
      className="siegel"
      title="Bescheinigungsstelle Forschungszulage: Forschung und Entwicklung im Rampenlicht"
    >
      <img
        src={BSFZ_SIEGEL.src}
        alt={BSFZ_SIEGEL.alt}
        width={breite}
        height={breite}
        loading="lazy"
        decoding="async"
      />
      <span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  );
}
