// Die Widerrufsfunktion nach § 356a BGB — Quelltest der Website.
//
// Geprüft wird nicht das Aussehen, sondern das, was auseinanderlaufen kann:
//
//  1. Eine neue Route gehört in DREI Listen (src/App.tsx, vite.config.ts,
//     scripts/hydration-check.mjs). Fehlt sie in einer, entsteht beim
//     Vorrendern kein Verzeichnis, und der Rückweg des Dienstes läuft in den
//     404 — bei einer Widerrufsfunktion also: das Recht führt ins Leere.
//  2. Die Adresse der Funktion steht wortgleich im amtlichen Baustein der
//     Widerrufsbelehrung UND in `rechtstexte.ts` des Auslieferungsdienstes.
//     Drei Stellen, eine Schreibweise.
//  3. Die Beschriftung ist die des Gesetzes: § 356a Abs. 1 Satz 2 verlangt
//     „Vertrag widerrufen" oder eine gleichbedeutende eindeutige Formulierung.
//  4. Die Seite fragt genau die drei Angaben aus Absatz 2 ab — und kein
//     Pflichtfeld für die Bestelladresse, das den Online-Weg versperren würde.
//
// Aufruf: node --test scripts/widerruf.test.mjs
// Nicht Teil von `npm run pruefen`, wie telefon.test.mjs auch nicht.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function quelle(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const PFAD = '/vertrag-widerrufen';
const LABEL = 'Vertrag widerrufen';

test('die Route steht in ALLEN DREI Listen', () => {
  const app = quelle('src/App.tsx');
  assert.match(
    app,
    /\{\s*path:\s*'vertrag-widerrufen',\s*Component:\s*WiderrufErklaeren\s*\}/,
    'src/App.tsx kennt die Route nicht.',
  );
  assert.match(
    app,
    /\{\s*path:\s*'vertrag-widerrufen\/eingegangen',\s*Component:\s*WiderrufEingegangen\s*\}/,
    'src/App.tsx kennt die Ergebnisseite nicht.',
  );

  const vite = quelle('vite.config.ts');
  assert.match(vite, /'\/vertrag-widerrufen'/, 'vite.config.ts rendert die Seite nicht vor.');
  assert.match(
    vite, /'\/vertrag-widerrufen\/eingegangen'/,
    'vite.config.ts rendert die Ergebnisseite nicht vor — der Rückweg des Dienstes liefe in den 404.',
  );

  const hydration = quelle('scripts/hydration-check.mjs');
  assert.match(hydration, /'\/vertrag-widerrufen'/, 'Die Hydrationsprüfung sieht die Seite nicht an.');
  assert.match(
    hydration, /'\/vertrag-widerrufen\/eingegangen\/'/,
    'Die Hydrationsprüfung sieht die Ergebnisseite nicht an.',
  );
});

test('Beschriftung und Pfad kommen aus EINER Konstante', () => {
  const constants = quelle('src/constants.ts');
  assert.match(
    constants,
    new RegExp(`export const WIDERRUF_FUNKTION_LABEL = '${LABEL}'`),
    `§ 356a Abs. 1 Satz 2 verlangt die Beschriftung „${LABEL}".`,
  );
  assert.match(
    constants,
    new RegExp(`export const WIDERRUF_FUNKTION_PFAD = '${PFAD}'`),
    'Der Pfad steht wortgleich in der Widerrufsbelehrung.',
  );
  assert.match(
    constants,
    /export const WIDERRUF_FORM_ACTION = `\$\{API_BASIS\}\/api\/public\/widerruf\/eingabe`/,
    'Das POST-Ziel muss aus API_BASIS kommen, nicht fest verdrahtet sein.',
  );
});

test('die Funktion ist von den Seiten aus erreichbar, an denen Verträge entstehen', () => {
  // § 356a Abs. 1 Satz 3: „ständig verfügbar, hervorgehoben platziert und für
  // den Verbraucher leicht zugänglich". Die Fußzeile steht auf jeder Seite;
  // die drei Kaufseiten tragen die Hervorhebung dort, wo es darauf ankommt.
  for (const datei of [
    'src/components/Footer.tsx',
    'src/pages/HomePage.tsx',
    'src/pages/kauf/KaufInArbeit.tsx',
    'src/pages/kauf/KaufFertig.tsx',
    'src/pages/Widerruf.tsx',
  ]) {
    const text = quelle(datei);
    assert.match(
      text, /WIDERRUF_FUNKTION_PFAD/,
      `${datei} verlinkt die Widerrufsfunktion nicht.`,
    );
    assert.match(
      text, /WIDERRUF_FUNKTION_LABEL/,
      `${datei} setzt die gesetzliche Beschriftung nicht ein.`,
    );
  }
});

