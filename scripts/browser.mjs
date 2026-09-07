// Findet einen Chromium-Browser fuer die Pruefskripte.
//
// Reihenfolge: CHROME_BIN, dann die ueblichen Installationsorte, zuletzt der
// von Puppeteer heruntergeladene Browser unter ~/.cache/puppeteer.
// Frueher stand hier ein fester Edge-Pfad — der ist auf einem Rechner ohne
// Edge sofort falsch.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const KANDIDATEN = [
  process.env.CHROME_BIN,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe'),
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

export function browserPfad() {
  for (const kandidat of KANDIDATEN) {
    if (kandidat && fs.existsSync(kandidat)) return kandidat;
  }

  // Von Puppeteer heruntergeladene Fassungen: neueste zuerst.
  const cache = path.join(os.homedir(), '.cache/puppeteer/chrome');
  if (fs.existsSync(cache)) {
    const versionen = fs.readdirSync(cache).sort().reverse();
    for (const v of versionen) {
      for (const rel of ['chrome-win64/chrome.exe', 'chrome-linux64/chrome', 'chrome-mac-x64/Chromium.app/Contents/MacOS/Chromium']) {
        const p = path.join(cache, v, rel);
        if (fs.existsSync(p)) return p;
      }
    }
  }

  throw new Error(
    'Kein Chromium gefunden. Entweder CHROME_BIN setzen oder einen holen:\n' +
      '  npx --yes puppeteer browsers install chrome',
  );
}
