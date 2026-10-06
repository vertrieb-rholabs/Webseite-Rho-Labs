// Das Pilotprogramm im Browser nachgestellt (Auftrag W1, 06.10.2026).
//
// Wie `ablauf.test.mjs`: Ein echter Chromium lädt die ausgelieferten Seiten aus
// `docs/` von einem örtlichen Server. Der Auslieferungsdienst
// (`fulfillment.rholabs.de`) wird NICHT angesprochen — jede Anfrage dorthin
// fängt der Test ab und beantwortet sie selbst. Geprüft wird, was erst NACH dem
// Einhängen von React (oder ganz ohne JavaScript) entsteht:
//
//   1. Zustimmungsseite mit gültigem Link: Angebot und Formular erscheinen, der
//      Token steht im versteckten Feld und in genau EINER Anfrage — ohne
//      Referer, in keinem Link, nicht in der Konsole.
//   2. Ungültiger Link / unbekannte Form / andere Fassung / Dienst nicht
//      erreichbar: eine ehrliche Meldung, kein Formular.
//   3. Die Zustimmung geht als urlencoded POST mit allen Feldern, der Token im
//      Rumpf und nicht in der Adresse.
//   4. Die Bewerbung funktioniert OHNE JavaScript: nativer POST, alle Felder.
//   5. Fehler-Rückweg der Bewerbung: sichtbar mit React; vorab, wenn das
//      Bündel nicht lädt; ein unbekannter Wert zeigt nichts.
//
// Aufruf:  npm run build  und dann  npm run ablauf
// (puppeteer-core per npx, Chromium wie bei `ablauf.test.mjs`).

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { browserPfad } from './browser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(root, 'docs');
const DIENST = 'https://fulfillment.rholabs.de';
const TOKEN = 'Zk3-q_Tg9LmN0pQrStUvWxYz1234567890AbCdEfGhI';

const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

function dateiFuer(pfad) {
  const rein = decodeURIComponent(pfad.split('?')[0]);
  if (rein.includes('..')) return null;
  const kandidaten = rein.endsWith('/')
    ? [path.join(DOCS, rein, 'index.html')]
    : [path.join(DOCS, rein), path.join(DOCS, rein, 'index.html')];
  for (const k of kandidaten) {
    try { if (fs.statSync(k).isFile()) return k; } catch { /* weiter */ }
  }
  return null;
}

let browser;
let server;
let basis;

before(async () => {
  if (!fs.existsSync(path.join(DOCS, 'pilotpartner', 'index.html'))) {
    assert.fail('docs/pilotpartner fehlt. Diese Tests fahren die AUSGELIEFERTE Seite an — vorher `npm run build`.');
  }
  server = http.createServer((req, res) => {
    const datei = dateiFuer((req.url || '/').split('?')[0]);
    if (!datei) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(path.join(DOCS, '404.html')));
    }
    res.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(fs.readFileSync(datei));
  });
  await new Promise((fertig) => server.listen(0, '127.0.0.1', fertig));
  basis = `http://127.0.0.1:${server.address().port}`;
  browser = await puppeteer.launch({ executablePath: browserPfad(), headless: true, args: ['--no-sandbox', '--disable-gpu'] });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((fertig) => server.close(fertig));
});

async function hydriert(seite) {
  await seite.waitForFunction(() => {
    for (const knoten of document.querySelectorAll('*')) {
      for (const k in knoten) if (k.startsWith('__reactFiber$')) return true;
    }
    return false;
  }, { timeout: 20000, polling: 'mutation' }).catch(() => assert.fail('React hat die Seite nicht übernommen.'));
  await seite.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

const text = (seite) => seite.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());

/**
 * Eine Seite öffnen, bei der jede Anfrage an den Dienst abgefangen wird.
 * `antwort(req)` liefert `{ status, body, headers }` oder wirft für „nicht erreichbar".
 */
