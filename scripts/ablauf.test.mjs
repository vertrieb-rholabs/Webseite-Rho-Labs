// Die Abläufe aus der Prüfung vom 22.09.2026 — im Browser nachgestellt.
//
// ── Warum es diese Datei gibt ───────────────────────────────────────────────
// `befunde.test.mjs` liest Quelltext und ausgeliefertes HTML. Das ist nötig,
// reicht aber genau dort nicht, wo der Fehler erst entsteht, NACHDEM der
// Browser die Seite übernommen hat: ein Query-Parameter, ein Referrer, eine
// Netzabfrage, die nicht antwortet. Der Vorwurf an die vorige Runde war
// zutreffend — neun grüne Lesetests, und keiner davon lief den Ablauf ab.
//
// Hier läuft er ab. Ein echter Chromium lädt die ausgelieferten Seiten aus
// `docs/` von einem örtlichen Server, und geprüft wird das, was am Bildschirm
// steht, nachdem React eingehängt ist.
//
// ── Aufruf ──────────────────────────────────────────────────────────────────
//   npm run build
//   node --test scripts/ablauf.test.mjs
//
// `puppeteer-core` ist — wie bei `npm run hydration` — keine feste Abhängigkeit
// des Erzeugnisses. Fehlt es, hilft:
//   npx --yes -p puppeteer-core node --test scripts/ablauf.test.mjs
// Fehlt der Browser: `npx --yes puppeteer browsers install chrome`.
//
// ── Gegenprobe ──────────────────────────────────────────────────────────────
// Diese Datei in einen Baum mit dem Stand VOR den Änderungen vom 22.09.2026
// legen (samt dessen eigenem `docs/`). Dann müssen 1, 2, 3 und 5 durchfallen;
// 4 ist die Kontrolle der Messung und muss in BEIDEN Ständen durchlaufen —
// sonst misst diese Datei nichts.

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

/** Ursprung des Auslieferungsdienstes — derselbe, mit dem gebaut wurde. */
const DIENST = 'https://fulfillment.rholabs.de';
const PARTNER_PFAD = '/api/public/partner/pruefen';

/** Ein Code im Format der Vorteilscodes (VORTEILSCODE_ZEICHEN, Länge 8). */
const CODE = 'ABCD2345';

/** Die Frist, die die Seite zusagt. Dieselbe Zahl wie in `HomePage.tsx`. */
const FRIST_MS = 8000;

const ZIEL = '/vertrag-widerrufen/eingegangen/';

// ── Der örtliche Server ─────────────────────────────────────────────────────

const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

/** Löst einen Pfad gegen `docs/` auf — mit Verzeichnis-Index wie GitHub Pages. */
function dateiFuer(pfad) {
  const rein = decodeURIComponent(pfad.split('?')[0]);
  if (rein.includes('..')) return null;
  const kandidaten = rein.endsWith('/')
    ? [path.join(DOCS, rein, 'index.html')]
    : [path.join(DOCS, rein), path.join(DOCS, rein, 'index.html')];
  for (const k of kandidaten) {
    try {
      if (fs.statSync(k).isFile()) return k;
    } catch { /* weiter */ }
  }
  return null;
}

/**
 * Die Prüfen-Seite des Dienstes, so wie `widerruf.ts` sie ausliefert.
 *
 * Entscheidend sind nicht die Farben, sondern `Referrer-Policy: no-referrer`
 * — als Kopfzeile UND als Meta-Angabe, beides steht im Dienst — und dass der
 * zweite Schritt eine Formularsendung ist, keine Verlinkung.
 */
const DIENST_PRUEFEN = `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">
<meta name="referrer" content="no-referrer">
<title>Widerruf prüfen</title></head><body>
<form method="post" action="/dienst/bestaetigen">
  <button type="submit" id="bestaetigen">Widerruf bestätigen</button>
</form>
</body></html>`;

