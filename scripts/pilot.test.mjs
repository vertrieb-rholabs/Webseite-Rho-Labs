// Das Pilotprogramm — Lesetests der Website (Auftrag W1, 06.10.2026).
//
// Wie `befunde.test.mjs`: geprüft wird an zwei Orten, und beides ist nötig.
//   QUELLE   — damit erkennbar bleibt, WARUM etwas so dasteht.
//   ERZEUGNIS (docs/) — damit die Aussage für die AUSGELIEFERTE Seite gilt.
// Deshalb vorher `npm run build`. Der Dienst wird als Gegenprobe mitgelesen
// (`../../Software/Rholabs-fullfilment` oder `DIENST_QUELLE`), die App für die
// Zahlen der Lizenzprüfung (`../../Software/Gedaechtniss-Training` oder
// `APP_QUELLE`). Fehlt einer von beiden, wird die Gegenprobe ÜBERSPRUNGEN und
// das gesagt — nicht stillschweigend für bestanden erklärt.
//
// ── Stand nach S3 und W3 ────────────────────────────────────────────────────
//  · Der Dienst trägt den kanonischen Text der Pilotbedingungen (S2); die Tests
//    zum Text und zu den Feldern der Zustimmung laufen gegen seinen jetzigen
//    Quelltext. Zeilenenden des Dienst-Quelltexts werden vor dem Vergleichen
//    normalisiert (CRLF → LF): eine Windows-Arbeitskopie mit CRLF ist kein
//    Fehler des Dienstes.
//  · Das Freigabe-Tor „kein TODO-S2" ist grün, seit der Satz zur Aufbewahrung
//    der Protokolle (Bericht S2, Abschnitt 5) eingesetzt ist. Der zweite
//    Halbsatz („Systemprotokoll … nach 30 Tagen") gilt erst, wenn journald auf
//    dem Server auf 30 Tage steht; das ist eine Freigabebedingung des Inhabers,
//    kein Zustand, den die Website prüfen könnte. Der Test hält nur fest, dass
//    der Bericht S2 das Ziel (`MaxRetentionSec=30day`) nennt.
//  · Die Regel „wurde eine Pilotpartner-Anpassung vereinbart, ein Jahr später"
//    (Speicherdauer) ist seit S3 im Dienst umgesetzt und geprüft (P13). Ebenso
//    werden der Ratenbegrenzer (höchstens eine Stunde im Arbeitsspeicher, P13)
//    und die Pfaderkennung in pfade.ts (P13b) geprüft.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIENST = process.env.DIENST_QUELLE
  || path.resolve(root, '..', '..', 'Software', 'Rholabs-fullfilment');
const APP = process.env.APP_QUELLE
  || path.resolve(root, '..', '..', 'Software', 'Gedaechtniss-Training');
// Die Berichte des Pilotprogramms (nur lesen): dort steht der Bericht S2.
const BERICHTE = process.env.BERICHTE_QUELLE
  || path.resolve(root, '..', 'Pilotprogramm', 'berichte');

/* ── Lesehelfer ──────────────────────────────────────────────────────────── */

function quelle(rel) {
  try {
    return lf(fs.readFileSync(path.join(root, rel), 'utf8'));
  } catch {
    return '';
  }
}

function ohneKommentare(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function seite(rel) {
  const voll = path.join(root, 'docs', rel);
  if (!fs.existsSync(voll)) {
    assert.fail(`${rel} fehlt im Erzeugnis. Diese Tests prüfen die ausgelieferte Seite — vorher \`npm run build\`.`);
  }
  return fs.readFileSync(voll, 'utf8');
}

/** Datei des Dienstes oder `null` (dann sagt der Test, dass die Gegenprobe fehlte). */
function dienst(rel) {
  const voll = path.join(DIENST, rel);
  return fs.existsSync(voll) ? lf(fs.readFileSync(voll, 'utf8')) : null;
}

function app(rel) {
  const voll = path.join(APP, rel);
  return fs.existsSync(voll) ? lf(fs.readFileSync(voll, 'utf8')) : null;
}

/** Zeilenenden normalisieren: Eine Windows-Arbeitskopie mit CRLF darf keinen Test rot machen. */
function lf(text) {
  return text.replace(/\r\n/g, '\n');
}

function fehlt(was, pfad) {
  console.log(`      ℹ ${was} nicht gefunden (${pfad}) — die Gegenprobe lief NICHT mit.`);
}

const ENTITAETEN = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&nbsp;': ' ' };

/** Sichtbarer Text einer ausgelieferten Seite: ohne Skripte, Stile, Kommentare und Tags. */
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

/** Die Tags eines Namens mit ihren Attributen. */
function tags(html, name) {
  const aus = [];
  for (const m of html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'g'))) {
    const attribute = {};
    for (const a of m[1].matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) attribute[a[1]] = a[2] ?? '';
    aus.push(attribute);
  }
  return aus;
}

function formular(html, actionTeil) {
  const re = /<form\b[^>]*>[\s\S]*?<\/form>/g;
  for (const m of html.matchAll(re)) {
    if (m[0].includes(actionTeil)) return m[0];
  }
  return null;
}

const canon = (text) => String(text).replace(/\r\n/g, '\n').trim();

const sortiert = (liste) => [...new Set(liste)].sort();

/* ── 1 · Routen ──────────────────────────────────────────────────────────── */
test('P1 — jede Pilotseite steht in ALLEN DREI Listen, die Sitemap nur die beiden indexierbaren', () => {
  const routen = [
    'pilotpartner', 'pilotpartner/danke', 'pilotpartner/zustimmung',
    'pilotpartner/zustimmung/fertig', 'pilotpartner/zustimmung/fehler', 'pilotbedingungen',
  ];
  const appTsx = quelle('src/App.tsx');
  const vite = quelle('vite.config.ts');
  const hydration = quelle('scripts/hydration-check.mjs');
  const sitemap = quelle('public/sitemap.xml');

  for (const r of routen) {
    assert.match(appTsx, new RegExp(`path:\\s*'${r}'`), `src/App.tsx kennt /${r} nicht.`);
    assert.match(vite, new RegExp(`'/${r}/'`), `vite.config.ts rendert /${r} nicht vor — der Rückweg des Dienstes liefe in den 404.`);
    assert.ok(
      hydration.includes(`'/${r}/'`),
      `Die Hydrationsprüfung sieht /${r} nicht an.`,
    );
    seite(path.join(...r.split('/'), 'index.html'));
  }

  assert.match(sitemap, /<loc>https:\/\/rholabs\.de\/pilotpartner\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/rholabs\.de\/pilotbedingungen\/<\/loc>/);
  for (const r of ['pilotpartner/danke', 'pilotpartner/zustimmung', 'pilotpartner/zustimmung/fertig', 'pilotpartner/zustimmung/fehler']) {
    assert.ok(!sitemap.includes(`/${r}`), `Die Sitemap führt /${r} — Status- und Zustimmungsseiten gehören nicht hinein.`);
  }

  // Vorgerenderte Routen und Hydrationsliste nennen dieselben Seiten.
  const norm = (liste) => liste.map((x) => x.replace(/\/$/, '')).sort();
  const aus = (text) => [...text.matchAll(/^\s*'(\/[^']*)',?$/gm)].map((m) => m[1]).filter((x) => !['/foo-bar', '/404', '/404.html'].includes(x.replace(/\/$/, '')));
  assert.deepEqual(norm(aus(hydration)), norm(aus(vite.slice(vite.indexOf('const ROUTES'), vite.indexOf(']')))));
});

test('P1b — die Status- und Zustimmungsseiten tragen noindex, die beiden anderen nicht', () => {
  for (const r of ['pilotpartner/danke', 'pilotpartner/zustimmung', 'pilotpartner/zustimmung/fertig', 'pilotpartner/zustimmung/fehler']) {
    assert.match(seite(path.join(...r.split('/'), 'index.html')), /<meta[^>]*name="robots" content="noindex, follow"/, `/${r} ohne noindex.`);
  }
  for (const r of ['pilotpartner', 'pilotbedingungen']) {
    assert.doesNotMatch(seite(path.join(r, 'index.html')), /noindex/, `/${r} trägt noindex, soll aber indexierbar sein.`);
  }
});

/* ── 2 · Pilotbedingungen: Text zeichengenau wie im Dienst ───────────────── */

/** `PILOT_BEDINGUNGEN_TEXT` aus einer TS-Quelle: die Vorlage auswerten, wie JavaScript es täte. */
function bedingungenText(ts) {
  const m = /export const PILOT_BEDINGUNGEN_TEXT\s*=\s*`([\s\S]*?)`;/.exec(ts);
  if (!m) return null;
  // eslint-disable-next-line no-new-func
  return new Function(`return \`${m[1]}\``)();
}