async function oeffnen(url, { antwort, js = true, buendelSperren = false } = {}) {
  const seite = await browser.newPage();
  const dienstAnfragen = [];
  const konsole = [];
  const alleUrls = [];
  seite.on('console', (m) => konsole.push(m.text()));
  seite.on('pageerror', (e) => konsole.push(String(e.message)));
  await seite.setJavaScriptEnabled(js);
  await seite.setRequestInterception(true);
  seite.on('request', (req) => {
    alleUrls.push(req.url());
    if (buendelSperren && /\/assets\/.*\.js(\?|$)/.test(req.url())) return req.abort();
    if (req.url().startsWith(DIENST)) {
      dienstAnfragen.push({ url: req.url(), methode: req.method(), headers: req.headers(), body: req.postData() ?? null });
      const a = antwort ? antwort(req) : null;
      if (!a) return req.abort('failed');
      return req.respond({
        status: a.status ?? 200,
        contentType: a.contentType ?? 'application/json',
        headers: { 'access-control-allow-origin': '*', ...(a.headers || {}) },
        body: a.body ?? '',
      });
    }
    return req.continue();
  });
  await seite.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  if (js && !buendelSperren) await hydriert(seite);
  return { seite, dienstAnfragen, konsole, alleUrls };
}

const gueltig = {
  gueltig: true, einrichtung: 'Praxis Beispiel GmbH', geplanter_start: '2026-11-02',
  letzter_nutzungstag: '2026-12-13', geraete: 2, fassung: 'P1-2026-10',
};
const json = (o, status = 200) => ({ status, body: JSON.stringify(o) });

/* ── 1 ──────────────────────────────────────────────────────────────────── */
test('1 · gültiger Link: Angebot und Formular — der Token geht nur an die Anzeige und ins versteckte Feld', async () => {
  const { seite, dienstAnfragen, konsole, alleUrls } = await oeffnen(
    `${basis}/pilotpartner/zustimmung/?t=${TOKEN}`,
    { antwort: () => json(gueltig) },
  );
  try {
    await seite.waitForSelector('form[action$="/api/public/pilot/zustimmung"]', { timeout: 10000 });
    const t = await text(seite);
    assert.match(t, /Praxis Beispiel GmbH/);
    assert.match(t, /02\.11\.2026/);
    assert.match(t, /13\.12\.2026/);
    assert.match(t, /Letzter Nutzungstag/i);
    assert.match(t, /Fassung P1-2026-10/);
    assert.match(t, /Der Vertrag entsteht, wenn Sie auf „Pilotbedingungen annehmen“ klicken/);

    // Das versteckte Feld trägt Token und Fassung.
    const felder = await seite.$$eval('form input[type=hidden]', (xs) => xs.map((x) => [x.name, x.value]));
    assert.deepEqual(Object.fromEntries(felder), { t: TOKEN, fassung: 'P1-2026-10' });

    // Genau eine Anfrage an den Dienst, ein GET mit dem Token, ohne Referer.
    assert.equal(dienstAnfragen.length, 1, 'Mehr als eine Anfrage an den Dienst.');
    const a = dienstAnfragen[0];
    assert.equal(a.methode, 'GET');
    assert.ok(a.url.startsWith(`${DIENST}/api/public/pilot/zustimmung/info?t=`));
    assert.ok(a.url.endsWith(encodeURIComponent(TOKEN)));
    assert.ok(!a.headers.referer, `Die Anfrage trägt einen Referer: ${a.headers.referer}`);

    // Der Token steht in keiner anderen Adresse, keinem Link und keiner Konsolenzeile.
    const tokenUrls = alleUrls.filter((u) => u.includes(TOKEN) && !u.startsWith(`${basis}/pilotpartner/zustimmung/?t=`));
    assert.deepEqual(tokenUrls.map((u) => u.replace(TOKEN, '<T>')), [`${DIENST}/api/public/pilot/zustimmung/info?t=<T>`]);
    const links = await seite.$$eval('a[href]', (xs) => xs.map((x) => x.getAttribute('href')));
    assert.ok(links.every((h) => !h.includes(TOKEN)), 'Ein Link trägt den Token.');
    assert.ok(konsole.every((z) => !z.includes(TOKEN)), 'Der Token steht in der Konsole.');
    const meta = await seite.$eval('meta[name=referrer]', (m) => m.content);
    assert.equal(meta, 'no-referrer');
    const bedingungenLink = await seite.$eval('a[href="/pilotbedingungen"]', (a) => [a.target, a.rel, a.referrerPolicy]);
    assert.deepEqual(bedingungenLink, ['_blank', 'noopener noreferrer', 'no-referrer']);
    assert.deepEqual(await seite.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie]), [0, 0, '']);
  } finally {
    await seite.close();
  }
});