function serverStarten() {
  const server = http.createServer((req, res) => {
    const pfad = (req.url || '/').split('?')[0];

    // ── Der Dienst, nachgestellt ───────────────────────────────────────────
    if (pfad === '/dienst/pruefen') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow',
        'Referrer-Policy': 'no-referrer',
      });
      return res.end(DIENST_PRUEFEN);
    }
    if (pfad === '/dienst/bestaetigen') {
      // DER 303 des Dienstes: nackte Zieladresse, kein Anhängsel.
      res.writeHead(303, { Location: ZIEL });
      return res.end();
    }

    // ── Die ausgelieferte Website ──────────────────────────────────────────
    const datei = dateiFuer(pfad);
    if (!datei) {
      const vierhundertvier = path.join(DOCS, '404.html');
      if (fs.existsSync(vierhundertvier)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(vierhundertvier));
      }
      res.writeHead(404);
      return res.end('nicht gefunden');
    }
    res.writeHead(200, {
      'Content-Type': TYPEN[path.extname(datei).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(fs.readFileSync(datei));
  });

  return new Promise((fertig) => {
    server.listen(0, '127.0.0.1', () => {
      fertig({ server, basis: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

// ── Aufbau und Abbau ────────────────────────────────────────────────────────

let browser;
let server;
let basis;

before(async () => {
  if (!fs.existsSync(path.join(DOCS, 'index.html'))) {
    assert.fail(
      'docs/ fehlt. Diese Tests fahren die AUSGELIEFERTE Seite an — '
      + 'vorher `npm run build` laufen lassen.',
    );
  }
  ({ server, basis } = await serverStarten());
  browser = await puppeteer.launch({
    executablePath: browserPfad(),
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((fertig) => server.close(fertig));
});

/**
 * Wartet, bis React die Seite übernommen hat.
 *
 * Der Nachweis ist kein Zeitablauf, sondern eine Spur, die nur React
 * hinterlässt: An jedem eingehängten Knoten hängt eine eigene Eigenschaft
 * `__reactFiber$…`. Steht sie da, ist hydriert; steht sie nach der Frist nicht
 * da, fällt der Test mit einer Meldung und nicht mit einer Vermutung.
 */
async function hydriert(seite) {
  await seite.waitForFunction(
    () => {
      for (const knoten of document.querySelectorAll('*')) {
        for (const schluessel in knoten) {
          if (schluessel.startsWith('__reactFiber$')) return true;
        }
      }
      return false;
    },
    { timeout: 20000, polling: 'mutation' },
  ).catch(() => {
    assert.fail(
      'React hat die Seite nicht übernommen. Dann prüft dieser Test nichts — '
      + 'erst `npm run build`, dann erneut.',
    );
  });
  // Ein Bildlauf weiter, damit auch die Effekte nach dem Einhängen durch sind.
  await seite.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/** Der sichtbare Text der Seite. */
function textVon(seite) {
  return seite.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
}

/** Prüft die beiden Sätze, die die Seite ohne Kenntnis des Vorgangs nicht sagen darf. */
function keinEingangBehauptet(text, wieHergekommen) {
  assert.doesNotMatch(
    text, /Ihr Widerruf ist eingegangen/,
    `${wieHergekommen}: Die Seite behauptet den Eingang. Sie kennt den Vorgang nicht.`,
  );
  assert.doesNotMatch(
    text, /Widerrufserklärung erhalten/,
    `${wieHergekommen}: Die Seite behauptet, die Erklärung erhalten zu haben.`,
  );
  assert.match(
    text, /kennt Ihren Vorgang nicht/,
    `${wieHergekommen}: Die Seite sagt nicht, dass sie den Vorgang nicht kennt.`,
  );
  assert.match(
    text, /Eingangsbestätigung/,
    `${wieHergekommen}: Die Seite nennt den einzigen Nachweis nicht, den es gibt.`,
  );
}

/* ── 1 ────────────────────────────────────────────────────────────────────
   BEFUND 1 · Der Erfolgsmarker war frei setzbar.

   Ablauf: Jemand tippt die Adresse mit dem Anhängsel ein oder folgt einem
   Link, den ihm jemand geschickt hat. Beim Dienst ist nichts angekommen.
   -------------------------------------------------------------------------- */
test('1 · ein eingetipptes ?eingang=bestaetigt ist kein Nachweis', async () => {
  const seite = await browser.newPage();
  try {
    await seite.goto(`${basis}${ZIEL}?eingang=bestaetigt`, { waitUntil: 'networkidle0' });
    await hydriert(seite);
    keinEingangBehauptet(await textVon(seite), 'Direkt eingetippt, mit ?eingang=bestaetigt');
  } finally {
    await seite.close();
  }
});

/* ── 2 ────────────────────────────────────────────────────────────────────
   BEFUND 1/2 · Auch ein Referrer vom Dienst ist kein Nachweis.

   Ablauf: Irgendeine Seite auf dem Rechnernamen des Dienstes verlinkt hierher
   — die Eingabeseite des Widerrufs zum Beispiel, oder eine Fehlerseite. Der
   Browser trägt dann den Ursprung des Dienstes als Referrer ein, obwohl
   niemand etwas erklärt hat.

   Der Referrer wird nicht behauptet, sondern erzeugt: Unter dem echten
   Rechnernamen des Dienstes steht eine Seite, die hierher verlinkt. Ihr
   `referrer`-Vermerk ist `unsafe-url`, damit der Browser den Ursprung auch
   beim Wechsel von https auf den örtlichen Server mitgibt — ohne diesen
   Kunstgriff verwürfe er ihn, und der Test prüfte die Abwesenheit einer
   Wirkung, die es gar nicht erst gegeben hätte. Vor der eigentlichen Prüfung
   steht deshalb die Zusicherung, dass der Referrer wirklich angekommen ist.
   -------------------------------------------------------------------------- */
test('2 · ein Referrer vom Dienst ist kein Nachweis', async () => {
  const seite = await browser.newPage();
  try {
    const herkunft = `${DIENST}/widerruf/pruefen`;
    await seite.setRequestInterception(true);
    seite.on('request', (anfrage) => {
      if (anfrage.url() === herkunft) {
        return anfrage.respond({
          status: 200,
          contentType: 'text/html; charset=utf-8',
          body: '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">'
            + '<meta name="referrer" content="unsafe-url"><title>Dienst</title></head>'
            + `<body><a id="weiter" href="${basis}${ZIEL}">weiter</a></body></html>`,
        }).catch(() => {});
      }
      return anfrage.continue().catch(() => {});
    });

    await seite.goto(herkunft, { waitUntil: 'domcontentloaded' });
    await Promise.all([
      seite.waitForNavigation({ waitUntil: 'networkidle0' }),
      seite.click('#weiter'),
    ]);

    assert.equal(
      await seite.evaluate(() => document.referrer), herkunft,
      'Der Referrer kam gar nicht an — dann sagt dieser Test nichts aus.',
    );

    await hydriert(seite);
    keinEingangBehauptet(await textVon(seite), 'Mit einem Referrer vom Dienst');
  } finally {
    await seite.close();
  }
});

/* ── 3 ────────────────────────────────────────────────────────────────────
   BEFUND 2 · Der echte Weg des Dienstes.

   Ablauf: Prüfen-Seite des Dienstes (no-referrer) → Formularsendung an
   /widerruf/bestaetigen → 303 auf die nackte Zieladresse. Genau so macht es
   `widerruf.ts`.

   Geprüft wird zweierlei:
     a) Der Referrer ist auf diesem Weg LEER — der Dienst schreibt das selbst
        vor. Ein Nachweis über `document.referrer` kann es also nie geben.
     b) Die Seite zeigt demjenigen, der wirklich widerrufen hat, genau
        dasselbe wie jedem anderen. Sie hat ein Gesicht, nicht zwei.
   -------------------------------------------------------------------------- */
test('3 · der echte 303 des Dienstes bringt keinen Referrer — und die Seite hat ein Gesicht', async () => {
  const seite = await browser.newPage();
  try {
    await seite.goto(`${basis}/dienst/pruefen`, { waitUntil: 'domcontentloaded' });
    await Promise.all([
      seite.waitForNavigation({ waitUntil: 'networkidle0' }),
      seite.click('#bestaetigen'),
    ]);

    assert.equal(
      new URL(seite.url()).pathname, ZIEL,
      'Der 303 des Dienstes landete nicht auf der Ergebnisseite.',
    );
    assert.equal(
      await seite.evaluate(() => document.referrer), '',
      'Auf dem echten Weg ist der Referrer nicht leer — dann steht Befund 2 anders da, '
      + 'als der Dienst ihn vorgibt.',
    );

    await hydriert(seite);
    const echterWeg = await textVon(seite);
    keinEingangBehauptet(echterWeg, 'Über den echten 303 des Dienstes');

    // Dasselbe Gesicht wie beim direkten Aufruf und wie mit Anhängsel.
    const zweite = await browser.newPage();
    try {
      await zweite.goto(`${basis}${ZIEL}`, { waitUntil: 'networkidle0' });
      await hydriert(zweite);
      assert.equal(
        echterWeg, await textVon(zweite),
        'Der echte Absender sieht etwas anderes als der direkte Aufruf.',
      );

      await zweite.goto(`${basis}${ZIEL}?eingang=bestaetigt`, { waitUntil: 'networkidle0' });
      await hydriert(zweite);
      assert.equal(
        echterWeg, await textVon(zweite),
        'Ein Anhängsel in der Adresszeile ändert, was die Seite behauptet.',
      );
    } finally {
      await zweite.close();
    }
  } finally {
    await seite.close();
  }
});

/* ── 4 ────────────────────────────────────────────────────────────────────
   KONTROLLE DER MESSUNG.

   Dieser Test prüft keinen Befund. Er prüft, dass diese Datei überhaupt sieht,
   wann React übernimmt — sonst könnten 1 bis 3 grün sein, weil nie etwas
   geladen wurde. Der Marker `data-preis-bereit` wird von `HomePage.tsx` beim
   Einhängen gesetzt; er ist Erzeugnis-Code, keine Testhilfe.
   -------------------------------------------------------------------------- */
test('4 · Kontrolle: in dieser Umgebung hängt React wirklich ein', async () => {
  const seite = await browser.newPage();
  try {
    await seite.goto(`${basis}/home`, { waitUntil: 'networkidle0' });
    await seite.waitForFunction(
      () => document.documentElement.hasAttribute('data-preis-bereit'),
      { timeout: 20000 },
    );
    await hydriert(seite);
  } finally {
    await seite.close();
  }
});

/* ── 5 ────────────────────────────────────────────────────────────────────
   BEFUND 4 · Die Notbremse am Bestellknopf.

   Ablauf: Aufruf über einen Vorteilslink. Die Seite hydriert, der Knopf ist
   gesperrt, und die Preisabfrage beim Dienst antwortet nicht — nicht mit einem
   Fehler, sondern gar nicht. Das ist der realistische Fall: eine offene
   Verbindung, die hängt.

   Die Notbremse im Inline-Skript greift hier NICHT, weil `data-preis-bereit`
   gesetzt ist; der Test prüft das ausdrücklich. Es muss also die Seite selbst
   sein, die nach der zugesagten Frist aufgibt.
   -------------------------------------------------------------------------- */
test('5 · eine hängende Preisabfrage sperrt den Bestellknopf nicht für immer', async () => {
  const seite = await browser.newPage();
  try {
    const haengend = [];
    await seite.setRequestInterception(true);
    seite.on('request', (anfrage) => {
      // Diese eine Anfrage wird NIE beantwortet und NIE abgebrochen.
      if (anfrage.url().includes(PARTNER_PFAD)) {
        haengend.push(anfrage.url());
        return;
      }
      anfrage.continue().catch(() => { /* Seite schon zu */ });
    });

    await seite.goto(`${basis}/home?ref=${CODE}`, { waitUntil: 'domcontentloaded' });

    // React übernimmt — ab hier ist die Notbremse im Inline-Skript abgeschaltet.
    await seite.waitForFunction(
      () => document.documentElement.hasAttribute('data-preis-bereit'),
      { timeout: 20000 },
    );
    const begonnen = Date.now();

    // Die Abfrage läuft wirklich und hängt wirklich.
    await new Promise((r) => setTimeout(r, 1500));
    assert.equal(
      haengend.length, 1,
      'Die Preisabfrage wurde gar nicht gestellt — dann prüft dieser Test nichts.',
    );
    assert.equal(
      await seite.$eval('.form__submit', (knopf) => knopf.disabled), true,
      'Der Bestellknopf ist während der Prüfung nicht gesperrt.',
    );

    // Und nun die zugesagte Frist abwarten, mit Zuschlag.
    await new Promise((r) => setTimeout(r, FRIST_MS + 2500 - (Date.now() - begonnen)));

    assert.equal(
      await seite.$eval('.form__submit', (knopf) => knopf.disabled), false,
      `Nach ${(FRIST_MS + 2500) / 1000} Sekunden ist der Bestellknopf immer noch gesperrt. `
      + 'Die Seite sagt eine Notbremse nach acht Sekunden zu; für den hängenden '
      + 'Abruf gibt es sie nicht.',
    );
    assert.match(
      await textVon(seite), /lässt sich gerade nicht bestätigen/,
      'Der Knopf ist frei, aber die Seite sagt nicht, welcher Preis jetzt gilt.',
    );
    assert.equal(
      haengend.length, 1,
      'Die Preisabfrage wurde ein zweites Mal gestellt.',
    );
  } finally {
    await seite.close();
  }
});
