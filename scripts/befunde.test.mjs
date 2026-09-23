// Die Befunde vom 22.09.2026 — je ein Test, der gegen den Stand DAVOR umfällt.
//
// Geprüft wird an zwei Orten, und beides ist nötig:
//
//   QUELLE — damit erkennbar bleibt, WARUM etwas so dasteht. Ein Test, der nur
//     das Erzeugnis ansieht, lässt sich durch eine Umformulierung besänftigen,
//     die den Grund wegnimmt.
//   ERZEUGNIS (docs/) — damit die Aussage über die AUSGELIEFERTE Seite gilt.
//     Gerade bei einer vorgerenderten Seite ist das der Unterschied: Was React
//     nach dem Einhängen tut, sieht ein Besucher ohne JavaScript nie.
//
// Deshalb: erst `npm run build`, dann
//   node --test scripts/befunde.test.mjs
// Nicht Teil von `npm run pruefen`, wie die anderen beiden Testdateien auch
// nicht.
//
// Gegenprobe: dieselbe Datei in einen Baum mit dem Stand VOR den Änderungen
// legen (samt dessen eigenem `docs/`) und dort laufen lassen. Jeder Test muss
// gegen den Stand vor SEINER Runde durchfallen — sonst prüft er nichts.
//
// ── Ein Test ist mit Absicht rot ─────────────────────────────────────────────
// Test 14 hält einen Befund offen, dessen Änderung NICHT hier liegt, sondern
// im Dienst (`mailer.ts`, eine Zeile — sie steht ausgeschrieben im Kopf des
// Tests). Er bleibt rot, bis der Dienst nachgezogen ist, und genau das ist
// sein Zweck: Ein Befund, der nur in einem Bericht steht, geht verloren; einer,
// der eine Testausgabe rot hält, nicht. Wer ihn grün machen will, ändert den
// Dienst — nicht den Test.
//
// Stand 22.09.2026: 15 Tests, 14 grün, Test 14 rot (offen, Änderung im Dienst).
//
// Stand 23.09.2026: 19 Tests, alle grün. Die beiden roten Merker (14 und 19)
// sind geschlossen, weil der Dienst nachgezogen hat — nicht weil der Test
// nachgab. Test 12 fiel am Morgen des 23.09. zu Recht: Der Dienst hatte einen
// zweiten Löschweg für Aktivierungen bekommen; die Datenschutzerklärung nennt
// ihn jetzt, und der Test hält jede ihrer Aussagen darüber gegen den Dienst.
// Mehrere Tests lesen den Dienst mit (10, 12, 13, 14, 15, 18, 19). Wird dort
// weitergearbeitet, kann einer davon fallen — das ist dann eine Frage an
// den Text, kein Fehler des Tests.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Quelltext. Eine fehlende Datei ist ein leerer Text — dann trägt die
    Zusicherung die Meldung und nicht ein Stapelabzug. */
function quelle(rel) {
  try {
    return fs.readFileSync(path.join(root, rel), 'utf8');
  } catch {
    return '';
  }
}

/**
 * Quelltext ohne Kommentare.
 *
 * Gebraucht, wo ein Test die Abwesenheit einer Wendung im CODE zusichert: Die
 * Begründung, warum es sie nicht mehr gibt, nennt sie zwangsläufig beim Namen
 * und stünde sonst dem eigenen Test im Weg. Kommentare sollen den Grund
 * festhalten dürfen; der Test prüft, was ausgeführt wird.
 */
