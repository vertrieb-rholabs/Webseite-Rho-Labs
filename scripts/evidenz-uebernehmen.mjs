// Uebernimmt das Evidenzregister der Anwendung in die Website.
//
//   node scripts/evidenz-uebernehmen.mjs [pfad/zur/evidenz.json]
//
// Das Register in `Gedaechtniss-Training/docs/evidenz/evidenz.json` ist die
// einzige Quelle. Frueher pflegte die Website eine eigene Liste — die ist
// auseinandergelaufen und behauptete am Ende Belege fuer Uebungen, die das
// Register ausdruecklich als unbelegt fuehrt. Deshalb wird hier erzeugt statt
// abgeschrieben: nach jeder Aenderung am Register dieses Skript laufen lassen.
//
// ── Bereinigungsschicht (Pilotprogramm W1, 06.10.2026) ──────────────────────
// Die Website beschreibt die HERKUNFT der Uebungen aus bekannten Aufgabenformen
// der kognitiven Psychologie — nicht ihre Wirkung (R1 Abschnitt 1.4, T1
// Abschnitt 4 Punkt 6). Das Register fuehrt dagegen noch Einstufungen der
// Trainingswirkung, Quellen mit Krankheitsendpunkt und Texte im Vokabular der
// Messverfahren. Das Register selbst darf von hier aus nicht geaendert werden
// (anderes Repository); deshalb wendet dieses Skript die Datei
// `scripts/evidenz-bereinigung.json` an:
//
//   - Einstufungen (`paradigma`, `training`), die Stufenerklaerung, der
//     Registerhinweis und der Quellenstatus werden NICHT uebernommen;
//   - die dort aufgefuehrten Quellen (je Uebung, per DOI) entfallen;
//   - der Text je Uebung wird durch den Herkunftstext aus der Datei ersetzt
//     (`null` = kein Text);
//   - `belegt` heisst nur noch: es ist mindestens eine Quelle uebrig.
//
// Zieht das Register spaeter nach (Pilotprogramm/berichte/W1-evidenz-json-
// aenderung.md), meldet das Skript „bereits entfernt" und liefert dieselbe
// Fassung; die Bereinigungsdatei kann dann entfallen. Am Ende prueft das Skript
// das Ergebnis gegen die verbotenen Begriffe und bricht ab, wenn einer
// auftaucht.

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

const BEREINIGUNG = path.join(ROOT, 'scripts/evidenz-bereinigung.json');

const reg = JSON.parse(fs.readFileSync(QUELLE, 'utf8'));
const ber = JSON.parse(fs.readFileSync(BEREINIGUNG, 'utf8'));
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

const nachBereinigung = [];
const keys = new Set(spiele.map((s) => s.key));
for (const k of [...Object.keys(ber.entfernteQuellen), ...Object.keys(ber.evidenztexte)]) {
  if (!keys.has(k)) throw new Error(`Bereinigung nennt eine Uebung, die das Register nicht fuehrt: ${k}`);
}

const aufbereitet = spiele.map((s) => {
  const weg = new Set((ber.entfernteQuellen[s.key] || []).map((e) => e.doi));
  const vorhanden = new Set((s.quellen || []).map((q) => q.doi));
  for (const doi of weg) {
    if (!vorhanden.has(doi)) nachBereinigung.push(`${s.key}: Quelle ${doi} ist im Register bereits entfernt`);
  }
  const quellen = (s.quellen || []).filter((q) => !(q.doi && weg.has(q.doi))).map((q) => ({
    doi: q.doi ?? null,
    autoren: q.autoren || [],
    weitereAutoren: q.weitereAutoren || 0,
    jahr: q.jahr ?? null,
    titel: text(q.titel) || '',
    zeitschrift: text(q.zeitschrift) || '',
    band: q.band ?? null,
    seiten: q.seiten ?? null,
    url: q.url ?? (q.doi ? `https://doi.org/${q.doi}` : null),
  }));
  const hatText = Object.prototype.hasOwnProperty.call(ber.evidenztexte, s.key);
  return {
    key: s.key,
    label: NAME_IM_KATALOG[s.label] || s.label,
    kategorie: s.kategorie || null,
    domaenen: text(s.domaenen) || null,
    // Ein Text gehoert nur zu einer Uebung, die auch eine Quelle zeigt.
    evidenztext: quellen.length > 0 ? (hatText ? ber.evidenztexte[s.key] : text(s.evidenztext) || null) : null,
    belegt: quellen.length > 0,
    quellen,
  };
});

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

