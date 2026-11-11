// Vertragstexte und Kaufformular: Website gegen Auslieferungsdienst.
//
// Erst `npm run build`: Diese Prüfungen lesen das ausgelieferte HTML in docs/.
//
// Anlass: Sol-Review F1 (11.11.2026). Die Lesetests sicherten weder den
// vollständigen Wortlaut von AGB und Lizenzbedingungen gegenüber dem Dienst
// noch das dritte Kaufhäkchen ab. Ein geänderter Vertragsabsatz oder ein
// verlorenes Pflichtfeld blieb grün.
//
// Quelle des Dienstes: `DIENST_QUELLE` (Ordner des Auslieferungsdienstes) oder
// der Standardpfad wie in pilot.test.mjs. Fehlt die Quelle, SCHEITERN die Tests
// laut. Eine übersprungene Gegenprobe hieße: niemand bemerkt, dass Website und
// Vertragsmail verschiedene Texte tragen — das ist ausgerechnet der Fehler,
// den diese Datei verhindern soll.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIENST = process.env.DIENST_QUELLE
  || path.resolve(root, '..', '..', 'Software', 'Rholabs-fullfilment');
// Optional: der Rechtsbericht, aus dem der Android-Datenschutzblock stammt.
const F2B_V41 = process.env.F2B_V41_QUELLE
  || path.resolve(root, '..', 'gt-recht', '_recht', 'F2b_v41_Updater.md');

const lf = (text) => text.replace(/\r\n/g, '\n');
const quelle = (rel) => lf(fs.readFileSync(path.join(root, rel), 'utf8'));

/** Datei des Dienstes; fehlt sie, scheitert der Test (kein stilles Überspringen). */
function dienst(rel) {
  const voll = path.join(DIENST, rel);
  assert.ok(
    fs.existsSync(voll),
    `Quelle des Auslieferungsdienstes fehlt: ${voll}. Setze DIENST_QUELLE auf den Ordner des Dienstes `
    + '(z. B. C:\\Users\\Feixp\\wt\\fulfillment-public). Ohne sie ist der Abgleich der Vertragstexte nicht geprüft.',
  );
  return lf(fs.readFileSync(voll, 'utf8'));
}

function seite(rel) {
  const voll = path.join(root, 'docs', rel);
  assert.ok(fs.existsSync(voll), `${rel} fehlt im Erzeugnis — vorher \`npm run build\`.`);
  return lf(fs.readFileSync(voll, 'utf8'));
}

const ENTITAETEN = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&nbsp;': ' ' };

/** Sichtbarer Text, Leerraum zusammengezogen. */
function htmlText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(amp|lt|gt|quot|#x27|#39|nbsp);/g, (m) => ENTITAETEN[m])
    .replace(/\s+/g, ' ')
    .trim();
}

/** Export `export const NAME = \`…\`.trim();` aus einer TypeScript-Quelle des Dienstes. */
function schablone(ts, name) {
  const kopf = `export const ${name} = \``;
  const von = ts.indexOf(kopf);
  assert.ok(von > -1, `Export ${name} fehlt in rechtstexte.ts.`);
  const bis = ts.indexOf('`.trim();', von + kopf.length);
  assert.ok(bis > von, `Ende von ${name} nicht gefunden.`);
  const text = ts.slice(von + kopf.length, bis);
  assert.ok(!text.includes('${') && !text.includes('\\`'), `${name} enthält Ausdrücke oder maskierte Zeichen; der Test liest nur reinen Text.`);
  return text;
}