test('P2 — der Text der Pilotbedingungen ist zeichengenau der des Dienstes', () => {
  const eigen = bedingungenText(quelle('src/pilotbedingungen.ts'));
  assert.ok(eigen, 'src/pilotbedingungen.ts trägt keinen Text.');
  assert.match(eigen, /^Pilotbedingungen für das Pilotprogramm von Rho-Labs\nFassung P1-2026-10 vom 6\. Oktober 2026\n/);
  assert.match(eigen, /\nAnhang: Datenschutzhinweise für Pilotpartner \(Empfehlungen\)\n/);
  assert.match(quelle('src/pilotbedingungen.ts'), /export const PILOT_FASSUNG = 'P1-2026-10';/);

  const ts = dienst(path.join('src', 'main', 'pilot-bedingungen.ts'));
  if (ts === null) return fehlt('Dienst', DIENST);
  const fassung = /export const PILOT_BEDINGUNGEN_FASSUNG\s*=\s*'([^']+)'/.exec(ts)?.[1];
  assert.equal(fassung, 'P1-2026-10', 'Die Fassungskennung des Dienstes weicht von der der Website ab.');
  const dort = bedingungenText(ts);
  assert.ok(dort, 'Der Dienst trägt keinen PILOT_BEDINGUNGEN_TEXT.');
  assert.ok(
    !/ENTWURF/.test(dort),
    'Der Dienst trägt noch den Platzhalter („ENTWURF"). Der Text kommt mit Auftrag S2 — danach diesen Test erneut laufen lassen.',
  );
  assert.equal(
    canon(eigen), canon(dort),
    'Der Text der Pilotbedingungen auf der Website und im Dienst weicht ab. Der Dienst bildet über seinen '
    + 'Text den SHA-256 des Zustimmungsprotokolls — beide müssen zeichengenau übereinstimmen.',
  );
});

test('P3 — /pilotbedingungen zeigt jede Zeile des Textes, in der Reihenfolge', () => {
  const html = seite(path.join('pilotbedingungen', 'index.html'));
  const text = htmlText(html);
  const zeilen = canon(bedingungenText(quelle('src/pilotbedingungen.ts'))).split('\n').filter((z) => z.trim() !== '');
  let von = 0;
  for (const zeile of zeilen) {
    // Im Anhang steht die Nummer („1. ") als Listenzeichen, nicht im Text.
    const gesucht = zeile.replace(/^\d+\.\s+/, '').replace(/\s+/g, ' ');
    const stelle = text.indexOf(gesucht, von);
    assert.ok(stelle >= 0, `Die Seite zeigt diese Zeile nicht (oder nicht in dieser Reihenfolge): „${gesucht.slice(0, 90)}…"`);
    von = stelle + gesucht.length;
  }
  assert.match(text, /Fassung P1-2026-10 vom 6\. Oktober 2026/);
  assert.match(html, /<div class="legal-block legal-block--anhang" id="anhang"><h2>Anhang: Datenschutzhinweise für Pilotpartner \(Empfehlungen\)<\/h2>/);
  assert.equal((html.match(/<ol>/g) || []).length, 1, 'Der Anhang ist eine nummerierte Liste.');
  assert.equal((html.match(/<li>/g) || []).length >= 9, true, 'Die neun Hinweise des Anhangs fehlen.');
});

/* ── 3 · Bewerbungsformular gegen den Dienst ─────────────────────────────── */

test('P4 — das Bewerbungsformular ist ein klassischer POST mit den Feldern und Grenzen des Dienstes', () => {
  const html = seite(path.join('pilotpartner', 'index.html'));
  const form = formular(html, 'api/public/pilot/bewerbung');
  assert.ok(form, 'Kein Formular mit dem Ziel …/api/public/pilot/bewerbung.');
  assert.match(form, /<form[^>]*method="post"/, 'Kein POST.');
  assert.doesNotMatch(form, /<form[^>]*enctype/, 'enctype gesetzt — der Dienst liest nur application/x-www-form-urlencoded.');
  assert.match(form, /<form[^>]*action="https:\/\/fulfillment\.rholabs\.de\/api\/public\/pilot\/bewerbung"/);
  assert.match(html, /<section class="wrap wrap--form section" id="bewerbung">/, 'Der Anker #bewerbung fehlt.');

  const eingaben = [...tags(form, 'input'), ...tags(form, 'textarea'), ...tags(form, 'select')];
  const namen = eingaben.map((e) => e.name).filter(Boolean);
  assert.deepEqual(
    sortiert(namen),
    sortiert(['einrichtung', 'ansprechperson', 'email', 'telefon', 'art', 'zielgruppe', 'einsatz', 'datenschutz', 'webseite']),
    'Die Feldnamen des Formulars weichen von denen des Dienstes ab.',
  );
  const feld = (n) => eingaben.find((e) => e.name === n);

  for (const n of ['einrichtung', 'ansprechperson', 'email', 'art', 'zielgruppe', 'einsatz', 'datenschutz']) {
    assert.ok('required' in feld(n), `${n} ist beim Dienst Pflicht, hier nicht.`);
  }
  assert.ok(!('required' in feld('telefon')), 'telefon ist freiwillig.');
  assert.equal(feld('datenschutz').value, 'ja');
  assert.equal(feld('datenschutz').type, 'checkbox');
  assert.equal(feld('email').type, 'email');

  // Lockfeld wie in den bestehenden Formularen.
  assert.equal(feld('webseite').tabindex, '-1');
  assert.equal(feld('webseite').autocomplete, 'off');
  assert.match(form, /<div class="honeypot" aria-hidden="true">/);

  // Barrierefreiheit: jedes Feld hat ein Label, jeder Hinweis hängt per aria-describedby am Feld.
  for (const e of eingaben.filter((x) => x.name && x.name !== 'webseite' && x.name !== 'datenschutz')) {
    assert.match(form, new RegExp(`<label for="${e.id}"`), `Kein Label zu ${e.name}.`);
  }
  for (const e of eingaben.filter((x) => x['aria-describedby'])) {
    assert.match(form, new RegExp(`id="${e['aria-describedby']}"`), `aria-describedby zeigt ins Leere (${e.name}).`);
  }
  for (const n of ['telefon', 'art', 'zielgruppe', 'einsatz']) assert.ok(feld(n)['aria-describedby'], `${n} ohne Hinweisbindung.`);
  assert.match(form, /<label class="check"><input type="checkbox"[^>]*name="datenschutz"/);
  assert.match(form, /href="\/datenschutz\/#pilotprogramm"/);
  // Fehlerbereich als Live-Region.
  assert.match(html, /aria-live="polite"/);
  // Ohne JavaScript: Hinweis.
  assert.match(form, /<noscript>/);
});