const kopf = `// ACHTUNG: erzeugte Datei — nicht von Hand bearbeiten.
//
// Erzeugt aus dem Evidenzregister der Anwendung durch
//   node scripts/evidenz-uebernehmen.mjs
// Quelle: docs/evidenz/evidenz.json im Projekt Gedaechtniss-Training
// Stand des Registers: ${reg.stand}
// Bereinigt durch: scripts/evidenz-bereinigung.json (Herkunft statt Wirkung)
//
// Aenderungen gehoeren ins Register bzw. in die Bereinigungsdatei, nicht hierher.

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

export interface EvidenzSpiel {
  key: string;
  label: string;
  kategorie: string | null;
  domaenen: string | null;
  /** Herkunftstext: auf welche Aufgabenform die Uebung zurueckgeht. */
  evidenztext: string | null;
  /** true, sobald mindestens eine Quelle zur Herkunft der Aufgabenform fuehrt. */
  belegt: boolean;
  quellen: EvidenzQuelle[];
}

/** Stand des uebernommenen Registers. */
export const EVIDENZ_STAND = ${JSON.stringify(reg.stand)};

export const EVIDENZ: EvidenzSpiel[] = ${JSON.stringify(aufbereitet, null, 2)};
`;

// ── Gegenprobe: keine verbotenen Begriffe (R1 1.4) in den Daten ──────────────
// Geprueft werden Texte, Dominen, Titel und Zeitschriften. Das Ergebnis darf
// keinen davon enthalten; sonst wird nichts geschrieben.
const VERBOTEN = /therap|behandl|rehabilit|demenz|dementia|schlaganfall|normwert|nachweislich|wirksam|diagnose|brain damage|adhs|adhd|hearing loss|hörverlust|protects the hippocampus/i;
const treffer = [];
for (const sp of aufbereitet) {
  const felder = [sp.label, sp.domaenen, sp.evidenztext, ...sp.quellen.flatMap((q) => [q.titel, q.zeitschrift])];
  for (const f of felder) {
    const m = typeof f === 'string' && f.match(VERBOTEN);
    if (m) treffer.push(`${sp.key}: „${m[0]}“ in „${f.slice(0, 80)}…“`);
  }
}
if (treffer.length) {
  console.error('Verbotene Begriffe im Ergebnis — nichts geschrieben:');
  treffer.forEach((t) => console.error('  ' + t));
  process.exit(1);
}

fs.mkdirSync(path.dirname(ZIEL), { recursive: true });
fs.writeFileSync(ZIEL, kopf, 'utf8');

const mitBeleg = aufbereitet.filter((s) => s.belegt);
console.log(`Register vom ${reg.stand} uebernommen nach src/data/evidenz.ts`);
console.log(`  ${aufbereitet.length} Uebungen, davon ${mitBeleg.length} mit Quelle zur Herkunft`);
console.log(`  ${mitBeleg.reduce((n, s) => n + s.quellen.length, 0)} Quellen`);
const ohne = aufbereitet.filter((s) => !s.belegt);
if (ohne.length) {
  console.log(`  ohne Quelle (werden als solche ausgewiesen): ${ohne.map((s) => s.label).join(', ')}`);
}
if (nachBereinigung.length) {
  console.log('  Register bereits nachgezogen:');
  nachBereinigung.forEach((n) => console.log('    ' + n));
}
