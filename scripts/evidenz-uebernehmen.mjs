// Uebernimmt das Evidenzregister der Anwendung in die Website.
//
//   node scripts/evidenz-uebernehmen.mjs [pfad/zur/evidenz.json]
//
// Das Register in `Gedaechtniss-Training/docs/evidenz/evidenz.json` ist die
// einzige Quelle. Frueher pflegte die Website eine eigene Liste — die ist
// auseinandergelaufen und behauptete am Ende Belege fuer Uebungen, die das
// Register ausdruecklich als unbelegt fuehrt. Deshalb wird hier erzeugt statt
// abgeschrieben: nach jeder Aenderung am Register dieses Skript laufen lassen.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE =
  process.argv[2] ||
  'C:/Users/Feixp/OneDrive/Dokumente/Software/Gedaechtniss-Training/docs/evidenz/evidenz.json';
const ZIEL = path.join(ROOT, 'src/data/evidenz.ts');

// Das Register und der Spielekatalog der Website benennen zwei Uebungen
// unterschiedlich. Der Katalog gewinnt — die Besucher sehen ihn zuerst.
const NAME_IM_KATALOG = {
  'Muster merken': 'Muster',
  Aufmerksamkeit: 'Aufmerksamkeit halten',
};

const reg = JSON.parse(fs.readFileSync(QUELLE, 'utf8'));
const spiele = Array.isArray(reg.spiele) ? reg.spiele : Object.values(reg.spiele);

// Crossref liefert Titel und Zeitschriftennamen mit HTML-Entitaeten
// ("Psychonomic Bulletin &amp; Review"). Unaufgeloest stuenden sie so auf der
// Seite — React setzt Text woertlich und entschluesselt nichts.
const ENTITAETEN = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&apos;': "'", '&#39;': "'", '&nbsp;': ' ',
};
const text = (v) =>
  typeof v === 'string'
    ? v.replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g, (m) => ENTITAETEN[m] ?? m)
    : v;

const belegt = (s) => typeof s.quellenstatus === 'string' && s.quellenstatus.startsWith('dokumentiert');

const aufbereitet = spiele.map((s) => ({
  key: s.key,
  label: NAME_IM_KATALOG[s.label] || s.label,
  kategorie: s.kategorie || null,
  domaenen: text(s.domaenen) || null,
  paradigma: s.paradigma ? { stufe: s.paradigma.stufe, einschraenkung: s.paradigma.einschraenkung ?? null } : null,
  training: s.training ? { stufe: s.training.stufe, einschraenkung: s.training.einschraenkung ?? null } : null,
  evidenztext: text(s.evidenztext) || null,
  quellenstatus: s.quellenstatus,
  belegt: belegt(s),
  quellen: (s.quellen || []).map((q) => ({
    doi: q.doi ?? null,
    autoren: q.autoren || [],
    weitereAutoren: q.weitereAutoren || 0,
    jahr: q.jahr ?? null,
    titel: text(q.titel) || '',
    zeitschrift: text(q.zeitschrift) || '',
    band: q.band ?? null,
    seiten: q.seiten ?? null,
    url: q.url ?? (q.doi ? `https://doi.org/${q.doi}` : null),
  })),
}));

// Belegte zuerst, darin nach Kategorie und Name — die unbelegten stehen am
// Ende in einem eigenen Abschnitt und sollen nicht dazwischenliegen.
aufbereitet.sort((a, b) =>
  a.belegt !== b.belegt
    ? a.belegt
      ? -1
      : 1
    : (a.kategorie || '').localeCompare(b.kategorie || '', 'de') ||
      a.label.localeCompare(b.label, 'de'),
);

// Die Stufen kommen aus dem Register. Es fuehrt neben den drei Grundstufen
// auch zusammengesetzte wie "SCHWACH bis MODERAT" — die sind gewollt und
// werden nicht auf eine Grundstufe zurechtgebogen.
const stufen = [
  ...new Set(
    aufbereitet.flatMap((s) => [s.paradigma?.stufe, s.training?.stufe]).filter(Boolean),
  ),
].sort();

const kopf = `// ACHTUNG: erzeugte Datei — nicht von Hand bearbeiten.
//
// Erzeugt aus dem Evidenzregister der Anwendung durch
//   node scripts/evidenz-uebernehmen.mjs
// Quelle: docs/evidenz/evidenz.json im Projekt Gedaechtniss-Training
// Stand des Registers: ${reg.stand}
//
// Aenderungen gehoeren ins Register, nicht hierher.

export type Stufe = ${stufen.map((v) => JSON.stringify(v)).join(' | ')};

/** Grundstufe fuer die farbliche Kennzeichnung — bei zusammengesetzten Stufen die erste. */
export function grundstufe(s: Stufe): 'STARK' | 'MODERAT' | 'SCHWACH' {
  const w = s.split(' ')[0];
  return w === 'STARK' || w === 'MODERAT' ? w : 'SCHWACH';
}

export interface EvidenzQuelle {
  doi: string | null;
  autoren: string[];
  weitereAutoren: number;
  jahr: number | null;
  titel: string;
  zeitschrift: string;
  band: string | null;
  seiten: string | null;
  url: string | null;
}

export interface EvidenzEinstufung {
  stufe: Stufe;
  einschraenkung: string | null;
}

export interface EvidenzSpiel {
  key: string;
  label: string;
  kategorie: string | null;
  domaenen: string | null;
  paradigma: EvidenzEinstufung | null;
  training: EvidenzEinstufung | null;
  evidenztext: string | null;
  quellenstatus: string;
  /** true, sobald das Register einen dokumentierten Beleg fuehrt. */
  belegt: boolean;
  quellen: EvidenzQuelle[];
}

/** Stand des uebernommenen Registers. */
export const EVIDENZ_STAND = ${JSON.stringify(reg.stand)};

/**
 * Pflichthinweis. Das Register verlangt ausdruecklich, dass er auf einer
 * Seite wiederholt wird, die einzelne Uebungen oder Quellen gesondert
 * darstellt — ein Verweis auf das Register genuegt dort nicht.
 */
export const EVIDENZ_HINWEIS = ${JSON.stringify(reg.hinweis)};

export const EVIDENZ_ERKLAERUNG = {
  paradigma: ${JSON.stringify(reg.einstufung.paradigma)},
  training: ${JSON.stringify(reg.einstufung.training)},
};

export const EVIDENZ: EvidenzSpiel[] = ${JSON.stringify(aufbereitet, null, 2)};
`;

fs.mkdirSync(path.dirname(ZIEL), { recursive: true });
fs.writeFileSync(ZIEL, kopf, 'utf8');

const mitBeleg = aufbereitet.filter((s) => s.belegt);
console.log(`Register vom ${reg.stand} uebernommen nach src/data/evidenz.ts`);
console.log(`  ${aufbereitet.length} Uebungen, davon ${mitBeleg.length} mit dokumentiertem Beleg`);
console.log(`  ${mitBeleg.reduce((n, s) => n + s.quellen.length, 0)} Quellen`);
const ohne = aufbereitet.filter((s) => !s.belegt);
if (ohne.length) {
  console.log(`  ohne Beleg (werden als solche ausgewiesen): ${ohne.map((s) => s.label).join(', ')}`);
}