/* ── 2 ──────────────────────────────────────────────────────────────────── */
test('2 · ungültig, unbekannte Form, andere Fassung, Dienst nicht erreichbar: Meldung statt Formular', async () => {
  const faelle = [
    ['unbekannter Link', `?t=${TOKEN}`, () => json({ gueltig: false }), /Dieser Link ist nicht mehr gültig\. Bitte schreiben Sie uns an kontakt\.rholabs@gmail\.com\./, 1],
    ['kein Token', '', () => json(gueltig), /Dieser Link ist nicht mehr gültig/, 0],
    ['Token mit fremden Zeichen', '?t=abc%20def%3Cscript%3E', () => json(gueltig), /Dieser Link ist nicht mehr gültig/, 0],
    ['zu langer Token', `?t=${'a'.repeat(129)}`, () => json(gueltig), /Dieser Link ist nicht mehr gültig/, 0],
    ['andere Fassung', `?t=${TOKEN}`, () => json({ ...gueltig, fassung: 'P1-2027-01' }), /Die Pilotbedingungen wurden inzwischen aktualisiert/, 1],
    ['unvollständiges Angebot', `?t=${TOKEN}`, () => json({ gueltig: true, einrichtung: 'X' }), /Dieser Link ist nicht mehr gültig/, 1],
    ['Ratengrenze', `?t=${TOKEN}`, () => json({ gueltig: false }, 429), /konnte gerade nicht geladen werden/, 1],
    ['Dienst nicht erreichbar', `?t=${TOKEN}`, () => null, /konnte gerade nicht geladen werden/, 1],
  ];
  for (const [name, abfrage, antwort, erwartet, anfragen] of faelle) {
    const { seite, dienstAnfragen } = await oeffnen(`${basis}/pilotpartner/zustimmung/${abfrage}`, { antwort });
    try {
      await seite.waitForFunction((re) => new RegExp(re).test(document.body.innerText), { timeout: 10000 }, erwartet.source).catch(() => {});
      const t = await text(seite);
      assert.match(t, erwartet, `${name}: falsche Meldung.\n${t.slice(0, 400)}`);
      assert.equal(await seite.$('form[action$="/api/public/pilot/zustimmung"]'), null, `${name}: ein Formular ist da.`);
      assert.equal(dienstAnfragen.length, anfragen, `${name}: ${dienstAnfragen.length} Anfragen an den Dienst statt ${anfragen}.`);
    } finally {
      await seite.close();
    }
  }
});

