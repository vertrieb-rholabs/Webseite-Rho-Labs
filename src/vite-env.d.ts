/// <reference types="vite/client" />

/**
 * Umgebungsvariablen der Website.
 *
 * Nur `VITE_`-Namen erreichen den Browser; Vite ersetzt sie beim Bauen durch
 * ihren Wert. Ohne gesetzte Variable gilt die Vorgabe in `constants.ts` —
 * die Produktion.
 */
interface ImportMetaEnv {
  /** Basisadresse des Auslieferungsdienstes, ohne abschliessenden Schraegstrich. */
  readonly VITE_API_BASIS?: string;
}