function ohneKommentare(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/** Eine Seite aus dem Erzeugnis. */
function seite(rel) {
  const voll = path.join(root, 'docs', rel);
  if (!fs.existsSync(voll)) {
    assert.fail(
      `${rel} fehlt im Erzeugnis. Diese Tests prüfen die ausgelieferte Seite — `
      + 'vorher `npm run build` laufen lassen.',
    );
  }
  return fs.readFileSync(voll, 'utf8');
}

/* ── 1 · hoch ─────────────────────────────────────────────────
   Die Ergebnisseite des Widerrufs behauptete den Eingang ohne jeden Nachweis,
   für jeden, der die Adresse eintippte. Bei einer fristgebundenen
   Rechtsausübung ist das der falsche Satz am falschen Ort.

   Zweiter Anlauf am 22.09.2026 — und der war es auch noch nicht: Der Satz
   stand dann unter dem Vorbehalt `?eingang=bestaetigt` oder eines Referrers
   vom Dienst. Beides ist kein Nachweis (Begründung im Kopf der Seite), also
   ist der Satz jetzt GANZ weg. Dieser Test prüft das dort, wo es sich nicht
   umformulieren lässt: im ausgelieferten Bündel. Steht die Zeichenfolge dort
   nicht, kann kein Zweig sie anzeigen.

   Den ABLAUF — eingetippter Parameter, gesetzter Referrer, echter 303 —
   stellt `scripts/ablauf.test.mjs` im Browser nach.
   -------------------------------------------------------------------------- */
test('1 hoch — die Widerrufs-Ergebnisseite kann den Eingang gar nicht behaupten', () => {
  const html = seite(path.join('vertrag-widerrufen', 'eingegangen', 'index.html'));

  assert.doesNotMatch(
    html, /Ihr Widerruf ist eingegangen/,
    'Die vorgerenderte Seite behauptet den Eingang — sie kennt den Vorgang aber nicht.',
  );
  assert.doesNotMatch(
    html, /Widerrufserklärung erhalten/,
    'Die vorgerenderte Seite behauptet, die Erklärung erhalten zu haben.',
  );

  // Der Weg des Dienstes darf nicht zerstört sein: Das Verzeichnis entsteht
  // weiter, die Seite trägt weiter noindex, und sie sagt, woran der Eingang
  // wirklich hängt.
  assert.match(html, /noindex/, 'Die Seite hat ihr noindex verloren.');
  assert.match(
    html, /Eingangsbestätigung/,
    'Die Seite muss auf die Eingangsbestätigung nach § 356a Abs. 4 verweisen.',
  );

  /* Und nun das Bündel. Hier lag der zweite Fehler: Die vorgerenderte Fassung
     war vorsichtig, die Erfolgsfassung stand trotzdem im JavaScript und wurde
     nach der Hydration eingeblendet, sobald jemand das Anhängsel eintippte. */
  const buendel = fs.readdirSync(path.join(root, 'docs', 'assets'))
    .filter((name) => name.endsWith('.js'))
    .map((name) => fs.readFileSync(path.join(root, 'docs', 'assets', name), 'utf8'));
  assert.ok(buendel.length > 0, 'Kein JavaScript im Erzeugnis — erst `npm run build`.');

  for (const text of buendel) {
    assert.doesNotMatch(
      text, /Ihr Widerruf ist eingegangen/,
      'Der Erfolgssatz steht im ausgelieferten Bündel. Dann gibt es einen Zweig, '
      + 'der ihn anzeigt — und einen Weg, diesen Zweig auszulösen.',
    );
    assert.doesNotMatch(
      text, /Widerrufserklärung erhalten/,
      'Die zweite Behauptung steht im ausgelieferten Bündel.',
    );
  }

  /* Und in der Quelle: kein Zweig mehr, der von einer Adresszeile oder einer
     Vorseite abhängt. Das ist der Grund, warum das Bündel sauber ist.
     Geprüft wird der CODE, nicht der Kommentar — im Kopf der Seite steht
     ausführlich, warum es diese Zweige nicht mehr gibt, und das soll dort
     stehen bleiben dürfen. */
  const tsx = ohneKommentare(quelle('src/pages/widerruf/WiderrufEingegangen.tsx'));
  assert.doesNotMatch(
    tsx, /useSearchParams|document\.referrer|DIENST_URSPRUNG/,
    'Die Seite macht ihre Aussage wieder davon abhängig, woher der Besucher kommt. '
    + 'Weder ein Anhängsel in der Adresszeile noch ein Referrer ist an einen '
    + 'Vorgang gebunden.',
  );

  const constants = quelle('src/constants.ts');
  assert.doesNotMatch(
    constants, /export const WIDERRUF_EINGANG_/,
    'Der frei setzbare Erfolgsmarker ist wieder da.',
  );
  assert.doesNotMatch(
    constants, /export const DIENST_URSPRUNG/,
    'Der Ursprung des Dienstes wird wieder als Nachweis vorgehalten.',
  );
});

/* ── 2 · mittel ───────────────────────────────────────────────────────────
   Die Datenschutzerklärung sagte, vor dem Absenden werde beim
   Auslieferungsdienst nichts abgerufen. Ein gültiges ?ref= löst genau das aus.
   -------------------------------------------------------------------------- */
test('2 mittel — die Datenschutzerklärung nennt den Abruf beim Öffnen mit ?ref=', () => {
  const constants = quelle('src/constants.ts');

  assert.doesNotMatch(
    constants,
    /Solange du das Formular nicht absendest, wird von dort nichts geladen und nichts abgerufen/,
    'Der unwahre Satz steht noch in der Erklärung.',
  );
  assert.doesNotMatch(
    constants,
    /Sie lädt nichts von PayPal und nichts von unserem Auslieferungsdienst nach/,
    'Auch der zweite unwahre Satz steht noch in der Erklärung.',
  );

  const datenschutz = seite(path.join('datenschutz', 'index.html'));
  assert.match(
    datenschutz, /ref=/,
    'Die ausgelieferte Erklärung erwähnt den Vorteilslink nicht.',
  );
  assert.match(
    datenschutz, /schon beim Öffnen der Seite/,
    'Sie sagt nicht, dass der Abruf VOR dem Absenden geschieht.',
  );
  assert.match(
    datenschutz, /unterbleibt diese Abfrage/,
    'Sie sagt nicht, wann der Abruf unterbleibt.',
  );
});

/* ── 3 · mittel ───────────────────────────────────────────────────────────
   Die Widerrufsverarbeitung kam in der Datenschutzerklärung überhaupt nicht
   vor — obwohl das Formular für Einzelheiten dorthin verweist.
   -------------------------------------------------------------------------- */
test('3 mittel — die Datenschutzerklärung kennt die Widerrufsverarbeitung', () => {
  const datenschutz = seite(path.join('datenschutz', 'index.html'));

  assert.match(
    datenschutz, /Widerruf über die Widerrufsfunktion/,
    'Es gibt keinen Abschnitt zur Widerrufsverarbeitung.',
  );
  for (const [stueck, warum] of [
    ['2.000 Zeichen', 'der Umfang des Freitextes fehlt'],
    ['356a', 'die Norm fehlt'],
    ['Rechtsgrundlage', 'die Rechtsgrundlage fehlt'],
    ['Speicherdauer', 'die Speicherdauer fehlt'],
    ['Empfänger', 'die Empfänger fehlen'],
    ['fulfillment.rholabs.de', 'der Ort der zweiten Stufe fehlt'],
  ]) {
    assert.ok(
      datenschutz.includes(stueck),
      `Abschnitt zur Widerrufsverarbeitung: ${warum} (${stueck}).`,
    );
  }
});

/* ── 4 · mittel ───────────────────────────────────────────────────────────
   Die Rückwege des Dienstes wurden erst NACH der Hydration gelesen. Wer ohne
   JavaScript oder vor dem Einhängen abgewiesen wurde, sah wieder das leere
   Formular — ohne Grund und ohne Weg.
   -------------------------------------------------------------------------- */
test('4 mittel — die Rückwege stehen vorgerendert in der Seite', () => {
  const home = seite(path.join('home', 'index.html'));
  for (const kennung of ['eingabe', 'zuviele', 'zahlung', 'derzeit', 'ungueltig']) {
    assert.match(
      home, new RegExp(`data-rueckweg="${kennung}"`),
      `Der Hinweis zu '${kennung}' steht nicht im ausgelieferten HTML der Kaufseite.`,
    );
  }
  assert.match(
    home, /data-vorab/,
    'Die Vorab-Schicht ist nicht als solche gekennzeichnet.',
  );
  assert.match(
    home, /<script>\(function\(\)\{try\{var z=function\(w\)\{var n=document\.querySelectorAll\('\[data-rueckweg/,
    'Das synchrone Skript, das die Hinweise aufdeckt, fehlt auf der Kaufseite.',
  );
  assert.match(
    home, /Sehen Sie dieses Formular nach dem Absenden erneut/,
    'Der noscript-Hinweis der Kaufseite fehlt — ohne Skript bliebe der Leser ohne Auskunft.',
  );

  const widerruf = seite(path.join('vertrag-widerrufen', 'index.html'));
  for (const kennung of ['eingabe', 'zuviele']) {
    assert.match(
      widerruf, new RegExp(`data-rueckweg="${kennung}"`),
      `Der Hinweis zu '${kennung}' steht nicht im ausgelieferten HTML der Widerrufsseite.`,
    );
  }
  assert.match(
    widerruf, /<script>\(function\(\)\{try\{var z=function\(w\)/,
    'Das synchrone Skript fehlt auf der Widerrufsseite.',
  );
  assert.match(
    widerruf, /Sehen Sie das leere Formular nach dem Absenden erneut/,
    'Der noscript-Hinweis der Widerrufsseite fehlt.',
  );

  // Und die Übergabe an React, ohne die der Hinweis nach dem Einhängen wieder
  // verschwände: am Bildschirm nachgemessen, siehe src/rueckwege.ts.
  const modul = quelle('src/rueckwege.ts');
  assert.match(modul, /export function vorabSchichtAusblenden/, 'Die Übergabe an React fehlt.');
  for (const datei of ['src/pages/HomePage.tsx', 'src/pages/WiderrufErklaeren.tsx']) {
    assert.match(
      quelle(datei), /vorabSchichtAusblenden\(\)/,
      `${datei} übergibt die Anzeige nicht an React — der Hinweis verschwände beim Einhängen.`,
    );
  }
});

/* ── 5 · niedrig ──────────────────────────────────────────────────────────
   Zwischen Inline-Skript und Hydration konnte ein Vorteilscode abgesendet
   werden, während nur 39,90 € dastand. Und danach ging der Code ganz verloren.
   -------------------------------------------------------------------------- */
test('5 niedrig — angezeigter Preis und abgesendeter Code können nicht auseinanderfallen', () => {
  const home = seite(path.join('home', 'index.html'));

  assert.match(
    home, /data-preis-pruefung/,
    'Der Sperr-Hinweis für die Zeit vor dem Einhängen fehlt.',
  );
  assert.match(
    home, /b\.disabled=true/,
    'Der Bestellknopf wird vor dem Einhängen nicht gesperrt, solange ein Code im Feld steht.',
  );
  assert.match(
    home, /data-preis-bereit/,
    'Die Notbremse kennt kein Zeichen dafür, dass React übernommen hat — '
    + 'bliebe das Bündel aus, wäre der Knopf für immer gesperrt.',
  );

  const tsx = quelle('src/pages/HomePage.tsx');
  assert.match(
    tsx, /gehaltenerCode/,
    'Der Code wird nach einem erneuten Rendern nicht wiederhergestellt. React setzt '
    + 'unkontrollierte Felder dabei auf defaultValue zurück: Die Seite zeigte dann '
    + '35,90 €, abgesendet worden wäre eine Bestellung ohne Code — der Dienst hätte '
    + '39,90 € berechnet.',
  );
  assert.match(
    tsx, /const feld = refFeld\.current;[\s\S]{0,200}feld\.value = code;/,
    'Der Effekt, der den Code nach jedem Rendern zurückschreibt, fehlt.',
  );
});

/* ── 6 · niedrig ──────────────────────────────────────────────────────────
   docs/.vite/ssr-manifest.json wurde mitveröffentlicht, mit absoluten
   Build-Pfaden — örtlich samt Kontoname.
   -------------------------------------------------------------------------- */
test('6 niedrig — das Bauverzeichnis wird nicht mitveröffentlicht', () => {
  assert.ok(
    !fs.existsSync(path.join(root, 'docs', '.vite')),
    'docs/.vite steht noch im Erzeugnis und würde mitveröffentlicht.',
  );

  const config = quelle('vite.config.ts');
  assert.match(
    config, /rmSync\(path\.resolve\(dir, '\.vite'\)/,
    'vite.config.ts räumt das Bauverzeichnis nicht ab — beim nächsten Bau stünde es wieder da.',
  );
});

/* ── 7 · Recht 2 ──────────────────────────────────────────────────────────
   Der Pflichtblock vor dem Bestellknopf sagte „Windows 10 oder neuer", die
   abgenommenen Texte und die Bestätigungsmail „nur mit Windows 10 und
   Windows 11".
   -------------------------------------------------------------------------- */
test('7 Recht 2 — die Windows-Zusage ist überall dieselbe', () => {
  const constants = quelle('src/constants.ts');
  assert.match(
    constants, /export const SYSTEM_REQUIREMENTS: string\[\] = \[\s*'Windows 10 oder Windows 11'/,
    'Der Pflichtblock sagt etwas anderes als die abgenommenen Vertragsbedingungen.',
  );

  // Und auf KEINER ausgelieferten Seite die weitere Fassung. Geprüft wird das
  // Erzeugnis und nicht der Quelltext: Im Quelltext darf der alte Wortlaut in
  // einer Erläuterung stehen, auf einer Seite darf er nirgends mehr stehen.
  const gefunden = [];
  const suche = (verzeichnis) => {
    for (const eintrag of fs.readdirSync(verzeichnis, { withFileTypes: true })) {
      const voll = path.join(verzeichnis, eintrag.name);
      if (eintrag.isDirectory()) suche(voll);
      else if (eintrag.name.endsWith('.html')
        && fs.readFileSync(voll, 'utf8').includes('Windows 10 oder neuer')) {
        gefunden.push(path.relative(path.join(root, 'docs'), voll));
      }
    }
  };
  suche(path.join(root, 'docs'));
  assert.deepEqual(
    gefunden, [],
    `Die weitere Zusage steht noch auf: ${gefunden.join(', ')}`,
  );

  const home = seite(path.join('home', 'index.html'));
  assert.match(home, /Windows 10 oder Windows 11/, 'Der Pflichtblock nennt die Fassung nicht.');
});

/* ── 8 · Recht 4 ──────────────────────────────────────────────────────────
   „Derzeit ausschließlich in Deutschland erhältlich" — eine Beschränkung, die
   weder in den abgenommenen Texten noch im Dienst existiert, und die zudem
   UNTER dem Bestellknopf stand statt am Beginn des Bestellvorgangs
   (§ 312j Abs. 1 BGB).
   -------------------------------------------------------------------------- */
test('8 Recht 4 — keine Gebietsgrenze, die niemand einhält', () => {
  const constants = quelle('src/constants.ts');
  assert.doesNotMatch(
    constants, /export const PREIS_HINWEIS =[\s\S]{0,400}Deutschland erhältlich/,
    'Die Gebietsgrenze steht noch im Preishinweis.',
  );

  for (const rel of [path.join('home', 'index.html'), path.join('kognitives-training', 'index.html')]) {
    assert.doesNotMatch(
      seite(rel), /Deutschland erhältlich/,
      `${rel} behauptet weiter eine Gebietsgrenze, die der Dienst nicht prüft.`,
    );
  }

  // Die Beschränkungen, die es WIRKLICH gibt, stehen weiter am Beginn des
  // Bestellvorgangs — also vor dem Knopf und nicht darunter.
  const home = seite(path.join('home', 'index.html'));
  const beschraenkung = home.indexOf('Lieferbeschränkung');
  const knopf = home.indexOf('Zahlungspflichtig bestellen');
  assert.ok(beschraenkung > -1, 'Die Angabe zu Lieferbeschränkungen fehlt ganz.');
  assert.ok(
    beschraenkung < knopf,
    '§ 312j Abs. 1 BGB: Die Angabe zu Lieferbeschränkungen muss am Beginn des '
    + 'Bestellvorgangs stehen, nicht hinter dem Knopf.',
  );
});

/* ── 9 · Recht 5 ──────────────────────────────────────────────────────────
   Für denselben Vorgang — die Umbindung einer Lizenz — nannten die
   Lizenzbedingungen kontakt.rholabs@gmail.com und der Aktivierungsdienst
   vertrieb.rholabs@gmail.com.
   -------------------------------------------------------------------------- */
test('9 Recht 5 — eine Adresse für eine bereits gekaufte Lizenz', () => {
  const constants = quelle('src/constants.ts');
  assert.match(
    constants, /export const LIZENZ_SUPPORT_EMAIL = CONTACT_EMAIL/,
    'Es gibt keine eine Stelle, die sagt, welche Adresse für eine bestehende Lizenz gilt.',
  );

  const kontakt = seite(path.join('kontakt', 'index.html'));
  assert.match(
    kontakt, /bereits gekauften Lizenz/,
    'Die Kontaktseite sagt nicht, wohin eine Frage zur gekauften Lizenz gehört.',
  );
  assert.doesNotMatch(
    kontakt, /Vertrieb &amp; Lizenzen|Vertrieb & Lizenzen/,
    'Die Überschrift „Vertrieb & Lizenzen" schickt Lizenzinhaber weiter an die '
    + 'Vertriebsadresse — genau die Verwechslung, um die es geht.',
  );

  for (const datei of ['src/pages/ContactPage.tsx', 'src/components/Footer.tsx']) {
    assert.match(
      quelle(datei), /LIZENZ_SUPPORT_EMAIL/,
      `${datei} nennt die Adresse für bestehende Lizenzen nicht aus der einen Stelle.`,
    );
  }
});

/* ── 10 · Sol, Befund 3 ───────────────────────────────────────
   Die Datenschutzerklärung sagte, eine begonnene, nicht bestätigte Eingabe
   verfalle nach kurzer Zeit. Tatsächlich verfällt nach 30 Minuten nur der
   Bestätigungslink; die Zeile mit Name, Freitext, Adresse und IP bleibt
   stehen, denn ein Löschweg für Entwürfe existiert nicht.

   Geprüft wird beides und in dieser Reihenfolge:
     a) Der ausgelieferte Text verspricht keinen Verfall.
     b) Am Dienst — wenn er hier liegt — gibt es weiterhin keinen Löschlauf.
        Entsteht einer, fällt DIESER Test und erinnert daran, dass die Zusage
        dann wieder in den Text gehört. Text und Wirklichkeit bewegen sich
        zusammen oder gar nicht.
   -------------------------------------------------------------------------- */
test('10 mittel — die Speicherdauer sagt, was der Dienst wirklich tut', () => {
  const html = seite(path.join('datenschutz', 'index.html'));

  assert.doesNotMatch(
    html, /nicht bestätigte Eingabe verfällt/,
    'Die Datenschutzerklärung verspricht wieder einen Verfall, den es nicht gibt.',
  );
  assert.match(
    html, /Bestätigungslink gilt nur 30 Minuten/,
    'Der Text sagt nicht, was nach 30 Minuten wirklich abläuft.',
  );
  assert.match(
    html, /löschen wir jedoch nicht von selbst/,
    'Der Text verschweigt, dass die Eingabe gespeichert bleibt.',
  );
  assert.match(
    html, /Art. 17 DSGVO/,
    'Wenn nichts von selbst gelöscht wird, muss der Weg zur Löschung dastehen.',
  );

  // ── b) Gegenprobe am Dienst ───────────────────────────────────────────────
  const dienst = process.env.DIENST_QUELLE
    || path.resolve(root, '..', '..', 'Software', 'Rholabs-fullfilment');
  const datenbank = path.join(dienst, 'src', 'main', 'database.ts');
  if (!fs.existsSync(datenbank)) {
    console.log(
      `      ℹ Dienst nicht gefunden (${datenbank}) — die Gegenprobe am Dienst `
      + 'lief nicht mit. Pfad über DIENST_QUELLE setzen.',
    );
    return;
  }
  const quelltext = fs.readFileSync(datenbank, 'utf8');
  assert.doesNotMatch(
    quelltext, /DELETE\s+FROM\s+widerrufe/i,
    'Der Dienst löscht jetzt Widerrufs-Entwürfe. Das ist gut — und die '
    + 'Datenschutzerklärung muss es wieder sagen dürfen. Beide Stellen nachziehen.',
  );
});

/* ── 11 · Sol, Befund 4 ───────────────────────────────────────
   Die Acht-Sekunden-Notbremse gab es nur im Inline-Skript, also nur für den
   Fall, dass React gar nicht übernimmt. Der häufigere Fall — Seite hängt
   ein, Preisabfrage hängt — hatte keine Frist.

   Dieser Test hält nur zusammen, was auseinanderlaufen kann: EINE Zahl, EIN
   Satz, beide Wege. Ob die Frist auch wirkt, misst `ablauf.test.mjs` Test 5.
   -------------------------------------------------------------------------- */
test('11 niedrig — die Frist am Bestellknopf gilt für beide Wege', () => {
  const tsx = quelle('src/pages/HomePage.tsx');

  const vorkommen = tsx.match(/PREIS_FRIST_MS/g) || [];
  assert.ok(
    vorkommen.length >= 3,
    'Die Frist steht nicht an einer Stelle für beide Wege — gefunden: '
    + `${vorkommen.length} Vorkommen von PREIS_FRIST_MS.`,
  );
  assert.match(
    tsx, /const PREIS_FRIST_MS = \d+;/,
    'Es gibt keine eine Zahl, die die Frist festlegt.',
  );
  assert.match(
    tsx, /setTimeout\(\(\) => \{[\s\S]{0,400}?abbruch\.abort\(\)[\s\S]{0,200}?\}, PREIS_FRIST_MS\)/,
    'Die Preisabfrage in React hat keinen Zeitablauf. Bleibt sie hängen, ist der '
    + 'Bestellknopf für immer gesperrt — die zugesagte Notbremse gibt es für '
    + 'diesen Fall dann nicht.',
  );
  assert.match(
    tsx, /const PREIS_UNBESTAETIGT_TEXT =/,
    'Der Satz für den Fall „nicht bestätigt" steht nicht an einer Stelle.',
  );

  // Und die Zahl muss auch im ausgelieferten Inline-Skript stehen.
  const home = seite(path.join('home', 'index.html'));
  const frist = /const PREIS_FRIST_MS = (\d+);/.exec(tsx)[1];
  assert.ok(
    home.includes(`},${frist});`),
    `Das vorgerenderte Inline-Skript wartet nicht ${frist} ms — die beiden `
    + 'Notbremsen laufen auseinander.',
  );
});

/* ── Der Dienst als Gegenprobe ────────────────────────────────────────────
   Ab hier lesen mehrere Tests den Dienst mit. Test 10 tat das schon; diese
   Helfer ziehen das Muster an eine Stelle, damit nicht jeder Test seinen
   eigenen Pfad erfindet.

   Fehlt der Dienst, wird die Gegenprobe ÜBERSPRUNGEN und gesagt, dass sie
   fehlte — nicht stillschweigend für bestanden erklärt. Der Teil, der die
   AUSGELIEFERTE Seite prüft, läuft immer.
   -------------------------------------------------------------------------- */
const DIENST = process.env.DIENST_QUELLE
  || path.resolve(root, '..', '..', 'Software', 'Rholabs-fullfilment');

/** Eine Datei des Dienstes, oder null wenn der Dienst hier nicht liegt. */
function dienstQuelle(rel) {
  const voll = path.join(DIENST, rel);
  if (!fs.existsSync(voll)) return null;
  return fs.readFileSync(voll, 'utf8');
}

function dienstFehlt(rel) {
  console.log(
    `      ℹ Dienst nicht gefunden (${path.join(DIENST, rel)}) — die Gegenprobe `
    + 'am Dienst lief nicht mit. Pfad über DIENST_QUELLE setzen.',
  );
}

/* ── 12 · Sol Runde 4, Befund 1 und 2 ─────────────────────────
   Ein Abschnitt, drei Unwahrheiten — und alle drei in derselben Richtung:
   Die Erklärung versprach weniger Verarbeitung und mehr Löschung, als der
   Dienst tatsächlich betreibt.

     · „genau drei Angaben" verschwieg die IP-Adresse, die der Dienst bei
       JEDEM Aufruf verarbeitet, noch bevor er die Lizenz prüft.
     · Der Abschnitt las sich wie ein einmaliger Vorgang; die Demo meldet
       sich alle fünf Minuten über denselben Endpunkt.
     · „bewahren wir für die Laufzeit der Lizenz auf und löschen sie danach"
       beschrieb einen Bereinigungslauf, den es nicht gibt — und für die
       unbefristeten Ausführungen eine Frist, die es nicht gibt.

   Geprüft wird am ausgelieferten HTML, nicht an der Quelle: Die Begründung
   im Quelltext nennt die gestrichenen Sätze zwangsläufig beim Namen.

   NACHTRAG 23.09.2026 — der zweite Löschweg. Die Gegenprobe (c) fiel mit
   „2 !== 1", und sie fiel zu Recht: Der Dienst hat einen zweiten
   `DELETE FROM activations` bekommen. Es ist KEIN Bereinigungslauf, sondern
   die Selbstbedienung „Lizenz deaktivieren" (`activationFreigeben` in
   `database.ts`, allein aufgerufen von `POST /api/public/deactivate` in
   `routes.ts`). Die Erklärung nennt jetzt beide Wege — und sagt über den
   zweiten nur, was der Dienst selbst durchsetzt:

     · nur mit vollständigem Lizenzschlüssel UND Prüfwert dieses Geräts,
     · nie für eine gesperrte Lizenz,
     · genau eine Zeile, andere Geräte bleiben,
     · „erfolgt" erst, nachdem gelöscht ist,
     · ein Vermerk bei der Bestellung — ohne Prüfwert, ohne IP,
     · die IP davor nur im Arbeitsspeicher, vor jeder Prüfung.

   Am Dienst arbeitet zur selben Zeit jemand an genau diesem Weg. Deshalb
   hält (c) JEDE dieser Einzelheiten einzeln fest: Ändert sich eine davon,
   fällt dieser Test und sagt, welcher Satz der Erklärung nicht mehr trägt.
   Eine Zusage mit Frist kommt erst zurück, wenn es einen Lauf gibt, der nach
   einer Frist löscht — dann fällt (c1) oder (c3).
   -------------------------------------------------------------------------- */
test('12 mittel — der Aktivierungsabschnitt sagt, was der Dienst wirklich tut', () => {
  const html = seite(path.join('datenschutz', 'index.html'));

  // a) Die beiden falschen Sätze sind weg.
  assert.doesNotMatch(
    html, /genau drei Angaben/,
    'Die Erklärung behauptet wieder, es seien „genau drei Angaben" — der Dienst '
    + 'verarbeitet bei jedem Aufruf zusätzlich die IP-Adresse.',
  );
  assert.doesNotMatch(
    html, /für die Laufzeit der Lizenz auf und löschen sie danach/,
    'Die Löschzusage steht wieder da. Es gibt keinen Bereinigungslauf, und für '
    + 'die gekauften Ausführungen gibt es kein Ende der Laufzeit.',
  );

  // b) Und das, was stattdessen dastehen muss.
  const aktivierung = html.slice(
    html.indexOf('Lizenzaktivierung der Anwendung'),
    html.indexOf('Zahlungsabwicklung'),
  );
  assert.ok(
    aktivierung.length > 500,
    'Der Abschnitt „Lizenzaktivierung der Anwendung" ist nicht auffindbar.',
  );
  for (const [stueck, warum] of [
    ['IP-Adresse', 'die IP-Adresse wird nicht genannt'],
    ['bevor er die Lizenz überhaupt prüft', 'dass die IP VOR der fachlichen Prüfung verarbeitet wird, fehlt'],
    ['Arbeitsspeicher', 'wo die IP liegt, steht nicht da'],
    ['lit. f', 'die Rechtsgrundlage für die Ratenbegrenzung fehlt'],
    ['alle fünf Minuten', 'dass die Demo sich regelmäßig wieder meldet, fehlt'],
    ['Geräte-Reset', 'der manuelle Löschweg wird nicht genannt'],
    ['Art. 17 DSGVO', 'wenn nichts von selbst gelöscht wird, muss der Weg zur Löschung dastehen'],
    // Der zweite Löschweg, seit dem 23.09.2026.
    ['Freigabe eines Geräteplatzes', 'der zweite Löschweg — die Selbstbedienung — fehlt'],
    ['Lizenz deaktivieren', 'der Leser erfährt nicht, wo er die Freigabe auslöst'],
    ['vollständige Lizenzschlüssel und der Prüfwert genau dieses Geräts',
      'dass für die Freigabe der volle Schlüssel übertragen und geprüft wird, fehlt'],
    ['die Lizenz nicht gesperrt ist', 'die Ausnahme für gesperrte Lizenzen fehlt'],
    ['Aktivierungsdatensatz dieses einen Geräts', 'dass genau eine Zeile gelöscht wird, fehlt'],
    ['ist der Datensatz bereits gelöscht', 'was die Erfolgsmeldung bedeutet, fehlt'],
    ['ohne den Prüfwert des Geräts und ohne deine IP-Adresse',
      'der Vermerk bei der Bestellung und sein Umfang fehlen'],
    ['auf einem von zwei Wegen', 'die Speicherdauer nennt nicht beide Löschwege'],
    ['nach einer Frist von selbst löscht, gibt es nicht',
      'dass es weiterhin keinen Bereinigungslauf gibt, steht nicht da'],
  ]) {
    assert.ok(
      aktivierung.includes(stueck),
      `Abschnitt zur Lizenzaktivierung: ${warum} (${stueck}).`,
    );
  }

  // ── c) Gegenprobe am Dienst ───────────────────────────────────────────────
  // Jede Zusicherung hier trägt einen Satz aus (b). Fällt eine, stimmt dieser
  // Satz nicht mehr — Text und Wirklichkeit bewegen sich zusammen oder gar
  // nicht.
  const datenbank = dienstQuelle(path.join('src', 'main', 'database.ts'));
  if (datenbank === null) return dienstFehlt(path.join('src', 'main', 'database.ts'));
  const routen = dienstQuelle(path.join('src', 'main', 'routes.ts'));
  if (routen === null) return dienstFehlt(path.join('src', 'main', 'routes.ts'));

  // Alle Quelldateien des Dienstes: Ein Bereinigungslauf muss nicht in
  // database.ts entstehen. Kommentare werden NICHT entfernt — erwähnt einer
  // die Anweisung, fällt der Test lieber einmal zu viel als einmal zu wenig.
  const hauptordner = path.join(DIENST, 'src', 'main');
  const dateien = fs.readdirSync(hauptordner)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => [name, fs.readFileSync(path.join(hauptordner, name), 'utf8')]);

  // c1) Genau zwei Löschanweisungen, beide in database.ts.
  const fundstellen = [];
  for (const [name, text] of dateien) {
    for (const _ of text.matchAll(/DELETE\s+FROM\s+activations/gi)) fundstellen.push(name);
  }
  assert.deepEqual(
    fundstellen, ['database.ts', 'database.ts'],
    `Der Dienst löscht Aktivierungen jetzt an ${fundstellen.length} Stellen `
    + `(${fundstellen.join(', ') || 'keine'}) statt an genau zweien — dem `
    + 'Geräte-Reset (`deleteActivation`) und der Selbstbedienung '
    + '(`activationFreigeben`). Kam ein Bereinigungslauf hinzu, darf die '
    + 'Datenschutzerklärung die Löschung wieder zusagen; fiel ein Weg weg, '
    + 'nennt sie einen Weg zu viel. Beide Stellen nachziehen.',
  );

  // c2) Die beiden Anweisungen sind die, die die Erklärung beschreibt.
  assert.match(
    datenbank,
    /export function deleteActivation\([^)]*\)[^{]*\{\s*const result = getDb\(\)\.prepare\('DELETE FROM activations WHERE key_id = \?'\)/,
    'Der Geräte-Reset löscht nicht mehr alle Aktivierungen EINER Lizenz — dann '
    + 'stimmt „wenn wir eine Lizenz auf ein anderes Gerät umbinden" nicht mehr.',
  );
  const freigabeFn = /export function activationFreigeben\([\s\S]*?\n\}/.exec(datenbank);
  assert.ok(
    freigabeFn,
    '`activationFreigeben` fehlt in database.ts. Dann gibt es den Löschweg '
    + '„Freigabe eines Geräteplatzes" nicht mehr, den die Erklärung beschreibt.',
  );
  assert.match(
    freigabeFn[0],
    /DELETE FROM activations WHERE key_id = \? AND hardware_fingerprint = \? AND is_revoked = 0/,
    'Die Selbstbedienung löscht nicht mehr genau EINE nicht gesperrte Zeile. '
    + 'Dann stimmen „dieses einen Geräts" und „nicht gesperrt" nicht mehr.',
  );

  // c3) Wer löscht? Je genau EIN Aufrufer — der Reset im Adminbereich, die
  //     Freigabe im öffentlichen Endpunkt. Ein zweiter Aufrufer (ein Zeitgeber,
  //     ein Aufräumlauf beim Start) wäre ein dritter Löschweg.
  const aufrufer = (fn) => dateien
    .filter(([name]) => name !== 'database.ts')
    .flatMap(([name, text]) => [...text.matchAll(new RegExp(`\\b${fn}\\(`, 'g'))].map(() => name));
  assert.deepEqual(
    aufrufer('deleteActivation'), ['routes.ts'],
    '`deleteActivation` wird nicht mehr genau einmal aufgerufen. Der Geräte-Reset '
    + 'ist dann nicht mehr der einzige Weg dorthin.',
  );
  assert.deepEqual(
    aufrufer('activationFreigeben'), ['routes.ts'],
    '`activationFreigeben` wird nicht mehr genau einmal aufgerufen. Die '
    + 'Selbstbedienung ist dann nicht mehr der einzige Weg dorthin.',
  );
  const oeffentlich = routen.indexOf('export function createPublicRouter');
  assert.ok(
    oeffentlich > 0 && routen.indexOf('deleteActivation(') < oeffentlich,
    'Der Geräte-Reset steht nicht mehr im Adminbereich. „wenn WIR eine Lizenz '
    + 'umbinden" setzt voraus, dass nur wir ihn auslösen.',
  );

  // c4) Der öffentliche Endpunkt selbst.
  const anfang = routen.indexOf("router.post('/deactivate'");
  assert.ok(
    anfang > oeffentlich,
    'Der Endpunkt POST /deactivate steht nicht mehr im öffentlichen Router.',
  );
  const ende = routen.indexOf('return router;', anfang);
  const handler = ohneKommentare(routen.slice(anfang, ende > anfang ? ende : undefined));

  assert.ok(
    handler.includes('activationFreigeben(keyId, hardware_fingerprint)'),
    'Die Freigabe wird nicht mehr im Endpunkt selbst ausgeführt — etwa erst '
    + 'später in einer Warteschlange. Dann stimmt „Meldet er die Freigabe als '
    + 'erfolgt, ist der Datensatz bereits gelöscht" nicht mehr.',
  );
  const erfolg = [...handler.matchAll(/deactivated: true/g)].map((m) => m.index);
  assert.ok(
    erfolg.length === 1
      && erfolg[0] > handler.indexOf('activationFreigeben(keyId, hardware_fingerprint)'),
    'Der Endpunkt meldet „deactivated: true" nicht mehr genau einmal und erst '
    + 'NACH dem Löschen.',
  );
  assert.match(
    handler, /order\.license_key !== license_key/,
    'Der Endpunkt vergleicht den vollständigen Lizenzschlüssel nicht mehr mit '
    + 'der Bestellung. Dann stimmt „nur, wenn ihm der vollständige '
    + 'Lizenzschlüssel … vorliegt" nicht mehr.',
  );
  assert.ok(
    handler.indexOf('checkRateLimit(ip)') > -1
      && handler.indexOf('checkRateLimit(ip)') < handler.indexOf('req.body'),
    'Die Ratenbegrenzung läuft nicht mehr vor dem Auslesen der Anfrage. Dann '
    + 'stimmt „bevor er die Lizenz überhaupt prüft" für die Freigabe nicht mehr.',
  );
  // Die IP darf nur in die Ratenbegrenzung gehen, nirgends sonst hin.
  const ohneErlaubteIp = handler
    .replace(/const ip = req\.ip \|\| req\.socket\.remoteAddress \|\| 'unknown';/, '')
    .replace(/checkRateLimit\(ip\)|recordFailure\(ip\)/g, '');
  assert.doesNotMatch(
    ohneErlaubteIp, /\bip\b/,
    'Der Endpunkt verwendet die IP-Adresse jetzt außerhalb der Ratenbegrenzung. '
    + 'Dann stimmt „in unsere Datenbank gelangen sie nicht" nicht mehr.',
  );
  const vermerk = /addAuditEntry\([^,]+,\s*'aktivierung_freigegeben',\s*JSON\.stringify\(\{([\s\S]*?)\}\)\)/
    .exec(handler);
  assert.ok(
    vermerk,
    'Der Vermerk `aktivierung_freigegeben` bei der Bestellung fehlt oder hat '
    + 'eine andere Form. Die Erklärung beschreibt ihn.',
  );
  assert.doesNotMatch(
    vermerk[1], /fingerprint|\bip\b/i,
    'Der Vermerk über die Freigabe enthält jetzt den Prüfwert oder die IP. '
    + 'Dann stimmt „ohne den Prüfwert des Geräts und ohne deine IP-Adresse" '
    + 'nicht mehr.',
  );

  // c5) Und den Vermerk löscht niemand.
  const vermerkGeloescht = dateien.filter(([, text]) => /DELETE\s+FROM\s+audit_log/i.test(text));
  assert.deepEqual(
    vermerkGeloescht.map(([name]) => name), [],
    'Der Dienst löscht jetzt Einträge aus `audit_log`. Dann stimmt „auch ihn '
    + 'löschen wir nicht von selbst" nicht mehr — beide Stellen nachziehen.',
  );
});

/* ── 13 · eigener Durchgang, nicht gemeldet ───────────────────
   Beim vollständigen Abgleich dieser Erklärung gegen den Dienst fiel derselbe
   Fehler ein zweites Mal auf, im Abschnitt „Demo-Anfrage":

     · Der Name fehlte in der Aufzählung, obwohl das Formular ihn erhebt und
       der Dienst ihn bei jeder Anfrage mitschreibt.
     · „ein Jahr" und „nach 24 Stunden … gelöscht" beschrieben zwei
       Löschungen, die beide nicht stattfinden.
   -------------------------------------------------------------------------- */
test('13 mittel — der Demo-Abschnitt nennt den Namen und verspricht keine Löschung', () => {
  const html = seite(path.join('datenschutz', 'index.html'));
  const demo = html.slice(
    html.indexOf('Demo-Anfrage'),
    html.indexOf('Neuigkeiten per E-Mail'),
  );
  assert.ok(demo.length > 500, 'Der Abschnitt „Demo-Anfrage" ist nicht auffindbar.');

  assert.doesNotMatch(
    demo, /nach 24 Stunden gegenstandslos und gelöscht/,
    'Die Erklärung verspricht wieder eine Löschung unbestätigter Anfragen. '
    + '`DELETE FROM demo_requests` gibt es im Dienst nicht.',
  );
  assert.doesNotMatch(
    demo, /Bestätigte Anfragen bewahren wir ein Jahr auf/,
    'Die Erklärung nennt wieder ein Jahr als Speicherdauer. Das Jahr ist die '
    + 'Grenze der Wiederholungsprüfung, keine Speicherdauer — gelöscht wird nie.',
  );

  assert.ok(
    /verarbeiten wir deine E-Mail-Adresse, deinen Namen/.test(demo),
    'Der Name fehlt in der Aufzählung der Demo-Anfrage. Das Formular erhebt ihn, '
    + 'und der Dienst schreibt ihn unabhängig vom Newsletter-Häkchen mit.',
  );
  assert.ok(
    demo.includes('bleibt jedoch stehen'),
    'Der Text verschweigt, dass die unbestätigte Anfrage gespeichert bleibt.',
  );
  assert.ok(
    demo.includes('Art. 17 DSGVO'),
    'Wenn nichts von selbst gelöscht wird, muss der Weg zur Löschung dastehen.',
  );

  // ── Gegenprobe am Dienst ──────────────────────────────────────────────────
  const demoQuelle = dienstQuelle(path.join('src', 'main', 'demo.ts'));
  if (demoQuelle === null) return dienstFehlt(path.join('src', 'main', 'demo.ts'));

  assert.doesNotMatch(
    demoQuelle, /DELETE\s+FROM\s+demo_requests/i,
    'Der Dienst löscht Demo-Anfragen jetzt. Das ist gut — und die '
    + 'Datenschutzerklärung darf die Speicherdauer wieder zusagen. Beide '
    + 'Stellen nachziehen.',
  );
  assert.match(
    demoQuelle, /INSERT INTO demo_requests \(email, token_hash, ip, newsletter, name\)/,
    'Der Dienst schreibt die Demo-Anfrage nicht mehr mit diesen Feldern — die '
    + 'Aufzählung in der Datenschutzerklärung ist nachzuprüfen.',
  );
});

/* ── 14 · Sol Runde 4, Befund 3 — OFFEN, die Änderung liegt im Dienst ──────
   Die Demo-Schlüssel-Mail verweist auf `https://rholabs.de/#preise`. Diesen
   Anker gibt es auf der Startseite nicht; die Startseite führt überhaupt
   keine Preise. Der Preisbereich heißt `lizenzen` und steht auf
   /kognitives-training, der Kauf für Privatkunden auf /home.

   Eine Sprungmarke erreicht den Server nie — sie ist reine Browsersache.
   Auf einer statischen Seite bei GitHub Pages lässt sich daran von hier aus
   also nichts umbiegen. Die Website könnte nur einen Anker `preise` erfinden;
   das wäre ein Name, den sie selbst nirgends führt, auf einer Seite ohne
   Preise — und die Pflichtangabe Preis stünde dann an zwei Orten, die
   auseinanderlaufen können.

   Deshalb bleibt dieser Test ROT, bis der Dienst nachzieht. Er ist die
   Erinnerung daran, dass eine Zeile offen ist, und er nennt sie.

   Was im Dienst zu ändern ist — `src/main/mailer.ts:1393-1396`:
     aus  <a href="https://rholabs.de/#preise" …>rholabs.de</a>
     wird <a href="https://rholabs.de/kognitives-training#lizenzen" …>rholabs.de</a>
   Dort stehen alle drei gewerblichen Lizenzen UND der Querverweis auf die
   Home-Version — also genau das, was die Mail „unsere Lizenzoptionen" nennt.
   Der Dienst baut jede andere Adresse auf rholabs.de schon so, mit vollem
   Pfad (`kauf.ts:64-82`, `partner.ts:155`, `rechtstexte.ts:52`); `/#preise`
   ist die einzige Ausnahme.
   -------------------------------------------------------------------------- */
test('14 niedrig — der Weg aus der Demo-Mail trifft einen Anker, den es gibt', () => {
  // a) Die Website hält ihre Seite der Abmachung: Der Anker existiert im
  //    AUSGELIEFERTEN HTML, nicht nur in der Quelle.
  const produkt = seite(path.join('kognitives-training', 'index.html'));
  assert.match(
    produkt, /id="lizenzen"/,
    'Der Preisbereich trägt den Anker `lizenzen` nicht mehr. Die Demo-Mail soll '
    + 'dorthin zeigen — wer ihn umbenennt, lässt die Mail ins Leere laufen.',
  );
  const start = seite('index.html');
  assert.doesNotMatch(
    start, /id="preise"/,
    'Auf der Startseite ist ein Anker `preise` entstanden. Die Startseite führt '
    + 'keine Preise; ein Anker dorthin wäre ein zweiter Ort für eine '
    + 'Pflichtangabe, der vom ersten abweichen kann.',
  );

  // b) Und der Dienst? Solange die Mail auf `/#preise` zeigt, führt der
  //    zentrale Anschlussweg nach der Demo ins Leere.
  const mailer = dienstQuelle(path.join('src', 'main', 'mailer.ts'));
  if (mailer === null) return dienstFehlt(path.join('src', 'main', 'mailer.ts'));

  const toteAnker = mailer.match(/https:\/\/rholabs\.de\/#[a-zA-Z0-9-]+/g) || [];
  assert.deepEqual(
    toteAnker, [],
    `Die Demo-Mail verweist auf ${toteAnker.join(', ')} — diesen Anker gibt es `
    + 'auf der Startseite nicht, und die Startseite führt keine Preise. '
    + 'Zu ändern in src/main/mailer.ts:1393-1396: '
    + 'https://rholabs.de/#preise → https://rholabs.de/kognitives-training#lizenzen. '
    + 'Dort stehen die drei gewerblichen Lizenzen und der Verweis auf die '
    + 'Home-Version. Dieser Test wird grün, sobald der Dienst nachgezogen ist.',
  );
});

/* ── 15 · Sol Runde 4, Befund 2 (nachgereicht) ────────────────
   Die Demo-Dankesseite behauptete „Wir haben dir eine E-Mail geschickt" —
   uneingeschränkt, für jeden, der dort ankam. Der Dienst leitet aber aus
   SIEBEN Ausgängen auf genau diese Seite weiter, und nur einer davon hat eine
   Mail abgeschickt: Honigtopf, unzulässige Adresse, Ratenbegrenzung, bereits
   vorhandene Demo, bereits offene Bestätigung, Erfolg, Ausnahme (darunter der
   SMTP-Fehler). Die Liste mit Zeilennummern steht im Kopf der Seite.

   Dieser Test hält zwei Dinge zusammen, die in entgegengesetzte Richtungen
   ziehen — und genau deshalb gehören sie in EINEN Test:

     a) Der Erfolgssatz ist weg. Geprüft am AUSGELIEFERTEN HTML und im Bündel:
        Steht er im Bündel nicht, kann kein Zweig ihn nach dem Einhängen
        nachreichen.
     b) Die Antwort bleibt für alle dieselbe. Dass die sieben Ausgänge nicht
        unterscheidbar sind, ist kein Versehen des Dienstes, sondern seine
        Schutzmaßnahme (`demo.ts`, Kopf, Punkt 5): Unterschiede verrieten über
        ein offenes Formular, ob zu einer fremden Adresse schon eine Demo
        existiert. Eine Lösung, die (a) durch Anzeigen des Ausgangs erreichte,
        wäre schlimmer als der Befund. Also prüft (b) beide Seiten — keine
        Verzweigung auf der Seite, und beim Dienst weiterhin genau EINE
        Antwort für alle sieben Wege.

   Fällt (b) am Dienst, ist das kein Fehler des Dienstes, sondern eine Frage:
   Wer die Ausgänge auseinanderzieht, muss wissen, was er damit preisgibt.
   -------------------------------------------------------------------------- */
test('15 mittel — die Demo-Dankesseite behauptet keinen Versand, und alle Ausgänge bleiben gleich', () => {
  const html = seite(path.join('demo', 'danke', 'index.html'));

  // ── a) Der Erfolgssatz ────────────────────────────────────────────────────
  assert.doesNotMatch(
    html, /Wir haben dir eine E-Mail geschickt/,
    'Die vorgerenderte Seite behauptet den Versand — sie kennt den Ausgang aber '
    + 'nicht. Sechs der sieben Wege auf diese Seite haben keine Mail abgeschickt.',
  );
  assert.doesNotMatch(
    html, /Fast geschafft/,
    'Die Überschrift verspricht wieder einen gelungenen Vorgang. Auch sie gilt '
    + 'für alle sieben Ausgänge, nicht nur für den einen.',
  );

  // Und das, was stattdessen dastehen muss — im Kasten der Seite, nicht
  // irgendwo im Seitengerüst: Die Fußzeile führt dieselbe Adresse, das zählt
  // hier nicht.
  const karte = html.slice(
    html.indexOf('<div class="status-page">'),
    html.indexOf('</main>'),
  );
  assert.ok(karte.length > 200, 'Der Kasten der Seite ist nicht auffindbar.');
  assert.match(html, /noindex/, 'Die Seite hat ihr noindex verloren.');
  for (const [stueck, warum] of [
    ['Bestätigungslink', 'der zweite Schritt fehlt — ohne den Klick entsteht kein Schlüssel'],
    ['24 Stunden', 'die Gültigkeit des Links fehlt'],
    ['Spam-Ordner', 'der erste Blick bei ausbleibender Mail fehlt'],
    ['fordere die Demo noch einmal an', 'der nächste Schritt fehlt'],
    ['kontakt.rholabs@gmail.com', 'der Weg zu einem Menschen fehlt, wenn auch das nichts bringt'],
  ]) {
    assert.ok(karte.includes(stueck), `Demo-Dankesseite: ${warum} (${stueck}).`);
  }

  const buendel = fs.readdirSync(path.join(root, 'docs', 'assets'))
    .filter((name) => name.endsWith('.js'))
    .map((name) => fs.readFileSync(path.join(root, 'docs', 'assets', name), 'utf8'));
  assert.ok(buendel.length > 0, 'Kein JavaScript im Erzeugnis — erst `npm run build`.');
  for (const text of buendel) {
    assert.doesNotMatch(
      text, /Wir haben dir eine E-Mail geschickt/,
      'Der Erfolgssatz steht im ausgelieferten Bündel. Dann gibt es einen Zweig, '
      + 'der ihn anzeigt — und einen Weg, diesen Zweig auszulösen.',
    );
  }

  // ── b) Eine Antwort für alle, erste Hälfte: die Seite ─────────────────────
  const tsx = ohneKommentare(quelle('src/pages/demo/DemoThanks.tsx'));
  assert.doesNotMatch(
    tsx, /useSearchParams|document\.referrer|useState|useEffect|fetch\(/,
    'Die Seite macht ihre Aussage davon abhängig, woher der Besucher kommt oder '
    + 'was sie nachlädt. Jeder solche Zweig zeigte den Ausgang an — und damit, '
    + 'ob zu einer eingegebenen Adresse schon eine Demo besteht.',
  );

  // ── b) Zweite Hälfte: der Dienst ──────────────────────────────────────────
  const demo = dienstQuelle(path.join('src', 'main', 'demo.ts'));
  if (demo === null) return dienstFehlt(path.join('src', 'main', 'demo.ts'));

  assert.match(
    demo, /const ZIEL_ANGEFRAGT = `\$\{WEBSITE\}\/demo\/danke\/`;/,
    'Der Dienst leitet nicht mehr auf /demo/danke/ weiter — dann prüft dieser '
    + 'Test die falsche Seite.',
  );

  const anfang = demo.indexOf("router.post('/demo/anfordern'");
  const ende = demo.indexOf("router.get('/demo/bestaetigen'");
  assert.ok(anfang > 0 && ende > anfang, 'Der Endpunkt /demo/anfordern ist nicht auffindbar.');
  const anfordern = demo.slice(anfang, ende);

  assert.match(
    anfordern, /const antworten = \(\) => res\.redirect\(303, ZIEL_ANGEFRAGT\);/,
    'Der gemeinsame Abschluss `antworten()` ist weg. Er ist es, der alle Ausgänge '
    + 'ununterscheidbar macht.',
  );
  const antwortstellen = anfordern.match(/res\.redirect\(/g) || [];
  assert.equal(
    antwortstellen.length, 1,
    `Der Endpunkt /demo/anfordern antwortet jetzt an ${antwortstellen.length} `
    + 'Stellen statt nur über `antworten()`. Zieht der Dienst die Ausgänge '
    + 'auseinander, verrät die Antwort, ob zu einer fremden Adresse schon eine '
    + 'Demo besteht (demo.ts, Kopf, Punkt 5) — und der Text dieser Seite ist '
    + 'nachzuziehen, weil er dann nicht mehr für alle Wege gilt.',
  );
});

/* ── 16 · Sol Runde 5, hoch ───────────────────────────────────
   Der Professional-Direktverkauf.

   Die Einzel- und die Team-Karte auf /kognitives-training trugen neben der
   Bestellmail einen zweiten Knopf: „Sofort per PayPal kaufen", mit einem
   direkten Link auf paypal.com/ncp/payment/…. Damit stand ein
   vollautomatischer Kaufweg auf einer öffentlich erreichbaren Seite — und
   zwar neben zwei abgenommenen Texten, die sich ausdrücklich NUR für die
   Home-Lizenz zuständig erklären (`Agb.tsx`, Geltungsbereich;
   `Lizenzbedingungen.tsx`, erster Absatz) und sich dabei an Verbraucher
   nach § 13 BGB richten.

   Wer dort klickte, schloss also einen Vertrag ohne Bedingungen, ohne
   Belehrung und ohne die Pflichtangaben, die § 312j Abs. 2 BGB unmittelbar
   vor dem Bestellknopf verlangt. Nachrüsten ließ sich das nicht: Der
   Bestellknopf steht auf der Seite von PayPal.

   Dieser Test hält die beiden Hälften zusammen, die zusammengehören:

     a) Es gibt keinen automatisierten Kaufweg mehr — geprüft an der Quelle
        (sonst genügt eine Zeile, um ihn zurückzuholen) UND am ausgelieferten
        HTML (sonst gilt die Aussage nicht für den Besucher).
     b) Die abgenommenen Texte gelten weiterhin nur für Home. Ändert sich
        DAS — bekommen Einzel und Team eigene, abgenommene Bedingungen —,
        fällt dieser Test und fragt, ob (a) noch die richtige Antwort ist.

   Wer den automatischen Weg zurückwill, braucht dafür, was /home hat: einen
   eigenen Bestellvorgang auf unserer Seite, Pflichtblock, Schaltflächen-
   lösung, Einwilligungsprotokoll und abgenommene Texte für die gewerblichen
   Stufen. Das ist kein Link, das ist eine Kaufstrecke.
   -------------------------------------------------------------------------- */
test('16 hoch — kein automatisierter Kaufweg neben den abgenommenen Texten', () => {
  // ── a) Die Quelle ─────────────────────────────────────────────────────────
  // Gesucht wird der KAUFLINK, nicht jede Erwähnung von PayPal: Der Abschnitt
  // „Zahlungsabwicklung" der Datenschutzerklärung verweist zu Recht auf die
  // Datenschutzbestimmungen von PayPal, und /home nennt PayPal als einziges
  // Zahlungsmittel. Beides soll bleiben. Falsch ist allein ein Knopf, der
  // unmittelbar in eine Zahlung führt — und der trägt `ncp/payment`.
  const constants = ohneKommentare(quelle('src/constants.ts'));
  assert.doesNotMatch(
    constants, /paypal\.com\/ncp\//i,
    'In `constants.ts` steht wieder ein direkter PayPal-Kauflink. Ein solcher '
    + 'Knopf führt den Käufer an /home und an allem vorbei, was § 312j BGB vor '
    + 'dem Bestellknopf verlangt — die Begründung steht über `PLANS`.',
  );
  assert.doesNotMatch(
    constants, /paypalLink/,
    'In `constants.ts` steht wieder ein Feld `paypalLink`.',
  );

  const typen = ohneKommentare(quelle('src/types.ts'));
  assert.doesNotMatch(
    typen, /paypalLink/,
    'Das Feld `paypalLink` ist zurück in `PricingTier`. Es wurde entfernt und '
    + 'nicht nur leer gelassen, damit der Weg sich nicht mit einer Zeile wieder '
    + 'öffnen lässt.',
  );

  const produktQuelle = ohneKommentare(quelle('src/pages/ProductPage.tsx'));
  assert.doesNotMatch(
    produktQuelle, /Sofort per PayPal kaufen|paypalLink/,
    'Die Produktseite rendert wieder einen Sofortkauf-Knopf.',
  );

  // ── a) Und das Erzeugnis ──────────────────────────────────────────────────
  const produkt = seite(path.join('kognitives-training', 'index.html'));
  assert.doesNotMatch(
    produkt, /paypal\.com/i,
    'Auf der ausgelieferten Seite /kognitives-training steht wieder ein Link '
    + 'nach paypal.com. Genau dieser Weg war der Befund.',
  );

  // Der Weg, der bleiben soll, muss auch dastehen — sonst ist die Seite nur
  // leer statt richtig.
  assert.match(
    produkt, /mailto:/,
    'Auf /kognitives-training gibt es keinen Bestellweg mehr. Die Bestellmail '
    + 'ist der Weg, der bleiben sollte.',
  );

  // ── b) Die abgenommenen Texte, unverändert ────────────────────────────────
  const agb = seite(path.join('agb', 'index.html'));
  assert.match(
    agb, /gelten für Verträge über die Home-Lizenz/,
    'Die AGB erklären sich nicht mehr nur für die Home-Lizenz zuständig. Ist das '
    + 'eine neue Abnahme, die auch Einzel und Team trägt, darf der automatisierte '
    + 'Kaufweg wieder geprüft werden — beide Stellen nachziehen.',
  );
  const lizenz = seite(path.join('lizenzbedingungen', 'index.html'));
  assert.match(
    lizenz, /gelten für die Nutzung der Home-Lizenz/,
    'Die Lizenzbedingungen gelten nicht mehr nur für die Home-Lizenz. Dann ist '
    + 'zu prüfen, was für die gewerblichen Stufen jetzt gilt.',
  );
});

/* ── 17 · Sol Runde 5, hoch ───────────────────────────────────
   Die fehlende x64-Angabe.

   Die Seite nannte an allen Stellen „Windows 10/11" und verschwieg die
   Architektur. Der Client wird ausschließlich für x64 gebaut
   (`package.json`, `build.win.target` → `arch: ['x64']`, abgesichert durch
   `scripts/check-release.cjs`; README, erste Zeile). Ein Käufer mit Windows
   11 auf ARM64 erfüllte also die veröffentlichte Bedingung vollständig und
   konnte den Installer trotzdem nicht benutzen.

   Geprüft werden die drei Stellen, an denen es gesetzlich darauf ankommt,
   und alle am AUSGELIEFERTEN HTML:

     · der Pflichtblock unmittelbar vor dem Bestellknopf (§ 312j Abs. 2 BGB,
       Art. 246a § 1 Abs. 1 Nr. 1 EGBGB),
     · die Lieferbeschränkung am Beginn des Bestellvorgangs
       (§ 312j Abs. 1 BGB),
     · der Kasten „Systemvoraussetzung", der dasselbe für den Leser sagt.

   Der erste Punkt von SYSTEM_REQUIREMENTS bleibt dabei wörtlich, wie er ist:
   Er gibt den Wortlaut der abgenommenen Texte wieder (Test 7 hält ihn). Die
   Architektur steht daneben, nicht darin.
   -------------------------------------------------------------------------- */
test('17 hoch — die Beschränkung auf x64 steht dort, wo gekauft wird', () => {
  const constants = quelle('src/constants.ts');
  assert.match(
    constants,
    /export const SYSTEM_REQUIREMENTS: string\[\] = \[\s*'Windows 10 oder Windows 11',\s*'64-Bit \(x64\)/,
    'Der Pflichtblock nennt die Architektur nicht — oder nicht als eigenen Punkt '
    + 'direkt hinter der Windows-Zusage. Beides ist nötig: der Wortlaut der '
    + 'abgenommenen Texte bleibt unangetastet (Test 7), die Architektur kommt '
    + 'daneben.',
  );

  const home = seite(path.join('home', 'index.html'));

  // Der Pflichtblock.
  assert.match(
    home, /64-Bit \(x64\)/,
    'Auf /home steht die Architektur nicht im ausgelieferten HTML.',
  );
  // Die Lieferbeschränkung am Beginn des Bestellvorgangs.
  const rahmen = home.slice(home.indexOf('Lieferbeschränkung'), home.indexOf('Zahlungsmittel'));
  assert.ok(rahmen.length > 40, 'Der Bestellrahmen ist nicht auffindbar.');
  assert.match(
    rahmen, /64-Bit|x64/,
    'Die Lieferbeschränkung nennt nur das Betriebssystem. Für ein ARM64-Gerät '
    + 'gibt es die Software gar nicht — das gehört nach § 312j Abs. 1 BGB an den '
    + 'Beginn des Bestellvorgangs, nicht erst in die Eigenschaften.',
  );
  // Und ARM64 beim Namen genannt, dort wo der Leser es sucht.
  assert.match(
    home, /ARM64/,
    'Die Seite warnt nicht ausdrücklich vor ARM64. „64-Bit" allein liest ein '
    + 'Besitzer eines Copilot+-Geräts als erfüllt.',
  );

  // Die Produktseite trägt denselben Block aus derselben Konstante.
  const produkt = seite(path.join('kognitives-training', 'index.html'));
  assert.match(
    produkt, /64-Bit \(x64\)/,
    'Auf /kognitives-training fehlt die Architektur in den Systemanforderungen.',
  );
});

/* ── 18 · Sol Runde 5, mittel ─────────────────────────────────
   „Empfänger: keine" im Newsletter-Abschnitt.

   Gemeint war „kein Versanddienstleister"; dastand aber, dass es überhaupt
   keinen Empfänger gibt. Die Nachrichten gehen über `smtp.gmail.com`
   (`mailer.ts`, getTransporter) aus einem Gmail-Postfach hinaus
   (`newsletter.ts`, Kopf) — Adresse und Inhalt verarbeitet dabei der
   E-Mail-Anbieter. Art. 13 Abs. 1 lit. e DSGVO verlangt Empfänger oder
   Empfängerkategorie; jeder andere Abschnitt dieser Erklärung nennt sie
   richtig („unser E-Mail-Anbieter").

   Gegenprobe am Dienst: Solange dort über Gmail versandt wird, muss die
   Kategorie hier stehen. Verschwindet der SMTP-Versand, fällt dieser Test
   und fragt nach, was stattdessen gilt.
   -------------------------------------------------------------------------- */
test('18 mittel — der Newsletter-Abschnitt nennt seinen Empfänger', () => {
  const html = seite(path.join('datenschutz', 'index.html'));
  const anfang = html.indexOf('Neuigkeiten per E-Mail');
  const ende = html.indexOf('Auslieferung dieser Website');
  assert.ok(
    anfang > 0 && ende > anfang,
    'Der Abschnitt „Neuigkeiten per E-Mail" ist nicht auffindbar.',
  );
  const abschnitt = html.slice(anfang, ende);

  assert.doesNotMatch(
    abschnitt, /Empfänger: keine/,
    'Der Newsletter-Abschnitt verneint wieder jeden Empfänger. Die Nachrichten '
    + 'laufen über den E-Mail-Anbieter — auch wenn sie von Hand geschrieben werden.',
  );
  assert.match(
    abschnitt, /Empfänger: unser E-Mail-Anbieter/,
    'Der Newsletter-Abschnitt nennt keine Empfängerkategorie (Art. 13 Abs. 1 '
    + 'lit. e DSGVO).',
  );
  // Die Verneinung, die stimmt, soll nicht mit verschwinden.
  assert.match(
    abschnitt, /Versanddienstleister ist nicht eingeschaltet/,
    'Dass kein Newsletter-Versanddienstleister eingeschaltet ist, stimmt und '
    + 'gehört weiterhin dazu.',
  );

  // ── Gegenprobe am Dienst ──────────────────────────────────────────────────
  const mailer = dienstQuelle(path.join('src', 'main', 'mailer.ts'));
  if (mailer === null) return dienstFehlt(path.join('src', 'main', 'mailer.ts'));
  assert.match(
    mailer, /host: 'smtp\.gmail\.com'/,
    'Der Dienst versendet nicht mehr über smtp.gmail.com. Dann ist zu prüfen, '
    + 'welcher Anbieter jetzt Empfänger ist — und der Abschnitt nachzuziehen.',
  );
});

/* ── 19 · Sol Runde 5, mittel — GESCHLOSSEN am Dienst (Stand 23.09.2026) ───
   Zwei Sätze in zwei Demo-Mails, die dem widersprachen, was der Client tut
   und was die Datenschutzerklärung seit dem 22.09.2026 sagt. Beide stehen
   in `Rholabs-fullfilment/src/main/mailer.ts`, beide waren einzeilig, und
   beide sind von hier aus nicht erreichbar.

   Gedacht war der Test als ROTER Merker nach dem Muster von Test 14. Am
   23.09.2026 war er grün: Der Dienst hat beide Sätze nachgezogen
   (`sendDemoEmail`: „bis zu 72 Stunden", „14 Tage nach Ausstellung";
   `sendDemoConfirmationEmail`: „bleibt gespeichert, bis du ihre Löschung
   verlangst"). Ab da ist er ein Wächter, und dafür war er zu nachgiebig:
   (a) prüfte nur, WENN „Die Testphase endet" noch dastand — eine
   Umformulierung, die diesen Satz wegnahm, hätte den Test stillschweigend
   bestehen lassen, auch mit „vollständig offline" daneben; und (b) hing
   daran, dass der Kommentar im Dienst den alten Satz über einen
   Zeilenumbruch verteilt. Jetzt prüft der Test die beiden Mailfunktionen
   als Ganzes, ohne Kommentare, und verlangt auch das, was dastehen MUSS.
   Die folgenden Absätze sind der Befund, wie er gemeldet wurde.

   (a) Die DEMO-SCHLÜSSEL-Mail, `mailer.ts`, Anleitungsblock der Demo-Mail:
         ist:  „Nach der einmaligen Aktivierung funktioniert die Software
                vollständig offline. Die Testphase endet automatisch nach
                14 Tagen."
         soll: „Die Testphase endet 14 Tage nach Ausstellung des Schlüssels.
                Die Demo prüft ihre Restlaufzeit bei uns nach; eine
                erfolgreiche Prüfung gibt jeweils bis zu 72 Stunden
                Offline-Nutzung frei. Länger ohne Internetverbindung bleibt
                sie gesperrt, bis das Gerät wieder online war."
       Beleg: `Gedaechtniss-Training/demo-clock.cjs:2` — OFFLINE_MS =
       72 * 60 * 60 * 1000; README des Clients, Abschnitt „Demo".

       WICHTIG: Die übrigen Fundstellen von „vollständig offline" in
       `mailer.ts` gehören zu den KAUF-Mails und zu ThinFilm. Dort ist der
       Satz richtig — die gekauften Ausführungen melden sich nicht von
       selbst wieder. Nur die Demo-Mail ist zu ändern.

   (b) Die erste Demo-Mail (Bestätigungsmail), `mailer.ts`:
         ist:  „Ohne Bestätigung passiert nichts, und wir speichern die
                Anfrage nicht dauerhaft."
         soll: „Ohne Bestätigung erzeugen und versenden wir keinen Schlüssel."
       Beleg: `DELETE FROM demo_requests` gibt es im ganzen Dienst nicht —
       der einzige DELETE steht auf `activations` (`database.ts`). Die Zeile
       mit Adresse, Name und IP bleibt stehen; die Datenschutzerklärung sagt
       das inzwischen ausdrücklich (Abschnitt „Demo-Anfrage", Speicherdauer).

       Alternative zu (b): den Bereinigungslauf bauen, dann stimmt der Satz.
       Was er können müsste, steht im Bericht zu dieser Runde und im Nachtrag
       über dem Abschnitt „Demo-Anfrage" in `constants.ts` — für
       `demo_requests` wäre er verlustfrei. Dann gehört die Zusage in beide
       Texte zurück, und Test 13 holt sie.

   Die Website hat ihre Seite erfüllt: /kontakt sagt jetzt vor dem Absenden,
   dass die Demo zwischendurch Internet braucht. Das wird hier mitgeprüft —
   sonst stünde der Befund nur noch beim Dienst und nirgends bei uns.
   -------------------------------------------------------------------------- */
test('19 mittel — die Demo-Mails sagen dasselbe wie Client und Datenschutzerklärung', () => {
  // a) Unsere Seite der Abmachung: der Hinweis steht im ausgelieferten HTML.
  const kontakt = seite(path.join('kontakt', 'index.html'));
  assert.match(
    kontakt, /72 Stunden/,
    'Auf /kontakt steht nicht mehr, dass die Demo zwischendurch Internet braucht. '
    + 'Wer das nicht liest, nimmt sie mit auf eine Woche ohne Netz.',
  );

  // b) Und der Dienst?
  const mailer = dienstQuelle(path.join('src', 'main', 'mailer.ts'));
  if (mailer === null) return dienstFehlt(path.join('src', 'main', 'mailer.ts'));

  /** Der Rumpf EINER Mailfunktion, ohne JS- und HTML-Kommentare: Was dort
      noch steht, geht an den Empfänger. Fehlt die Funktion, ist das ein
      Fehler und kein stilles Bestehen. */
  const mailfunktion = (name) => {
    const anfang = mailer.indexOf(`export async function ${name}(`);
    assert.ok(
      anfang >= 0,
      `\`${name}\` ist in mailer.ts nicht mehr auffindbar. Dieser Test prüft `
      + 'dann nichts mehr — nachsehen, wie die Mail jetzt heißt.',
    );
    const ende = mailer.indexOf('\nexport ', anfang + 1);
    return ohneKommentare(
      mailer.slice(anfang, ende > anfang ? ende : undefined).replace(/<!--[\s\S]*?-->/g, ' '),
    );
  };

  // (a) Die Demo-Schlüssel-Mail — die ganze Funktion, nicht ein Umfeld.
  const demoMail = mailfunktion('sendDemoEmail');
  assert.doesNotMatch(
    demoMail, /vollständig offline/,
    'Die Demo-Schlüssel-Mail verspricht wieder „vollständig offline". '
    + 'Tatsächlich gibt eine Online-Prüfung jeweils nur bis zu 72 Stunden frei '
    + '(demo-clock.cjs:2, OFFLINE_MS) — der Empfänger wird mitten in den '
    + 'zugesagten 14 Tagen gesperrt. Die KAUF-Mails behalten den Satz: dort '
    + 'stimmt er.',
  );
  assert.match(
    demoMail, /72 Stunden/,
    'Die Demo-Schlüssel-Mail nennt die 72 Stunden nicht. Ohne sie weiß der '
    + 'Empfänger nicht, dass die Demo zwischendurch Internet braucht — /kontakt '
    + 'sagt es, die Mail muss es auch sagen.',
  );

  // (b) Die Bestätigungsmail — ebenso die ganze Funktion.
  const bestaetigung = mailfunktion('sendDemoConfirmationEmail');
  assert.doesNotMatch(
    bestaetigung, /nicht dauerhaft/,
    'Die erste Demo-Mail sagt wieder, die Anfrage werde nicht dauerhaft '
    + 'gespeichert. `DELETE FROM demo_requests` gibt es im Dienst nicht; die '
    + 'Zeile mit Adresse, Name und IP bleibt stehen, und die '
    + 'Datenschutzerklärung sagt das. Entweder beim Satz bleiben, dass sie '
    + 'gespeichert bleibt, oder den Bereinigungslauf bauen — dann holt '
    + 'Test 13 die Zusage in beide Texte zurück.',
  );
  assert.match(
    bestaetigung, /bleibt gespeichert/,
    'Die erste Demo-Mail sagt nicht mehr, dass die Anfrage gespeichert bleibt. '
    + 'Die Datenschutzerklärung sagt es („bleibt jedoch stehen"); die Mail, die '
    + 'der Empfänger tatsächlich liest, soll nicht schweigen.',
  );
});