/** Markdown des Dienstes → der Text, den die Seite sichtbar zeigt. */
function ausMarkdown(md, telefon) {
  return md
    .replace(/\{\{TELEFON\}\}/g, telefon)
    .split('\n')
    .map((z) => z.replace(/^#+\s+/, '').replace(/^\s*(\d+\.|-)\s+/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Zeichenkette `'a' + 'b'` hinter `NAME =` bis zum Semikolon. */
function textkonstante(ts, name) {
  const kopf = ts.search(new RegExp(`(?:const|let)\\s+${name}\\s*=`));
  assert.ok(kopf > -1, `${name} fehlt in kauf.ts.`);
  const bis = ts.indexOf(';', kopf);
  const teile = [...ts.slice(kopf, bis).matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);
  assert.ok(teile.length > 0, `${name}: keine Zeichenkette gefunden.`);
  return teile.join('');
}

const telefon = () => quelle('src/constants.ts').match(/export const KONTAKT_TELEFON = '([^']+)'/)[1];

/* ── 1 · AGB und Lizenzbedingungen ─────────────────────────────────────── */

for (const [export_, ordner] of [
  ['AGB', 'agb'],
  ['LIZENZBEDINGUNGEN', 'lizenzbedingungen'],
]) {
  test(`R1 — ${ordner}: der sichtbare Vertragstext ist der des Dienstes (${export_})`, () => {
    const soll = ausMarkdown(schablone(dienst(path.join('src', 'main', 'rechtstexte.ts')), export_), telefon());
    assert.ok(!/\{\{[A-Z]+\}\}/.test(soll), 'Im Diensttext steht ein nicht aufgelöster Platzhalter.');
    const html = htmlText(seite(path.join(ordner, 'index.html')));
    // Von der Überschrift bis zum Hinweis am Seitenende (Impressum-/AGB-Verweis, nicht Vertragsinhalt).
    const von = html.indexOf(soll.slice(0, 40));
    const bis = html.indexOf('Anbieterangaben im Impressum');
    assert.ok(von > -1 && bis > von, `${ordner}: Beginn oder Ende des Vertragstexts nicht auffindbar.`);
    const ist = html.slice(von, bis).trim();
    if (ist !== soll) {
      let i = 0;
      while (i < ist.length && ist[i] === soll[i]) i++;
      assert.fail(
        `${ordner}: Website und Dienst weichen ab (Zeichen ${i}).\n  Website: …${ist.slice(Math.max(0, i - 40), i + 80)}\n  Dienst:  …${soll.slice(Math.max(0, i - 40), i + 80)}`,
      );
    }
    assert.ok(soll.length > 8000, 'Der Vergleichstext ist verdächtig kurz.');
  });
}

/* ── 2 · Kaufformular: die drei Häkchen ────────────────────────────────── */

test('R2 — /home: genau drei Pflichthäkchen, in Reihenfolge, nicht vorausgewählt, mit den Texten des Dienstes', () => {
  const kauf = dienst(path.join('src', 'main', 'kauf.ts'));
  const erwartet = [
    ['agb', textkonstante(kauf, 'EINWILLIGUNG_AGB_TEXT')],
    ['sofort_bereit', textkonstante(kauf, 'EINWILLIGUNG_SOFORT_TEXT')],
    ['abweichung_android', textkonstante(kauf, 'EINWILLIGUNG_ABWEICHUNG_ANDROID_TEXT')],
  ];
  const html = seite(path.join('home', 'index.html'));
  const formular = html.slice(html.indexOf('<form'), html.indexOf('</form>'));
  assert.ok(formular.length > 100, 'Das Kaufformular ist nicht auffindbar.');

  const labels = [...formular.matchAll(/<label\b[^>]*class="consent[^"]*"[^>]*>([\s\S]*?)<\/label>/g)].map((m) => m[1]);
  assert.equal(labels.length, 3, 'Das Formular trägt nicht genau drei Zustimmungsfelder.');

  const eingaben = [...formular.matchAll(/<input\b[^>]*type="checkbox"[^>]*>/g)].map((m) => m[0]);
  assert.equal(eingaben.length, 3, 'Das Formular trägt nicht genau drei Ankreuzfelder.');
  assert.deepEqual(
    eingaben.map((e) => e.match(/\bname="([^"]*)"/)?.[1]), erwartet.map(([name]) => name),
    'Namen oder Reihenfolge der Ankreuzfelder stimmen nicht. Die Widerrufsbelehrung spricht vom „zweiten Pflichtfeld“: '
    + '`sofort_bereit` muss das zweite sein, `abweichung_android` das dritte.',
  );

  erwartet.forEach(([name, text], i) => {
    const eingabe = eingaben[i];
    assert.match(eingabe, /\bvalue="ja"/, `${name}: value="ja" fehlt.`);
    assert.match(eingabe, /\brequired(=""|\s|\/|>)/, `${name}: ist kein Pflichtfeld.`);
    assert.doesNotMatch(eingabe, /\bchecked\b|\bdefaultChecked\b/i, `${name}: ist vorausgewählt.`);
    assert.ok(labels[i].includes(eingabe), `${name}: Feld und Beschriftung gehören nicht zusammen.`);
    const sichtbar = htmlText(labels[i]);
    assert.ok(
      sichtbar.startsWith(text),
      `${name}: Der Wortlaut des Häkchens weicht vom Dienst ab.\n  Website: ${sichtbar.slice(0, text.length + 20)}\n  Dienst:  ${text}`,
    );
  });
  // Das dritte Häkchen nennt nichts außer seinem Satz.
  assert.equal(htmlText(labels[2]), erwartet[2][1], 'Am dritten Häkchen steht mehr oder anderes als der Satz des Dienstes.');
});

/* ── 3 · Datenschutz, Abschnitt „Android-Fassung der Anwendung“ ─────────── */

/** Die Absätze des Objekts `id: 'android'` aus constants.ts. */
function androidAbsaetze() {
  const s = quelle('src/constants.ts');
  const von = s.indexOf("  {\n    id: 'android',");
  assert.ok(von > -1, "Das Objekt id: 'android' fehlt in constants.ts.");
  const bis = s.indexOf('\n  },\n', von);
  return s.slice(von, bis).split('\n').filter((z) => z.startsWith("      '")).map((z) => {
    assert.ok(z.endsWith("',"), `Absatz nicht einzeilig oder falsch beendet: ${z.slice(0, 60)}`);
    return z.slice(7, -2);
  });
}

test('R3 — Datenschutz android: sieben Absätze, wortgleich mit dem Block der Rechtsprüfung v4.1', () => {
  const referenz = JSON.parse(quelle('scripts/referenz/datenschutz-android-v41.json')).absaetze;
  assert.equal(referenz.length, 7);
  const ist = androidAbsaetze();
  assert.equal(ist.length, 7, 'Der Android-Abschnitt trägt nicht genau sieben Absätze.');
  referenz.forEach((soll, i) => assert.equal(ist[i], soll, `Android-Abschnitt, Absatz ${i + 1} weicht von der Referenz ab.`));
  assert.doesNotMatch(ist.join(' '), /Hinweise auf neue Versionen|Keine Update-Prüfung/, 'Ein durch v4.1 gestrichener Absatz ist wieder da.');
  assert.match(ist.join(' '), /Update-Prüfung\.\*\* Beim Start und danach höchstens alle zwölf Stunden/);

  // Und so steht er im ausgelieferten HTML, in dieser Reihenfolge.
  const html = htmlText(seite(path.join('datenschutz', 'index.html')));
  let stelle = html.indexOf('Android-Fassung der Anwendung');
  assert.ok(stelle > -1, 'Die Überschrift des Android-Abschnitts fehlt im HTML.');
  for (const absatz of referenz) {
    const sichtbar = absatz.replace(/\*\*/g, '').replace(/\s+/g, ' ');
    const i = html.indexOf(sichtbar, stelle);
    assert.ok(i >= stelle, `Im HTML fehlt (oder steht falsch) der Absatz: ${sichtbar.slice(0, 70)}…`);
    stelle = i + sichtbar.length;
  }
  assert.match(html, /Stand: 11\. November 2026/);
});

test('R3b — die Referenz stammt aus dem Rechtsbericht v4.1 (wenn der Bericht erreichbar ist)', () => {
  if (!fs.existsSync(F2B_V41)) {
    console.log(`      ℹ Rechtsbericht nicht gefunden (${F2B_V41}) — nur die Referenzdatei im Repo gilt.`);
    return;
  }
  const referenz = JSON.parse(quelle('scripts/referenz/datenschutz-android-v41.json')).absaetze;
  const bericht = lf(fs.readFileSync(F2B_V41, 'utf8')).split('\n').filter((z) => z.startsWith("      '**"))
    .map((z) => z.replace(/^\s*'/, '').replace(/',$/, ''));
  // Reihenfolge im Bericht: Was sendet, Update-Prüfung, Download, (Variante) Hinweise per E-Mail.
  assert.equal(bericht[0], referenz[3]);
  assert.equal(bericht[1], referenz[4]);
  assert.equal(bericht[2], referenz[5]);
});