/* ── 3 ──────────────────────────────────────────────────────────────────── */
test('3 · die Zustimmung geht als urlencoded POST mit allen Feldern — der Token im Rumpf', async () => {
  const { seite, dienstAnfragen } = await oeffnen(`${basis}/pilotpartner/zustimmung/?t=${TOKEN}`, {
    antwort: (req) => {
      if (req.method() === 'POST') {
        return { status: 303, body: '', headers: { location: `${basis}/pilotpartner/zustimmung/fertig/` }, contentType: 'text/plain' };
      }
      return json(gueltig);
    },
  });
  try {
    await seite.waitForSelector('form[action$="/api/public/pilot/zustimmung"]');
    // Absenden ohne die drei Pflichtpunkte: der Browser hält es auf.
    const gueltigVorher = await seite.$eval('form', (f) => f.checkValidity());
    assert.equal(gueltigVorher, false, 'Das leere Formular gilt als gültig.');

    await seite.type('[name=traeger]', 'Praxis Beispiel GmbH');
    await seite.type('[name=anschrift]', 'Musterstraße 1\n99999 Musterstadt');
    await seite.type('[name=name]', 'Erika Muster');
    await seite.type('[name=funktion]', 'Inhaberin');
    for (const n of ['bedingungen', 'befugnis', 'unternehmer', 'feedback_mails']) await seite.click(`[name=${n}]`);
    assert.equal(await seite.$eval('form', (f) => f.checkValidity()), true);

    await Promise.all([seite.waitForNavigation({ waitUntil: 'networkidle0' }), seite.click('button[type=submit]')]);
    const post = dienstAnfragen.find((a) => a.methode === 'POST');
    assert.ok(post, 'Es ging kein POST an den Dienst.');
    assert.equal(post.url, `${DIENST}/api/public/pilot/zustimmung`, 'Der Token steht in der Adresse des POST.');
    assert.match(post.headers['content-type'] || '', /^application\/x-www-form-urlencoded/);
    assert.ok(!post.headers.referer, `Der POST trägt einen Referer: ${post.headers.referer}`);
    const k = new URLSearchParams(post.body);
    assert.deepEqual(Object.fromEntries(k), {
      t: TOKEN, fassung: 'P1-2026-10', traeger: 'Praxis Beispiel GmbH', anschrift: 'Musterstraße 1\r\n99999 Musterstadt',
      name: 'Erika Muster', funktion: 'Inhaberin', bedingungen: 'ja', befugnis: 'ja', unternehmer: 'ja', feedback_mails: 'ja',
    });
    const t = await text(seite);
    assert.match(t, /Ihre Zustimmung ist gespeichert\. Eine Bestätigung mit den Pilotbedingungen erhalten Sie per E-Mail\./);
    assert.ok(!seite.url().includes(TOKEN), 'Die Zielseite trägt den Token in der Adresse.');
  } finally {
    await seite.close();
  }
});

/* ── 4 ──────────────────────────────────────────────────────────────────── */
test('4 · die Bewerbung funktioniert ohne JavaScript: nativer POST mit allen Feldern', async () => {
  const { seite, dienstAnfragen } = await oeffnen(`${basis}/pilotpartner/`, {
    js: false,
    antwort: () => ({ status: 303, body: '', headers: { location: `${basis}/pilotpartner/danke/` }, contentType: 'text/plain' }),
  });
  try {
    await seite.type('[name=einrichtung]', 'Praxis Beispiel GmbH');
    await seite.type('[name=ansprechperson]', 'Erika Muster');
    await seite.type('[name=email]', 'erika@beispiel.de');
    await seite.type('[name=telefon]', '+49 36 92 12345');
    await seite.select('[name=art]', 'senioren');
    await seite.type('[name=zielgruppe]', 'ältere Menschen in Gruppenangeboten');
    await seite.type('[name=einsatz]', 'Einsatz in der Gruppenarbeit am Vormittag.');
    await seite.click('[name=datenschutz]');
    await Promise.all([seite.waitForNavigation({ waitUntil: 'networkidle0' }), seite.click('button[type=submit]')]);

    const post = dienstAnfragen.find((a) => a.methode === 'POST');
    assert.ok(post, 'Ohne JavaScript ging kein POST an den Dienst.');
    assert.equal(post.url, `${DIENST}/api/public/pilot/bewerbung`);
    assert.match(post.headers['content-type'] || '', /^application\/x-www-form-urlencoded/);
    assert.deepEqual(Object.fromEntries(new URLSearchParams(post.body)), {
      einrichtung: 'Praxis Beispiel GmbH', ansprechperson: 'Erika Muster', email: 'erika@beispiel.de',
      telefon: '+49 36 92 12345', art: 'senioren', zielgruppe: 'ältere Menschen in Gruppenangeboten',
      einsatz: 'Einsatz in der Gruppenarbeit am Vormittag.', webseite: '', datenschutz: 'ja',
    });
    assert.match(await text(seite), /Danke für Ihre Bewerbung/);
  } finally {
    await seite.close();
  }
});