test('die Belehrung trägt den amtlichen Baustein mit eingesetzter Adresse', () => {
  const seite = quelle('src/pages/Widerruf.tsx');
  assert.match(
    seite,
    /"Sie können Ihr Widerrufsrecht auch online unter " \+\s*\n?\s*SITE_URL \+ WIDERRUF_FUNKTION_PFAD/,
    'Der erste Satz des Bausteins fehlt oder setzt die Adresse nicht ein.',
  );
  assert.ok(
    seite.includes(
      ' ausüben. Wenn Sie diese Online-Funktion nutzen, übermitteln wir Ihnen auf '
      + 'einem dauerhaften Datenträger (z. B. durch eine E-Mail) unverzüglich eine '
      + 'Eingangsbestätigung mit Informationen zum Inhalt der Widerrufserklärung '
      + 'sowie dem Datum und der Uhrzeit ihres Eingangs.',
    ),
    'Der zweite Satz des amtlichen Bausteins fehlt oder wurde umformuliert — '
    + 'das kostet die Gesetzlichkeitsfiktion (Art. 246a § 1 Abs. 2 Satz 2 EGBGB).',
  );

  // Und dieselbe Stelle in der freigegebenen Quelle daneben.
  const md = fs.readFileSync(
    path.resolve(root, '..', 'Rechtstexte-Entwuerfe', 'seite-widerruf.md'), 'utf8',
  );
  assert.match(
    md, /Sie können Ihr Widerrufsrecht auch online unter\s+https:\/\/rholabs\.de\/vertrag-widerrufen\s+ausüben\./,
    'seite-widerruf.md ist hinter der Seite zurückgeblieben.',
  );
});

test('das Formular fragt genau die drei Angaben aus § 356a Abs. 2 ab', () => {
  const seite = quelle('src/pages/WiderrufErklaeren.tsx');

  assert.match(seite, /name="name"/, 'Abs. 2 Nr. 1 — der Name fehlt.');
  assert.match(seite, /name="vertragsangaben"/, 'Abs. 2 Nr. 2 — die Vertragsangaben fehlen.');
  assert.match(seite, /name="bestaetigung_an"/, 'Abs. 2 Nr. 3 — das Kommunikationsmittel fehlt.');

  // Kein viertes Feld, und schon gar kein Pflichtfeld für die Bestelladresse:
  // Abs. 2 Nr. 2 verlangt kein Feldformat, und wer über eine fremde Adresse
  // bestellt hat, darf nicht ausgesperrt werden.
  assert.doesNotMatch(
    seite, /name="bestell_email"/,
    'Ein Pflichtfeld für die Bestelladresse würde den Online-Weg versperren.',
  );
  const felder = [...seite.matchAll(/name="([a-z_]+)"/g)].map(t => t[1]);
  assert.deepEqual(
    felder.sort(),
    ['bestaetigung_an', 'name', 'vertragsangaben', 'webseite'].sort(),
    'Andere Felder als die drei aus Absatz 2 plus der Honigtopf.',
  );

  // Ohne JavaScript absendbar: eine Rechtsausübung darf nicht an einem Skript
  // hängen.
  assert.match(seite, /method="post"/, 'Das Formular muss ein echtes POST sein.');
  assert.match(seite, /action=\{WIDERRUF_FORM_ACTION\}/, 'Das Ziel muss aus der Konstante kommen.');
  assert.match(seite, /className="honeypot"/, 'Der Honigtopf fehlt.');
});

test('die Ergebnisseite behauptet keine Rückzahlung und trägt noindex', () => {
  const seite = quelle('src/pages/widerruf/WiderrufEingegangen.tsx');
  assert.match(seite, /StatusPage/, 'Sie nutzt das gemeinsame Gerüst — das trägt noindex.');
  assert.match(
    seite, /noch nicht ausgeführt/,
    'Die Seite darf nicht den Eindruck erwecken, das Geld sei schon zurück.',
  );
  assert.match(
    seite, /Datum und der Uhrzeit/,
    'Sie muss auf die Eingangsbestätigung nach § 356a Abs. 4 verweisen.',
  );
  // Sie darf keine Uhrzeit BEHAUPTEN: sie ist statisch und kennt den Vorgang
  // nicht. Die Uhrzeit steht in der Mail.
  assert.doesNotMatch(
    seite, /\d{1,2}:\d{2}\s*Uhr/,
    'Eine vorgerenderte Seite kennt keinen Zeitpunkt und darf keinen nennen.',
  );
});

test('die Kaufseite versteht jede Kennung, die der Dienst sendet', () => {
  // Befund 5: `derzeit` wurde verschluckt, und der Käufer sah das Formular ein
  // zweites Mal — ohne Grund und ohne Weg, sich zu melden.
  const seite = quelle('src/pages/HomePage.tsx');
  for (const kennung of ['eingabe', 'zuviele', 'zahlung', 'derzeit']) {
    assert.match(
      seite, new RegExp(`wert === '${kennung}'`),
      `formfehlerLesen verwirft '${kennung}' — der Dienst sendet es aber.`,
    );
    assert.match(
      seite, new RegExp(`^\\s*${kennung}:`, 'm'),
      `Zu '${kennung}' gibt es keinen Text.`,
    );
  }
  assert.match(
    seite, /derzeit:[\s\S]{0,400}\$\{CONTACT_EMAIL\}/,
    'Der Satz zu „derzeit" muss die Kontaktadresse nennen.',
  );
  assert.match(
    seite, /derzeit:[\s\S]{0,400}nichts abgebucht/,
    'Er muss sagen, dass nichts abgebucht wurde.',
  );
});
