// Sperre gegen eine Veröffentlichung ohne Telefonnummer.
//
// Art. 246a § 1 Abs. 1 Nr. 3 EGBGB verlangt die Nummer. Ein unvollständig
// gefüllter Gestaltungshinweis [2] der Anlage 1 kostet die
// Gesetzlichkeitsfiktion der Widerrufsbelehrung: die Widerrufsfrist endet
// dann erst zwölf Monate und vierzehn Tage nach dem Vertragsschluss.
//
// Der Test fällt durch, solange in KONTAKT_TELEFON der Platzhalter steht.
// Aufruf: node --test scripts/telefon.test.mjs
// Nicht Teil von `npm run pruefen` — der Platzhalter ist bewusst noch da,
// die Prüfung der Seite selbst bleibt davon grün.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function quelle(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('KONTAKT_TELEFON ist eine echte Nummer, kein Platzhalter', () => {
  const constants = quelle('src/constants.ts');
  const treffer = constants.match(/export const KONTAKT_TELEFON = '([^']*)'/);
  assert.ok(treffer, 'KONTAKT_TELEFON fehlt in src/constants.ts');
  const wert = treffer[1];

  assert.doesNotMatch(
    wert,
    /FEHLT|PLATZHALTER|\{\{TELEFON\}\}|【|□/,
    'Platzhalter steht noch in KONTAKT_TELEFON. Art. 246a § 1 Abs. 1 Nr. 3 EGBGB verlangt die Nummer; Gestaltungshinweis [2] der Anlage 1 ist sonst unvollständig gefüllt und die Gesetzlichkeitsfiktion entfällt.',
  );
  assert.match(
    wert,
    /^\+?[0-9][0-9 /()-]{5,}[0-9]$/,
    'KONTAKT_TELEFON ist keine Telefonnummer',
  );
});

test('Impressum, AGB und Widerruf setzen die Konstante ein', () => {
  for (const datei of ['src/pages/Imprint.tsx', 'src/pages/Agb.tsx', 'src/pages/Widerruf.tsx']) {
    const text = quelle(datei);
    assert.match(text, /KONTAKT_TELEFON/, `${datei} setzt KONTAKT_TELEFON nicht ein`);
    assert.doesNotMatch(text, /\{\{TELEFON\}\}/, `${datei} enthält noch {{TELEFON}}`);
    assert.doesNotMatch(text, /TELEFONNUMMER FEHLT/, `${datei} enthält den Platzhalter als Literal`);
  }
});