test('4b · das Lockfeld ist leer, unsichtbar und nicht erreichbar', async () => {
  const { seite } = await oeffnen(`${basis}/pilotpartner/`);
  try {
    const info = await seite.$eval('[name=webseite]', (el) => {
      const r = el.getBoundingClientRect();
      return { rechts: r.right, tab: el.tabIndex, wert: el.value, versteckt: el.closest('[aria-hidden=true]') !== null };
    });
    assert.ok(info.rechts < 0, 'Das Lockfeld liegt im Sichtfeld.');
    assert.equal(info.tab, -1);
    assert.equal(info.wert, '');
    assert.ok(info.versteckt);
  } finally {
    await seite.close();
  }
});

/* ── 5 ──────────────────────────────────────────────────────────────────── */
test('5 · Rückweg ?fehler=: sichtbar nach dem Einhängen, vorab ohne Bündel, unbekannter Wert zeigt nichts', async () => {
  const sichtbarerText = (seite) => seite.evaluate(() =>
    [...document.querySelectorAll('.callout')].filter((e) => !e.hidden && e.offsetParent !== null && !e.closest('noscript')).map((e) => e.innerText.trim()));

  // a) mit React
  let o = await oeffnen(`${basis}/pilotpartner/?fehler=zu_viele#bewerbung`);
  try {
    assert.deepEqual(await sichtbarerText(o.seite), ['Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.']);
    const fokus = await o.seite.evaluate(() => document.activeElement?.className + '|' + document.activeElement?.textContent);
    assert.match(fokus, /callout\|Zu viele Anfragen/, 'Der Fokus liegt nicht auf der Meldung.');
    const live = await o.seite.$$eval('#bewerbung [aria-live=polite]', (xs) => xs.length);
    assert.ok(live >= 1);
  } finally { await o.seite.close(); }

  // b) ohne Bündel: die Vorab-Schicht trägt
  o = await oeffnen(`${basis}/pilotpartner/?fehler=eingabe#bewerbung`, { js: true, buendelSperren: true });
  try {
    assert.deepEqual(await sichtbarerText(o.seite), ['Bitte prüfen Sie Ihre Angaben — ein Pflichtfeld fehlt oder ist zu lang.']);
  } finally { await o.seite.close(); }

  // c) unbekannter Wert, und keine Kennung
  for (const abfrage of ['?fehler=<b>x</b>', '?fehler=hacked', '']) {
    o = await oeffnen(`${basis}/pilotpartner/${abfrage}`);
    try {
      assert.deepEqual(await sichtbarerText(o.seite), [], `Für „${abfrage}" ist ein Hinweis sichtbar.`);
      assert.ok(!(await text(o.seite)).includes('hacked'), 'Ein Wert aus der Adresszeile steht in der Seite.');
    } finally { await o.seite.close(); }
  }
});

test('5b · Fehlerseite der Zustimmung: Grund sichtbar, unbekannter Wert nicht', async () => {
  let o = await oeffnen(`${basis}/pilotpartner/zustimmung/fehler/?grund=fassung`);
  try {
    const t = await text(o.seite);
    assert.match(t, /Die Pilotbedingungen wurden inzwischen aktualisiert\. Bitte öffnen Sie den Link aus unserer E-Mail erneut\./);
    assert.match(t, /kontakt\.rholabs@gmail\.com/);
  } finally { await o.seite.close(); }
  o = await oeffnen(`${basis}/pilotpartner/zustimmung/fehler/?grund=zzz`);
  try {
    const t = await text(o.seite);
    assert.ok(!/zzz/.test(t));
    assert.ok(!/abgelaufen oder wurde bereits verwendet|Zu viele Anfragen/.test(t));
    assert.match(t, /Mit diesem Link ließ sich die Bestätigung der Pilotbedingungen nicht abschließen\./);
  } finally { await o.seite.close(); }
});