test('P4b — Längen, Auswahlwerte und Rückweg-Kennungen stimmen mit dem Dienst überein', () => {
  const ts = dienst(path.join('src', 'main', 'pilot.ts'));
  if (ts === null) return fehlt('Dienst', DIENST);
  const html = seite(path.join('pilotpartner', 'index.html'));
  const form = formular(html, 'api/public/pilot/bewerbung');
  const eingaben = [...tags(form, 'input'), ...tags(form, 'textarea')];
  const feld = (n) => eingaben.find((e) => e.name === n);
  const code = ohneKommentare(ts);

  // Längen: einzeilig(k.x, min, max) / mehrzeilig(k.x, min, max)
  for (const m of code.matchAll(/(?:einzeilig|mehrzeilig)\(k\.(einrichtung|ansprechperson|zielgruppe|einsatz),\s*(\d+),\s*(\d+)\)/g)) {
    const [, n, min, max] = m;
    assert.equal(feld(n).maxlength, max, `maxlength von ${n} ≠ Dienst (${max}).`);
    assert.equal(feld(n).minlength, min, `minlength von ${n} ≠ Dienst (${min}).`);
  }
  assert.equal(feld('telefon').maxlength, '40', 'maxlength des Telefons ≠ Dienst (40).');
  assert.ok(/s\.length > 40/.test(code), 'Der Dienst prüft die Telefonlänge nicht mehr bei 40.');
  assert.equal(feld('email').maxlength, '254');
  assert.ok(/s\.length > 254/.test(code), 'Der Dienst prüft die Adresslänge nicht mehr bei 254.');

  // Auswahlwerte der Art.
  const arten = /export const PILOT_ARTEN\s*=\s*\[([\s\S]*?)\]\s*as const/.exec(ts)?.[1];
  assert.ok(arten, 'PILOT_ARTEN im Dienst nicht gefunden.');
  const dienstWerte = [...arten.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
  const optionen = [...form.matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]).filter((w) => w !== '');
  assert.deepEqual(optionen, dienstWerte, 'Die Auswahlwerte der Art der Einrichtung weichen vom Dienst ab (Auftrag S2 Nr. 1).');
  assert.ok(/<option value="" disabled/.test(form), 'Die Auswahl hat keinen Platzhalter ohne Wert.');

  // Rückweg-Kennungen.
  const dienstCodes = [...(/export type BewerbungFehler = ([^;]+);/.exec(ts)?.[1] ?? '').matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
  assert.deepEqual(sortiert(dienstCodes), sortiert(['eingabe', 'zu_viele', 'intern']));
  const kaesten = [...html.matchAll(/data-rueckweg="([^"]+)" hidden/g)].map((m) => m[1]);
  assert.deepEqual(sortiert(kaesten), sortiert(dienstCodes), 'Die vorgerenderten Rückweg-Kästen decken nicht genau die Kennungen des Dienstes ab.');
  assert.match(html, /\[?w===\\?"eingabe\\?"\|\|w===\\?"zu_viele\\?"\|\|w===\\?"intern\\?"/, 'Das Skript kennt die Kennungen nicht.');
  assert.match(ts, /\$\{WEBSITE\}\/pilotpartner\?fehler=\$\{code\}#bewerbung/, 'Das Ziel der Bewerbungsfehler hat sich geändert.');
  assert.match(ts, /\$\{WEBSITE\}\/pilotpartner\/danke/);
});

test('P4c — die Fehlertexte sind die aus T1', () => {
  const src = quelle('src/pages/PilotPartner.tsx');
  for (const satz of [
    'Bitte prüfen Sie Ihre Angaben — ein Pflichtfeld fehlt oder ist zu lang.',
    'Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.',
    'Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an info@rholabs.de.',
  ]) assert.ok(src.includes(satz), `Fehlertext fehlt: ${satz}`);
  const html = seite(path.join('pilotpartner', 'index.html'));
  assert.equal([...html.matchAll(/data-vorab="" data-rueckweg="[^"]+" hidden=""/g)].length, 3, 'Die drei Kästen stehen nicht verborgen im HTML.');
});

/* ── 4 · Zustimmungsseite ────────────────────────────────────────────────── */

test('P5 — das Zustimmungsformular sendet genau die Felder, die der Dienst liest', () => {
  const src = quelle('src/pages/pilot/PilotZustimmung.tsx');
  const code = ohneKommentare(src);
  const namen = [...code.matchAll(/\bname="([a-z_]+)"/g)].map((m) => m[1]).filter((n) => n !== 'referrer');
  assert.deepEqual(
    sortiert(namen),
    sortiert(['t', 'fassung', 'traeger', 'anschrift', 'name', 'funktion', 'bedingungen', 'befugnis', 'unternehmer', 'feedback_mails']),
  );
  assert.match(code, /<input type="hidden" name="t" value=\{token\}/);
  assert.match(code, /<input type="hidden" name="fassung" value=\{PILOT_FASSUNG\}/);
  for (const n of ['bedingungen', 'befugnis', 'unternehmer']) {
    assert.match(code, new RegExp(`name="${n}" value="ja" required`), `${n} ist beim Dienst Pflicht und muss ja senden.`);
  }
  assert.match(code, /name="feedback_mails" value="ja" \/>/);
  assert.ok(!/name="feedback_mails"[^>]*required/.test(code), 'feedback_mails ist freiwillig.');
  assert.match(quelle('src/constants.ts'), /PILOT_ZUSTIMMUNG_ACTION = `\$\{API_BASIS\}\/api\/public\/pilot\/zustimmung`/);
  assert.match(quelle('src/constants.ts'), /PILOT_ZUSTIMMUNG_INFO_URL = `\$\{API_BASIS\}\/api\/public\/pilot\/zustimmung\/info`/);
  for (const [n, min, max] of [['traeger', 2, 200], ['anschrift', 5, 300], ['name', 2, 100], ['funktion', 2, 100]]) {
    assert.match(code, new RegExp(`name="${n}"[\\s\\S]{0,160}minLength=\\{${min}\\}[\\s\\S]{0,40}maxLength=\\{${max}\\}`), `Grenzen von ${n}.`);
  }

  const ts = dienst(path.join('src', 'main', 'pilot.ts'));
  if (ts === null) return fehlt('Dienst', DIENST);
  const start = ts.indexOf("'/pilot/zustimmung',\n");
  assert.ok(start > 0, 'Der Zustimmungs-Endpunkt ist im Dienst nicht zu finden.');
  const region = ohneKommentare(ts.slice(start, start + 6000));
  const dienstFelder = [...new Set([...region.matchAll(/\bk\.([a-z_]+)/g)].map((m) => m[1]))];
  assert.deepEqual(
    sortiert(dienstFelder), sortiert(namen),
    'Die Felder, die der Dienst bei der Zustimmung liest, weichen von denen des Formulars ab (Auftrag S2 Nr. 3 und 12).',
  );
  for (const m of region.matchAll(/(?:einzeilig|mehrzeilig)\(k\.([a-z_]+),\s*(\d+),\s*(\d+)\)/g)) {
    assert.match(code, new RegExp(`name="${m[1]}"[\\s\\S]{0,160}minLength=\\{${m[2]}\\}[\\s\\S]{0,40}maxLength=\\{${m[3]}\\}`), `Grenzen von ${m[1]} ≠ Dienst.`);
  }
  assert.match(ts, /\$\{WEBSITE\}\/pilotpartner\/zustimmung\/fertig/);
  assert.match(ts, /\$\{WEBSITE\}\/pilotpartner\/zustimmung\/fehler\?grund=\$\{grund\}/);
  const gruende = [...(/export type ZustimmungFehler = ([^;]+);/.exec(ts)?.[1] ?? '').matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
  const html = seite(path.join('pilotpartner', 'zustimmung', 'fehler', 'index.html'));
  const kaesten = [...html.matchAll(/data-rueckweg="([^"]+)" hidden/g)].map((m) => m[1]);
  assert.deepEqual(sortiert(kaesten), sortiert(gruende), 'Die Rückweg-Kästen der Fehlerseite decken nicht genau die Gründe des Dienstes ab.');
  assert.match(ts, /ZUSTIMMUNGSSEITE_URL = `\$\{WEBSITE\}\/pilotpartner\/zustimmung`/);
});

test('P5b — die Zustimmungsseite behandelt den Einmal-Link als Geheimnis', () => {
  const src = quelle('src/pages/pilot/PilotZustimmung.tsx');
  const code = ohneKommentare(src);
  assert.doesNotMatch(code, /console\./, 'Die Seite schreibt in die Konsole — dort darf der Token nicht landen.');
  assert.doesNotMatch(code, /localStorage|sessionStorage|document\.cookie|indexedDB/, 'Die Seite speichert etwas.');
  assert.doesNotMatch(code, /history\.(replace|push)State|location\.(href|assign|replace)\s*=/, 'Die Seite schreibt den Token in eine andere Adresse.');
  assert.match(code, /referrerPolicy: 'no-referrer'/, 'Die Anfrage nach dem Angebot sendet einen Referer.');
  assert.match(code, /credentials: 'omit'/);
  assert.match(code, /const TOKEN_MUSTER = \/\^\[A-Za-z0-9_-\]\{1,128\}\$\//, 'Der Token wird nicht auf Form und Länge geprüft.');
  assert.match(code, /referrerPolicy="no-referrer"/, 'Der Link auf die Bedingungen hat keine Referrer-Richtlinie.');
  assert.doesNotMatch(code, /to="[^"]*\$\{|href=\{`[^`]*\$\{token/, 'Ein Link trägt den Token weiter.');

  const html = seite(path.join('pilotpartner', 'zustimmung', 'index.html'));
  assert.match(html, /<meta[^>]*name="referrer" content="no-referrer"/, 'Die Seite setzt den Referrer nicht auf no-referrer.');
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /<form\b/, 'Vorgerendert darf kein Formular da sein: Die Seite kennt weder Token noch Angebot.');
  assert.match(html, /Bitte aktivieren Sie JavaScript oder antworten Sie auf unsere E-Mail\./);
  assert.match(html, /Pilotbedingungen bestätigen/);
});

test('P5c — die Zustimmungsseite trägt die Texte aus T1', () => {
  const src = quelle('src/pages/pilot/PilotZustimmung.tsx').replace(/\s+/g, ' ');
  for (const satz of [
    'Dieser Link ist nicht mehr gültig. Bitte schreiben Sie uns an',
    'Der Vertrag entsteht, wenn Sie auf „Pilotbedingungen annehmen“ klicken. Ihre Eingaben können Sie vorher im Formular ändern. Vertragssprache ist Deutsch. Wir speichern den Vertragstext mit den Angaben dieses Angebots und senden Ihnen eine Abschrift per E-Mail.',
    'z. B. Name der Inhaberin oder des Inhabers der Praxis, Name der GmbH, des Vereins oder der Kommune',
    'z. B. Inhaberin, Leitung, Geschäftsführung',
    'Ich habe die Pilotbedingungen (Fassung {PILOT_FASSUNG}) gelesen und nehme sie für den oben genannten Träger an.',
    'Ich bin berechtigt, für diesen Träger zu handeln.',
    'Der Träger handelt in seiner gewerblichen oder selbständigen beruflichen Tätigkeit oder als öffentliche Stelle, nicht als Verbraucher.',
    'Ich möchte während des Pilotzeitraums höchstens einmal wöchentlich eine E-Mail mit Fragen zur Bedienung und Organisation erhalten. Ich kann das jederzeit abbestellen; die Teilnahme bleibt davon unberührt.',
    'Pilotbedingungen annehmen',
    'Pilotbedingungen lesen',
    'Letzter Nutzungstag',
  ]) assert.ok(src.includes(satz), `Text fehlt auf der Zustimmungsseite: ${satz}`);
  // Der letzte Nutzungstag ist Start + 41 Tage (Rückfall, falls der Dienst ihn nicht liefert).
  assert.match(src, /setUTCDate\(d\.getUTCDate\(\) \+ 41\)/);
});

test('P6 — Danke-, Fertig- und Fehlerseite sagen, was T1 vorgibt', () => {
  const danke = htmlText(seite(path.join('pilotpartner', 'danke', 'index.html')));
  assert.match(danke, /Danke für Ihre Bewerbung/);
  assert.match(danke, /Wir prüfen Ihre Angaben und melden uns innerhalb von fünf Werktagen per E-Mail\. Mit der Bewerbung ist noch kein Vertrag entstanden\./);

  const fertig = htmlText(seite(path.join('pilotpartner', 'zustimmung', 'fertig', 'index.html')));
  assert.match(fertig, /Vielen Dank\b/);
  assert.match(fertig, /Ihre Zustimmung ist gespeichert\. Eine Bestätigung mit den Pilotbedingungen erhalten Sie per E-Mail\. Wir melden uns, um das Onboarding zu vereinbaren\. Ihren Lizenzschlüssel erhalten Sie zum Pilotstart\./);

  const fehlerHtml = seite(path.join('pilotpartner', 'zustimmung', 'fehler', 'index.html'));
  const fehler = htmlText(fehlerHtml);
  for (const satz of [
    'Dieser Link ist abgelaufen oder wurde bereits verwendet.',
    'Die Pilotbedingungen wurden inzwischen aktualisiert. Bitte öffnen Sie den Link aus unserer E-Mail erneut.',
    'Bitte füllen Sie alle Felder aus und bestätigen Sie alle drei Punkte.',
    'Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.',
    'Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an info@rholabs.de.',
  ]) assert.ok(fehler.includes(satz), `Fehlertext fehlt: ${satz}`);
  assert.match(fehlerHtml, /info@rholabs\.de/, 'Die Kontaktadresse fehlt.');
  assert.match(fehlerHtml, /\(function\(\)\{try\{/, 'Das Rückweg-Skript fehlt.');
});

/* ── 5 · Pilotseite: Inhalt und Formulierungsregeln (R1 1.4) ─────────────── */

test('P7 — die Pilotseite trägt Titel, Beschreibung und Kernsätze aus T1', () => {
  const html = seite(path.join('pilotpartner', 'index.html'));
  assert.match(html, /<title[^>]*>Pilotpartner gesucht — Rho-Labs Kognitives Training<\/title>/);
  assert.match(html, /<meta[^>]*name="description" content="Rho-Labs sucht drei bis fünf Praxen und Einrichtungen, die die Trainingssoftware sechs Wochen kostenlos im Arbeitsalltag erproben und mitgestalten\. Unverbindlich bewerben\."/);
  // Der Hinweis „(öffnet in neuem Tab)" ist nur für Screenreader da und gehört nicht zum Satz aus T1.
  const text = htmlText(html).replace(/ \(öffnet in neuem Tab\)/g, '');
  for (const satz of [
    'Pilotprogramm',
    'Pilotpartner für kognitives Training gesucht',
    'Wir suchen ausgewählte Praxen und Einrichtungen, die Rho-Labs Kognitives Training sechs Wochen im realen Arbeitsalltag erproben und gemeinsam mit uns weiterentwickeln möchten.',
    'Drei bis fünf Plätze · kostenlos · keine Kaufverpflichtung',
    'Als Pilotpartner bewerben',
    'Pilotbedingungen lesen',
    '6 Wochen kostenlos',
    'Voller Zugang zur Version für Praxen und Einrichtungen. Der Pilot endet automatisch; es gibt keine Kaufverpflichtung.',
    'Direkter Austausch',
    'Software mitgestalten',
    'Rho-Labs Kognitives Training ist eine Software für kognitives Training unter Windows. Sie ist für Menschen unterschiedlichen Alters und unterschiedlicher Leistungsniveaus gestaltet: einstellbare Schwierigkeit, ruhige Darstellung, große Bedienelemente.',
    '25 Übungen in vier Bereichen — Merken & Lernen, Raum & Formen, Denken & Steuern, Tempo & Aufmerksamkeit.',
    'Übungswerte aus einem fiktiven Beispielprofil.',
    'Was wir gemeinsam herausfinden wollen',
    'So läuft der Pilot ab',
    'eine Studie oder Prüfung von Wirkungen',
    'Windows 10 oder 11 (64 Bit) mit laufenden Sicherheitsupdates',
    'Die Bewerbung ist unverbindlich und kostenlos. Sie begründet keinen Vertrag. Wir melden uns innerhalb von fünf Werktagen per E-Mail.',
    'Nur für Rückfragen zu dieser Bewerbung.',
    'Die Angabe dient nur der organisatorischen Einordnung.',
    'Praxis oder Beratungsstelle', 'Stationäre oder ambulante Einrichtung', 'Seniorenarbeit', 'Pflege oder Betreuung', 'Bildung, Verein oder Freizeit',
    'Ich habe die Datenschutzhinweise gelesen. Die Angaben werden zur Bearbeitung der Bewerbung gespeichert und nach den dort genannten Fristen gelöscht.',
    'Was kostet die Teilnahme?', 'Werden wir als Referenz genannt?',
    'Nur, wenn Sie das nach dem Pilot ausdrücklich möchten. Das ist freiwillig und keine Bedingung für die Teilnahme.',
  ]) assert.ok(text.includes(satz), `Die Pilotseite trägt diesen Text nicht: „${satz.slice(0, 80)}…"`);
  assert.doesNotMatch(text, /Kostenlos testen/, 'T1 verbietet „Kostenlos testen" als Knopf.');
  assert.equal((html.match(/<details>/g) || []).length, 8, 'Sieben Fragen und die Übungsliste sind aufklappbar (<details>).');
  assert.equal((html.match(/<details><summary>/g) || []).length, 8);
  for (const f of ['app-katalog.webp', 'app-verlauf.webp', 'app-radar.webp']) {
    assert.ok(fs.existsSync(path.join(root, 'public', 'bilder', f)), `${f} fehlt`);
    assert.match(html, new RegExp(`src="/bilder/${f}" alt="[^"]{20,}"`), `${f}: kein sinnvoller Alt-Text.`);
  }
});

test('P8 — verbotene Begriffe (R1 1.4) stehen auf den Seiten nur in der Zweckbestimmung und in verneinender Form', () => {
  const VERBOTEN = /therap|behandl|rehabilit|demenz|schlaganfall|normwert|nachweislich|wirksam|diagnos(?!tica)|klientenverwalt|vorlegen kann|trainingswirkung/gi;
  const ZWECK = quelle('src/constants.ts').match(/export const ZWECKBESTIMMUNG =\s*'([^']+)'/)[1];
  // Ausgenommen sind: die Zweckbestimmung selbst, und wenige Sätze, die den Ausschluss ausdrücklich benennen.
  const ERLAUBT = [
    ZWECK,
    'Ein therapeutischer oder diagnostischer Zweck ist kein Auswahlkriterium.',
    'keine normierte oder diagnostische Bewertung',
    'Bitte keine Angaben zu einzelnen Personen, Diagnosen oder Krankheitsbildern.',
    'Bitte mache im Freitext keine Angaben zu einzelnen Personen, die du betreust, und keine Angaben zu Gesundheit oder Diagnosen.',
    'Enthält eine Bewerbung solche Angaben dennoch, löschen wir sie',
  ];
  const seitenMitRegeln = ['index.html', 'kognitives-training', 'home', 'kontakt', 'evidenz', 'pilotpartner', 'impressum'];
  const befunde = [];
  for (const rel of seitenMitRegeln) {
    const datei = rel === 'index.html' ? 'index.html' : path.join(rel, 'index.html');
    let text = htmlText(seite(datei));
    for (const ok of ERLAUBT) text = text.split(ok).join(' ');
    for (const m of text.matchAll(VERBOTEN)) befunde.push(`${rel}: „${text.slice(Math.max(0, m.index - 40), m.index + 40)}"`);
  }
  assert.deepEqual(befunde, [], `Verbotene Begriffe außerhalb der Zweckbestimmung:\n${befunde.join('\n')}`);

  // Die ausgelieferten Dateien nennen die alten Wendungen nirgends mehr (auch nicht im Bündel).
  const alle = [];
  const gehe = (ordner) => {
    for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
      const voll = path.join(ordner, e.name);
      if (e.isDirectory()) gehe(voll);
      else if (/\.(html|js|css|xml|txt)$/.test(e.name)) alle.push(voll);
    }
  };
  gehe(path.join(root, 'docs'));
  for (const datei of alle) {
    const inhalt = fs.readFileSync(datei, 'utf8');
    for (const alt of ['Anpassung der Normwerte', 'Normwerte anpassen', 'zugelassenes Therapieinstrument', 'Statistik, die man vorlegen kann', 'Klientenverwaltung', 'Klientinnen und Klienten', 'was das Üben nachweislich bringt', 'Teams in der kognitiven Förderung', 'Betriebliches Gesundheitsmanagement', 'Trainingswirkung']) {
      assert.ok(!inhalt.includes(alt), `${path.relative(root, datei)} enthält noch „${alt}".`);
    }
  }
});

/* ── 6 · Altlasten ──────────────────────────────────────────────────────── */

test('P9 — AGB und Lizenzbedingungen tragen die Zweckbestimmung wortgleich mit dem Dienst', () => {
  const agb = quelle('src/pages/Agb.tsx');
  const lizenz = quelle('src/pages/Lizenzbedingungen.tsx');
  const SATZ = /Die Software ist eine Software für kognitives Training\. Sie ist kein Medizinprodukt im Sinne der Verordnung \(EU\) 2017\/745 \(MDR\) und nicht dazu bestimmt, Krankheiten, Verletzungen oder Behinderungen zu erkennen, zu überwachen, zu behandeln, zu lindern, auszugleichen oder ihnen vorzubeugen\. Trainingsergebnisse sind keine Diagnose und keine Grundlage für medizinische oder therapeutische Entscheidungen\./;
  assert.match(agb, SATZ);
  assert.match(lizenz, SATZ);
  assert.match(agb, /entscheidungen\. Dieser Absatz bestimmt den Vertragsgegenstand\. Er schränkt die Haftung für Verletzungen von Leben, Körper oder Gesundheit nicht ein\./i);
  assert.match(lizenz, /Entscheidungen\. Das beschreibt den Vertragsgegenstand\./);
  assert.match(lizenz, /\(kein Medizinprodukt, keine medizinische Zweckbestimmung, keine Diagnose\)/);
  assert.match(lizenz, /Stand: 7\. Oktober 2026/);
  assert.doesNotMatch(agb + lizenz, /Therapieinstrument/);

  const rt = dienst(path.join('src', 'main', 'rechtstexte.ts'));
  if (rt === null) return fehlt('Dienst', DIENST);
  const dort = SATZ.source.replace(/\\/g, '');
  const gleich = (text) => text.includes(dort);
  assert.ok(gleich(rt), 'Der Zweckbestimmungssatz im Dienst (rechtstexte.ts) weicht von dem der Website ab.');
  assert.equal(rt.split(dort).length - 1, 2, 'Der Dienst führt den Satz in AGB und Lizenzbedingungen je einmal.');
  assert.match(rt, /Stand: 7\. Oktober 2026/);
  assert.ok(rt.includes('(kein Medizinprodukt, keine medizinische Zweckbestimmung, keine Diagnose)'));

  // Und im ausgelieferten HTML.
  assert.ok(htmlText(seite(path.join('agb', 'index.html'))).includes(dort));
  assert.ok(htmlText(seite(path.join('lizenzbedingungen', 'index.html'))).includes(dort));
});

test('P10 — Evidenzseite: Herkunft statt Wirkung', () => {
  const html = seite(path.join('evidenz', 'index.html'));
  const text = htmlText(html);
  assert.ok(text.includes('Auf dieser Seite zeigen wir, auf welche bekannten Aufgabenformen der kognitiven Psychologie unsere Übungen zurückgehen. Sie beschreibt die Herkunft der Übungen, nicht ihre Wirkung; Wirkungen versprechen wir nicht.'));
  assert.doesNotMatch(text, /nachweislich|Trainingswirkung|Messverfahren|Testbatterie|psychometrische Kennwerte|brain damage|ADHS|Demenz|dementia|hearing loss|protects the hippocampus/i);
  assert.doesNotMatch(text, /\b(STARK|MODERAT|SCHWACH)\b/, 'Bewertungsstufen stehen wieder auf der Seite.');
  const evidenz = quelle('src/data/evidenz.ts');
  const mitQuelle = [...evidenz.matchAll(/"belegt": true/g)].length;
  assert.equal(
    text.split('Die Übung greift eine Aufgabenform auf; sie ist kein normiertes Testverfahren.').length - 1, mitQuelle,
    'Der Satz „Die Übung greift eine Aufgabenform auf …" steht nicht bei jeder Übung mit Quelle.',
  );
  assert.ok(!/export const EVIDENCE\b/.test(quelle('src/constants.ts')), 'Die tote Konstante EVIDENCE ist wieder da.');

  // W2 Nr. 2 (RW1, MITTEL): Kein Herkunftstext nennt die Übung selbst ein (normiertes/diagnostisches) Testverfahren.
  const ber0 = JSON.parse(quelle('scripts/evidenz-bereinigung.json'));
  const wort = ber0.evidenztexte.word;
  assert.ok(
    wort.includes('wurde im deutschsprachigen Raum unter anderem von Lux u. a. (1999, *Diagnostica* 45, 205–211,')
    && wort.includes(') für Wortlistenaufgaben beschrieben.'),
    'Der Herkunftstext der Wortliste trägt nicht die Formulierung aus W2 Nr. 2.',
  );
  const TESTANMUTUNG = /als Verbale[rn] Lern|Merkfähigkeitstest vor|liegt [^.]{0,60} vor \(|Visual Patterns Test|Continuous Performance Tests?\b|normiert|Normierung|diagnostisch|psychometrisch/i;
  for (const [key, t] of Object.entries(ber0.evidenztexte)) {
    if (typeof t === 'string') assert.doesNotMatch(t, TESTANMUTUNG, `Bereinigungsdatei, Herkunftstext von ${key}: legt ein Testverfahren nahe.`);
  }
  for (const m of evidenz.matchAll(/"evidenztext": "((?:[^"\\]|\\.)*)"/g)) {
    assert.doesNotMatch(m[1], TESTANMUTUNG, `src/data/evidenz.ts, Herkunftstext „${m[1].slice(0, 60)}…": legt ein Testverfahren nahe.`);
  }

  // Die Bereinigung ist angewandt: keine entfernte Quelle, jeder Text aus der Datei.
  const ber = JSON.parse(quelle('scripts/evidenz-bereinigung.json'));
  for (const eintraege of Object.values(ber.entfernteQuellen)) {
    for (const { doi } of eintraege) assert.ok(!evidenz.includes(`"doi": "${doi}"`), `Entfernte Quelle ${doi} steht noch in evidenz.ts.`);
  }
  for (const [key, t] of Object.entries(ber.evidenztexte)) {
    if (typeof t === 'string') assert.ok(evidenz.includes(JSON.stringify(t).slice(1, -1)), `Der bereinigte Text von ${key} steht nicht in evidenz.ts.`);
  }
});

/* ── 7 · Datenschutzerklärung ────────────────────────────────────────────── */

/** Der Pilotabschnitt der ausgelieferten Datenschutzerklärung, als Text. */
function pilotAbschnitt() {
  const html = seite(path.join('datenschutz', 'index.html'));
  const a = html.indexOf('id="pilotprogramm"');
  assert.ok(a > 0, 'Der Anker id="pilotprogramm" fehlt in der ausgelieferten Datenschutzerklärung.');
  const von = html.lastIndexOf('<div class="legal-block"', a);
  const bis = html.indexOf('<h2>E-Mail-Kommunikation</h2>', a);
  return { html, abschnitt: htmlText(html.slice(von, bis)), blockHtml: html.slice(von, bis) };
}

test('P11 — der Pilotabschnitt steht hinter „Auslieferung dieser Website", ändert keine bestehende Überschrift', () => {
  const { html } = pilotAbschnitt();
  const reihenfolge = [
    'Lizenzaktivierung der Anwendung', 'Zahlungsabwicklung', 'Trainings- und Nutzerdaten', 'Kauf der Home-Version',
    'Widerruf über die Widerrufsfunktion', 'Demo-Anfrage', 'Neuigkeiten per E-Mail', 'Auslieferung dieser Website',
    'Pilotprogramm für Praxen und Einrichtungen', 'E-Mail-Kommunikation', 'Deine Rechte',
  ];
  let stelle = -1;
  for (const titel of reihenfolge) {
    const i = html.indexOf(`<h2>${titel}</h2>`);
    assert.ok(i > stelle, `Überschrift „${titel}" fehlt oder steht an der falschen Stelle.`);
    stelle = i;
  }
  assert.match(html, /Stand: Oktober 2026/);
});

test('P12 — der Pilotabschnitt: Inhalt, Du-Form, Fristen, keine Platzhalter', () => {
  const { abschnitt } = pilotAbschnitt();
  for (const stueck of [
    'Wenn du dich über rholabs.de/pilotpartner bewirbst', 'den Namen deiner Praxis oder Einrichtung', 'die Art der Einrichtung',
    'den Namen der Ansprechperson, ihre geschäftliche E-Mail-Adresse und, wenn du sie angibst, eine Telefonnummer für Rückfragen zur Bewerbung',
    'Deine IP-Adresse speichern wir dabei nicht', 'spätestens eine Stunde nach deiner letzten Anfrage verworfen',
    'Wir erhalten eine E-Mail-Benachrichtigung, dass eine Bewerbung eingegangen ist; die Bewerbung selbst steht nicht darin.',
    'Eine automatische E-Mail an dich verschicken wir nicht.',
    'Bitte mache im Freitext keine Angaben zu einzelnen Personen',
    'Art. 6 Abs. 1 lit. b DSGVO', 'Art. 6 Abs. 1 lit. f DSGVO',
    'Wählen wir deine Einrichtung aus', 'die Fassung der Bedingungen und deren Prüfsumme',
    'rechtlicher Träger mit Anschrift, geplanter Pilotstart, Gerätezahl', 'keine IP-Adresse',
    'Anschließend erhält sie per E-Mail eine Bestätigung mit den Pilotbedingungen.',
    'Für die Pilotlizenz gelten die Angaben im Abschnitt „Lizenzaktivierung der Anwendung“.',
    'Aufzeichnungen und automatische Zusammenfassungen machen wir nicht.',
    'Trainingsdaten der von dir betreuten Personen erhalten wir nicht',
    'Hetzner Online GmbH in Deutschland, die als unser Auftragsverarbeiter tätig ist',
    'Eine weitere Weitergabe findet nicht statt.',
    'sechs Monate nach der Entscheidung', 'spätestens zwölf Monate nach ihrem Eingang',
    'nach drei Monaten', 'mit Ablauf des dritten Kalenderjahres nach dem Jahr, in dem das Pilotprogramm endet',
    'höchstens 30 Tage', 'Art. 17 Abs. 3 lit. e DSGVO',
    // Frist bei vereinbarter Anpassung — seit S3 im Dienst umgesetzt und geprüft (siehe P13).
    'wurde eine Pilotpartner-Anpassung vereinbart, ein Jahr später',
    // W2 Nr. 1: der Satz zu den Protokollen (Bericht S2, Abschnitt 5), in der Fassung der Seite.
    'Bearbeitungen in der Pilotverwaltung protokolliert der Lizenzdienst nur mit Zeitpunkt, Benutzerkennung, Aufruf und Ergebnis – ohne Inhalte – und löscht diese Einträge nach 90 Tagen',
    'den Versand von E-Mails protokolliert er ohne Empfängeradresse, nur mit Bestell- oder Vorgangsnummer und Art der Nachricht, im Systemprotokoll des Servers, das Einträge nach 30 Tagen löscht',
  ]) assert.ok(abschnitt.includes(stueck), `Pilotabschnitt: Satz fehlt — „${stueck}"`);
  assert.doesNotMatch(abschnitt, /nur kurzzeitig im Arbeitsspeicher/, 'Der Pilotabschnitt nennt noch die alte Frist „nur kurzzeitig im Arbeitsspeicher".');
  assert.doesNotMatch(abschnitt, /\b(Sie|Ihre|Ihr|Ihnen|Ihren|Ihrer|Ihrem)\b/, 'Der Pilotabschnitt siezt — die Erklärung duzt.');
  assert.doesNotMatch(abschnitt, /\[Satz|Bericht S2 einsetzen\.\]/, 'Der Platzhalter aus T1 ist veröffentlicht.');
});

test('FREIGABE-TOR — kein TODO-S2, kein interner Vermerk; der Bericht S2 nennt das journald-Ziel', () => {
  const html = seite(path.join('datenschutz', 'index.html'));
  assert.doesNotMatch(html, /TODO-S2/, 'Der Marker TODO-S2 steht noch in der Datenschutzerklärung: der Satz zur Aufbewahrung der Protokolle '
    + '(audit.log, Mail-Log) aus dem Bericht S2 ist nicht eingesetzt. Die Pilotseite darf so nicht veröffentlicht werden.');
  assert.doesNotMatch(quelle('src/constants.ts'), /TODO-S2/);
  // Der Vermerk aus T1 („[Gilt erst, wenn journald …]") ist für die Redaktion, nicht für die Veröffentlichung.
  assert.doesNotMatch(htmlText(html), /\[Gilt erst|journald|Launch-Checkliste/, 'Der interne Vermerk zu journald steht in der veröffentlichten Erklärung.');
  assert.doesNotMatch(quelle('src/constants.ts'), /Gilt erst, wenn journald|\[Gilt erst/);

  // Der zweite Halbsatz („Systemprotokoll … nach 30 Tagen") stimmt erst, wenn journald so eingestellt ist.
  // Das ist Sache des Inhabers am Server und von hier aus nicht prüfbar. Geprüft wird nur, dass der Bericht S2
  // das Ziel als offenen Punkt nennt; fehlt der Bericht, sagt der Test, dass die Gegenprobe nicht lief.
  const bericht = path.join(BERICHTE, 'S2-server-bericht.md');
  if (!fs.existsSync(bericht)) return fehlt('Bericht S2', bericht);
  const text = lf(fs.readFileSync(bericht, 'utf8'));
  assert.match(text, /MaxRetentionSec=30day/, 'Der Bericht S2 nennt das journald-Ziel (MaxRetentionSec=30day) nicht mehr.');
  assert.match(text, /journald-Frist/, 'Der Bericht S2 führt die journald-Frist nicht mehr als offenen Punkt.');
  console.log('      ℹ Offene Freigabebedingung (Inhaber, Server): journald auf 30 Tage stellen (MaxRetentionSec=30day) — erst dann stimmt der zweite Halbsatz zu den Protokollen.');
});

test('P13 — der Pilotabschnitt gegen den Quelltext des Dienstes: Felder, keine IP, Benachrichtigung, Fristen', () => {
  const { abschnitt } = pilotAbschnitt();
  const ts = dienst(path.join('src', 'main', 'pilot.ts'));
  const db = dienst(path.join('src', 'main', 'database.ts'));
  const mail = dienst(path.join('src', 'main', 'mailer.ts'));
  if (ts === null || db === null || mail === null) return fehlt('Dienst', DIENST);
  const code = ohneKommentare(ts);

  // a) Die Felder der Bewerbung: Der INSERT schreibt genau die, die der Abschnitt nennt — und keine IP.
  const insert = /INSERT INTO pilot_partner \(([^)]*)\)/.exec(code);
  assert.ok(insert, 'Der INSERT der Bewerbung ist im Dienst nicht zu finden.');
  const spalten = insert[1].split(',').map((s) => s.trim());
  assert.deepEqual(
    spalten.filter((s) => !['created_at', 'status', 'status_geaendert_at'].includes(s)).sort(),
    ['ansprechperson', 'art_der_einrichtung', 'einrichtung', 'einsatz_freitext', 'email', 'telefon', 'zielgruppe'],
    'Die Bewerbung speichert andere Felder, als der Abschnitt nennt.',
  );
  assert.ok(!spalten.some((s) => /(^|_)ip($|_)|herkunft|remote/i.test(s)), 'Die Bewerbung speichert eine IP-Adresse.');
  const tabellen = [...db.matchAll(/CREATE TABLE IF NOT EXISTS (pilot_partner|pilot_zustimmung) \(([\s\S]*?)\n\s*\)/g)];
  assert.equal(tabellen.length, 2, 'Die Pilot-Tabellen sind im Dienst nicht zu finden.');
  for (const [, name, rumpf] of tabellen) {
    assert.ok(!/^\s*(ip|ip_adresse|remote_addr|client_ip)\b/im.test(rumpf), `${name} führt eine IP-Spalte.`);
  }
  const zustimmungInsert = /INSERT INTO pilot_zustimmung \(([\s\S]*?)\)\s*SELECT/.exec(code);
  assert.ok(zustimmungInsert && !/\bip\b/i.test(zustimmungInsert[1]), 'Die Zustimmung speichert eine IP-Adresse.');
  assert.match(abschnitt, /keine IP-Adresse/);

  // b) Die Benachrichtigung trägt keinen Inhalt; es geht keine Mail an den Bewerber.
  const text = /export const PILOT_BEWERBUNG_HINWEIS_TEXT =\s*([\s\S]*?);/.exec(mail)?.[1].replace(/['+\s]+/g, ' ').trim();
  assert.equal(text, 'Es ist eine neue Bewerbung für das Pilotprogramm eingegangen. Bitte im Adminbereich unter Pilotverwaltung ansehen.', 'Der Text der Benachrichtigung hat sich geändert.');
  const fn = /export async function sendPilotBewerbungHinweis\([\s\S]*?\n\}/.exec(mail)?.[0] ?? '';
  assert.ok(fn && !/\b(einrichtung|ansprechperson|zielgruppe|einsatz|telefon)\b/.test(fn), 'Die Benachrichtigung trägt Bewerbungsinhalt.');
  const start = code.indexOf("'/pilot/bewerbung'");
  const handler = code.slice(start, code.indexOf('router.get', start));
  assert.ok(/sendPilotBewerbungHinweis\([\s\S]*?\{ to: an \}\)/.test(handler), 'Die Benachrichtigung geht nicht an den Inhaber.');
  assert.ok(/const an = inhaberAdresse\(/.test(handler));
  assert.equal([...handler.matchAll(/send[A-Za-z]*\(/g)].length, 1, 'Der Bewerbungs-Endpunkt verschickt mehr als eine Mail — der Abschnitt sagt: keine an den Bewerber.');
  assert.match(abschnitt, /Eine automatische E-Mail an dich verschicken wir nicht\./);

  // c) Die Fristen des täglichen Laufs.
  const fristen = /export const LOESCHFRISTEN = \{([\s\S]*?)\} as const/.exec(code)?.[1] ?? '';
  const zahl = (n) => Number(new RegExp(`${n}:\\s*(\\d+)`).exec(fristen)?.[1]);
  assert.equal(zahl('abgelehntMonate'), 6, 'abgelehnt: 6 Monate nach der Entscheidung — der Abschnitt sagt „sechs Monate".');
  assert.equal(zahl('bewerbungMonate'), 12, 'Bewerbung ohne Pilot: 12 Monate — der Abschnitt sagt „zwölf Monate".');
  assert.equal(zahl('freitextNachEndeMonate'), 3, 'Freitext/Telefon: 3 Monate nach dem Ende — der Abschnitt sagt „drei Monaten".');
  assert.equal(zahl('allesNachEndeKalenderjahre'), 3, 'Alles Übrige: drittes Kalenderjahr nach dem Ende.');
  assert.equal(zahl('allesNachEndeMitAnpassungKalenderjahre'), 4, 'Anpassung: viertes Kalenderjahr nach dem Ende — der Abschnitt sagt „ein Jahr später".');
  assert.match(abschnitt, /sechs Monate nach der Entscheidung/);
  assert.match(abschnitt, /zwölf Monate nach ihrem Eingang/);
  assert.match(abschnitt, /wurde eine Pilotpartner-Anpassung vereinbart, ein Jahr später/);

  // d) Sicherungskopien: höchstens 30 Tage (Werkzeug des Dienstes).
  const sicherung = dienst(path.join('werkzeuge', 'sicherung.mjs'));
  if (sicherung !== null) {
    assert.ok(/\b30\b/.test(sicherung) && /tage|days|\*\s*24/i.test(sicherung), 'Das Sicherungswerkzeug löscht keine Sicherungen nach 30 Tagen (Auftrag S2 Nr. 14) — der Abschnitt sagt „höchstens 30 Tage".');
    assert.match(sicherung, /const AUFBEWAHREN_VORGABE = 30;/, 'Die Vorgabe des Sicherungswerkzeugs ist nicht mehr 30 Tage.');
  }
  // „Ablauf des dritten Kalenderjahres nach dem Jahr, in dem das Pilotprogramm endet" = 1. Januar des vierten Folgejahres.
  assert.match(code, /Date\.UTC\(jahr \+ LOESCHFRISTEN\.allesNachEndeKalenderjahre \+ 1, 0, 1\)/, 'Die Frist „Ablauf des dritten Kalenderjahres" ist im Dienst anders berechnet.');
  assert.match(code, /Date\.UTC\(jahr \+ LOESCHFRISTEN\.allesNachEndeMitAnpassungKalenderjahre \+ 1, 0, 1\)/, 'Die Frist mit Anpassung ist im Dienst anders berechnet.');
  assert.match(code, /freitextLeerenAb: monatePlus\(bezug, LOESCHFRISTEN\.freitextNachEndeMonate\)/, 'Freitext und Telefon werden im Dienst nicht drei Monate nach dem Ende geleert.');

  // e) Der Ratenbegrenzer hält die Herkunft höchstens eine Stunde (S3 Sol N1).
  assert.match(code, /const STUNDE_MS = 60 \* 60 \* 1000;/, 'Der Ratenbegrenzer im Dienst hält Herkünfte nicht höchstens eine Stunde.');
  assert.match(abschnitt, /spätestens eine Stunde nach deiner letzten Anfrage/, 'Der Pilotabschnitt nennt die Frist des Ratenbegrenzers nicht.');
});

test('P13b — der Pilotabschnitt gegen den Dienst nach S2: Felder der Zustimmung, Bestätigungsmail, Fragen per E-Mail, Protokolle', () => {
  const { abschnitt } = pilotAbschnitt();
  const ts = dienst(path.join('src', 'main', 'pilot.ts'));
  const mail = dienst(path.join('src', 'main', 'mailer.ts'));
  const proto = dienst(path.join('src', 'main', 'protokoll.ts'));
  if (ts === null || mail === null || proto === null) return fehlt('Dienst', DIENST);
  const code = ohneKommentare(ts);

  // a) Das Zustimmungsprotokoll speichert genau die Angaben, die der Abschnitt nennt — keine IP.
  const insert = /INSERT INTO pilot_zustimmung \(([\s\S]*?)\)\s*SELECT/.exec(code);
  assert.ok(insert, 'Der INSERT der Zustimmung ist im Dienst nicht zu finden.');
  const spalten = insert[1].split(',').map((s) => s.trim()).filter(Boolean).sort();
  assert.deepEqual(
    spalten,
    [
      'anschrift', 'bedingungen_fassung', 'bedingungen_sha256', 'einrichtung', 'feedback_mails', 'geplanter_start', 'geraete',
      'person_email', 'person_funktion', 'person_name', 'pilot_id', 'traeger', 'unternehmer_bestaetigt',
      'vertretungsbefugnis_bestaetigt', 'zugestimmt_at',
    ],
    'Das Zustimmungsprotokoll speichert andere Angaben, als der Abschnitt „Teilnahme" nennt (Fassung, Prüfsumme, Zeitpunkt, '
    + 'Einrichtung, Träger mit Anschrift, geplanter Start, Gerätezahl, Name, Funktion, E-Mail, Bestätigungen, Wahl der Fragen per E-Mail).',
  );
  for (const stueck of [
    'die Fassung der Bedingungen und deren Prüfsumme', 'den Zeitpunkt', 'Einrichtung, rechtlicher Träger mit Anschrift, geplanter Pilotstart, Gerätezahl',
    'Name, Funktion und E-Mail-Adresse der zustimmenden Person',
    'für den Träger handeln zu dürfen und dass dieser nicht als Verbraucher handelt',
    'ihre Wahl, ob sie wöchentliche Fragen per E-Mail erhalten möchte',
  ]) assert.ok(abschnitt.includes(stueck), `Pilotabschnitt: Angabe zur Zustimmung fehlt — „${stueck}"`);

  // b) Die Pflicht-Häkchen und die freiwillige Wahl: der Dienst verlangt befugnis/unternehmer/bedingungen, feedback_mails ist freiwillig.
  assert.match(code, /k\.bedingungen !== 'ja' \|\| k\.befugnis !== 'ja' \|\| k\.unternehmer !== 'ja'/);
  assert.match(code, /const feedback = feedbackWahl\(k\.feedback_mails\);/);

  // c) Die Bestätigungsmail geht sofort nach dem Protokoll an die Adresse des Einmal-Links.
  assert.match(code, /await bestaetigungSenden\(protokollId, deps\.getConfig\(\)\);/, 'Der Dienst schickt nach der Zustimmung keine Bestätigung mehr.');
  assert.match(mail, /export async function sendPilotBestaetigungEmail\(/);
  assert.match(abschnitt, /Anschließend erhält sie per E-Mail eine Bestätigung mit den Pilotbedingungen\./);

  // d) Das Angebot vor der Annahme: Die Seite ruft …/zustimmung/info schon beim Öffnen auf; der Dienst führt den Token dort nicht in Protokollen.
  const infoStart = code.indexOf("'/pilot/zustimmung/info'");
  const info = code.slice(infoStart, code.indexOf('router.post', infoStart));
  assert.ok(infoStart > 0 && info.length > 0, 'Der Info-Endpunkt ist im Dienst nicht zu finden.');
  assert.doesNotMatch(info, /console\.(log|info|warn)\(/, 'Der Info-Endpunkt schreibt ins Journal — der Abschnitt sagt: der Link wird nicht protokolliert.');
  assert.doesNotMatch(info, /\bt\b[^;\n]*\$\{|\$\{[^}]*\bt\b\}/, 'Der Info-Endpunkt gibt den Token in eine Zeichenkette (Protokoll?).');
  assert.match(abschnitt, /schon beim Öffnen auf, um das Angebot anzuzeigen/);

  // e) Protokolle: audit.log der Pilotverwaltung ohne Inhalt, 90 Tage; Sicherungen 30 Tage (P13 d).
  assert.match(proto, /export const AUDIT_LOG_AUFBEWAHRUNG_TAGE = 90;/, 'Das audit.log wird nicht mehr 90 Tage aufbewahrt — der Abschnitt sagt „nach 90 Tagen".');
  const pfade = dienst(path.join('src', 'main', 'pfade.ts'));
  assert.ok(pfade !== null, 'src/main/pfade.ts fehlt im Lizenzdienst (Befund RS1 Sol M1).');
  assert.match(pfade, /export function istPilotverwaltung\(/, 'pfade.ts exportiert istPilotverwaltung nicht.');
  // Wie die Erkennung im Einzelnen normalisiert, prüft der Dienst selbst (tests/audit-log.test.js); hier nur,
  // dass sie Groß- und Kleinschreibung gleich behandelt — sonst gälte der Satz „ohne Inhalte" nicht für jede Schreibweise.
  assert.match(pfade, /toLowerCase\(\)|\/i\.test\(/, 'pfade.ts unterscheidet Groß- und Kleinschreibung (Befund RS1 Sol M1).');
  assert.ok(fs.existsSync(path.join(DIENST, 'tests', 'audit-log.test.js')), 'Der Dienst führt den Test zum audit.log (Schreibweisen der Pilotpfade) nicht mehr.');
  assert.match(proto, /export\s*\{\s*istPilotverwaltung\s*\}\s*from\s*['"]\.\/pfade['"];?/, 'protokoll.ts reicht istPilotverwaltung nicht aus ./pfade weiter.');
  const server = dienst(path.join('src', 'main', 'server.ts'));
  assert.ok(server !== null, 'src/main/server.ts fehlt im Lizenzdienst.');
  assert.match(server, /import\s*\{[^}]*\bistPilotverwaltung\b[^}]*\}\s*from\s*['"]\.\/pfade['"];?/, 'server.ts importiert istPilotverwaltung nicht aus ./pfade.');
  assert.match(server, /istPilotverwaltung\(/, 'Der Server unterscheidet die Pilotverwaltung im audit.log nicht mehr.');
  assert.match(server, /auditLogKuerzen\(AUDIT_LOG_PATH\)/, 'Der tägliche Lauf kürzt das audit.log nicht mehr.');
  // Der Satz zum Mail-Log gilt, solange der Dienst seinen Test dazu führt (keine Empfängeradresse in der Logzeile).
  assert.ok(fs.existsSync(path.join(DIENST, 'tests', 'mail-log.test.js')), 'Der Dienst führt den Test „Mail-Log ohne Empfängeradresse" nicht mehr.');
});

test('P14 — Lizenzaktivierung und Update-Prüfung gegen das tatsächliche Verhalten der App', () => {
  const html = seite(path.join('datenschutz', 'index.html'));
  const text = htmlText(html);
  const start = text.indexOf('Lizenzaktivierung der Anwendung');
  const abschnitt = text.slice(start, text.indexOf('Zahlungsabwicklung', start));
  for (const stueck of [
    'Die Demo-Version und die Pilotlizenz melden sich wieder',
    'die Demo höchstens alle fünf Minuten, die Pilotlizenz höchstens alle zwölf Stunden',
    'Testphase der Demo auf 14 Tage und der Pilotzeitraum auf 42 Tage begrenzt',
    'Demo nach einer erfolgreichen Prüfung bis zu 72 Stunden weiter, die Pilotlizenz bis zu sieben Tage',
    'Update-Prüfung:', 'github.com/vertrieb-rholabs', 'GitHub, Inc. (USA) deine IP-Adresse',
    'Signatur von uns und die Prüfsumme der Datei',
  ]) assert.ok(abschnitt.includes(stueck), `Aktivierungsabschnitt: „${stueck}" fehlt.`);

  const main = app('main.js');
  const pkg = app('package.json');
  if (main === null || pkg === null) return fehlt('App', APP);
  const dm = /dm:\s*\{\s*durationMs:\s*DEMO_DURATION_MS,\s*offlineMs:\s*72 \* 3600000,\s*refreshMs:\s*5 \* 60000\s*\}/.test(main);
  const plt = /plt:\s*\{\s*durationMs:\s*42 \* 86400000,\s*offlineMs:\s*7 \* 86400000,\s*refreshMs:\s*12 \* 3600000/.test(main);
  assert.ok(dm, 'Die Demo-Zahlen der App (14 Tage, 72 Stunden, 5 Minuten) stimmen nicht mehr mit dem Text überein.');
  assert.ok(plt, 'Die Pilot-Zahlen der App (42 Tage, 7 Tage offline, 12 Stunden) stimmen nicht mehr mit dem Text überein.');
  assert.match(main, /DEMO_DURATION_MS = 14 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(main, /UPDATE_CHECK_COOLDOWN_MS = 60 \* 60 \* 1000/, 'Die Update-Prüfung läuft nicht mehr höchstens einmal pro Stunde.');
  assert.match(pkg, /"provider": "github",\s*"owner": "vertrieb-rholabs"/, 'Der Update-Kanal ist nicht mehr GitHub (vertrieb-rholabs).');
});

test('P15 - INWX and objection notice in privacy policy', () => {
  const html = seite(path.join('datenschutz', 'index.html'));
  const text = htmlText(html);
  assert.equal((text.match(/E-Mail-Hosting der INWX GmbH/g) ?? []).length, 1, 'Der INWX-Absatz steht nicht genau einmal im Abschnitt E-Mail-Kommunikation.');
  assert.doesNotMatch(text, /Gmail der Google Ireland|Google LLC|Data Privacy Framework|dataprivacyframework/);
  assert.match(html, /<blockquote><p><strong>Widerspruchsrecht:<\/strong>/);
  assert.ok(text.includes('Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, kannst du dieser Verarbeitung jederzeit aus Gründen, die sich aus deiner besonderen Situation ergeben, widersprechen (Art. 21 Abs. 1 DSGVO).'));
  assert.ok(text.includes('Ein formloser Hinweis an info@rholabs.de genügt.'));
  assert.ok(text.indexOf('INWX GmbH') > text.indexOf('E-Mail-Kommunikation') && text.indexOf('INWX GmbH') < text.lastIndexOf('Deine Rechte'));
  assert.ok(text.indexOf('Widerspruchsrecht:') > text.lastIndexOf('Deine Rechte'));
});


/* ── 8 · Verlinkung ──────────────────────────────────────────────────────── */

test('P16 — Fußzeile, Produktseite und Home-Seite verweisen auf die Pilotseite', () => {
  assert.match(quelle('src/components/Footer.tsx'), /to="\/pilotpartner\/"[\s\S]{0,80}Pilotprogramm/);
  for (const rel of ['kognitives-training', 'home']) {
    const html = seite(path.join(rel, 'index.html'));
    assert.match(html, /Pilotpartner gesucht →[\s\S]{0,40}<a href="\/pilotpartner\/"[^>]*>Mehr erfahren<\/a>/, `${rel}: der dezente Hinweis fehlt.`);
  }
  const startseite = seite('index.html');
  assert.match(startseite, /href="\/pilotpartner\/"/, 'Die Fußzeile verlinkt die Pilotseite nicht.');
});

/* ── 9 · Barrierefreiheit und Navigation (W2 Nr. 3 bis 5) ────────────────── */

test('P17 — Links mit target="_blank" auf den Pilot- und Evidenzseiten: Hinweis „(öffnet in neuem Tab)" und rel="noopener noreferrer"', () => {
  // Quelle: jede <a …target="_blank"…>…</a> der neuen Seiten.
  const dateien = [
    'src/pages/PilotPartner.tsx', 'src/pages/PilotBedingungen.tsx', 'src/pages/EvidencePage.tsx',
    'src/components/EvidenzText.tsx',
    ...fs.readdirSync(path.join(root, 'src', 'pages', 'pilot')).filter((f) => f.endsWith('.tsx')).map((f) => `src/pages/pilot/${f}`),
  ];
  let gesehen = 0;
  for (const rel of dateien) {
    const src = quelle(rel);
    for (const m of src.matchAll(/<a\b[^>]*\btarget="_blank"[\s\S]*?<\/a>/g)) {
      gesehen += 1;
      assert.match(m[0], /rel="noopener noreferrer"/, `${rel}: Link mit target="_blank" ohne rel="noopener noreferrer".`);
      assert.match(m[0], /<span className="sr-only"> \(öffnet in neuem Tab\)<\/span>/, `${rel}: Link mit target="_blank" ohne Screenreader-Hinweis.`);
    }
  }
  assert.ok(gesehen >= 4, 'Es wurden weniger Links mit target="_blank" gefunden als erwartet.');
  assert.match(quelle('src/styles/site.css'), /\.sr-only \{[^}]*clip: rect\(0, 0, 0, 0\)/, 'Die Klasse sr-only verbirgt den Hinweis nicht.');

  // Erzeugnis: dasselbe in den ausgelieferten Seiten, die ein Link in neuem Tab trägt.
  for (const rel of [path.join('pilotpartner', 'index.html'), path.join('pilotbedingungen', 'index.html'), path.join('evidenz', 'index.html')]) {
    const html = seite(rel);
    for (const m of html.matchAll(/<a\b[^>]*\btarget="_blank"[^>]*>[\s\S]*?<\/a>/g)) {
      assert.match(m[0], /rel="noopener noreferrer"/, `${rel}: ausgelieferter Link ohne rel="noopener noreferrer": ${m[0].slice(0, 100)}`);
      // Ein Symbol-Link ohne Text (Fußzeile) trägt den Hinweis in seiner Beschriftung (aria-label).
      assert.match(m[0], /<span class="sr-only"> \(öffnet in neuem Tab\)<\/span>|aria-label="[^"]*\(öffnet in neuem Tab\)"/, `${rel}: ausgelieferter Link ohne Hinweis: ${m[0].slice(0, 100)}`);
    }
  }
  assert.match(seite(path.join('pilotpartner', 'index.html')), /<a href="\/datenschutz\/#pilotprogramm" target="_blank" rel="noopener noreferrer">Datenschutzhinweise<span class="sr-only"> \(öffnet in neuem Tab\)<\/span><\/a>/);
});

test('P18 — Navigation: „Hintergrund" statt „Evidenz", die Route bleibt /evidenz', () => {
  const nav = quelle('src/components/Navbar.tsx');
  assert.match(nav, /\{ to: '\/evidenz\/', label: 'Hintergrund' \}/);
  assert.doesNotMatch(nav, /label: 'Evidenz'/);
  for (const rel of ['index.html', path.join('pilotpartner', 'index.html'), path.join('evidenz', 'index.html')]) {
    const html = seite(rel);
    assert.match(html, /<a [^>]*class="nav__link[^"]*" href="\/evidenz\/"[^>]*>Hintergrund<\/a>/, `${rel}: Menüpunkt „Hintergrund" fehlt.`);
    assert.doesNotMatch(html, /<a [^>]*class="nav__link[^"]*" href="\/evidenz\/"[^>]*>Evidenz<\/a>/, `${rel}: Menüpunkt heißt noch „Evidenz".`);
  }
  assert.match(quelle('src/App.tsx'), /path:\s*'evidenz'/, 'Die Route /evidenz muss bleiben.');
});

/* Kontrast kleiner Texte (WCAG 2.1, 1.4.3: mindestens 4,5:1). */
const hexZuRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => { const x = c / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const leuchtdichte = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const mischen = (vorn, hinten, a) => hinten.map((c, i) => Math.round(a * vorn[i] + (1 - a) * c));
const kontrast = (a, b) => {
  const [hell, dunkel] = [leuchtdichte(a), leuchtdichte(b)].sort((x, y) => y - x);
  return (hell + 0.05) / (dunkel + 0.05);
};

test('P19 — Kontrast: kleine informative Texte der Pilotseiten erreichen 4,5:1 auf jedem Untergrund der Seite', () => {
  const css = quelle('src/styles/site.css');
  const token = (n) => new RegExp(`--${n}: *(#[0-9a-fA-F]{6});`).exec(css)?.[1];
  const weiss = hexZuRgb('#ffffff');
  // Ungünstigster Untergrund: Karten mit weißem Schleier (0,08) über dem Band, dazu Grund, Fläche und Cyan-Schleier.
  const untergruende = {
    Grund: hexZuRgb(token('bg')),
    Band: hexZuRgb(token('bg-band')),
    Fläche: hexZuRgb(token('surface')),
    'Karte (weiß 8 %)': mischen(weiss, hexZuRgb(token('bg-band')), 0.08),
    'Karte (cyan 5 %)': mischen(hexZuRgb(token('cyan')), hexZuRgb(token('bg')), 0.05),
  };
  const regel = (selektor) => {
    const i = css.indexOf(`\n${selektor} {`);
    assert.ok(i >= 0, `Regel ${selektor} fehlt in site.css.`);
    return css.slice(i, css.indexOf('}', i));
  };
  const selektoren = [
    '.field__help', '.form__required', '.check__aside', '.card__footnote', '.shotfig figcaption',
    '.angebot dt', 'p.pilot-hinweis',
  ];
  for (const sel of selektoren) {
    const farbe = /color:\s*var\(--([a-z-]+)\)/.exec(regel(sel))?.[1];
    assert.ok(farbe, `${sel}: keine Farbe aus einem Token.`);
    const hex = token(farbe);
    for (const [name, grund] of Object.entries(untergruende)) {
      const k = kontrast(hexZuRgb(hex), grund);
      assert.ok(k >= 4.5, `${sel} (--${farbe} ${hex}) auf ${name}: ${k.toFixed(2)}:1, verlangt sind 4,5:1.`);
    }
  }
  // Der Pilotabschnitt der Stilvorlage benutzt für Schrift weder --text-dim noch --text-faint.
  const abschnitt = css.slice(css.indexOf('/* ── Pilotprogramm ──'));
  assert.doesNotMatch(abschnitt.replace(/\/\*[\s\S]*?\*\//g, ''), /color:\s*var\(--text-(dim|faint)\)/, 'Im Pilotabschnitt steht kleine Schrift wieder in --text-dim oder --text-faint.');
});
