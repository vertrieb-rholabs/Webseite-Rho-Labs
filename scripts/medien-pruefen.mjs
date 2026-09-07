// Prueft, ob alle Bilder und Medien vorhanden sind, die die Seiten einbinden.
//
// Benutzung:  node scripts/medien-pruefen.mjs
//
// Exit 1, wenn etwas fehlt — damit die Seite nicht mit leeren Rahmen
// veroeffentlicht wird. Zu jeder gefundenen Datei stehen Groesse und
// Bildmasse dabei, damit auffaellt, wenn ein Bild versehentlich winzig oder
// riesig ist.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ERWARTET = [
  'public/logo.png',
  'public/media/rho-labs-teaser.mp4',
  'public/media/rho-labs-teaser-poster.jpg',
  'public/bilder/app-katalog.webp',
  'public/bilder/app-verlauf.webp',
  'public/bilder/app-radar.webp',
  'public/bilder/app-vorfuehrung-muster.webp',
  'public/bilder/app-vorfuehrung-spiegelbild.webp',
  'public/bilder/app-vorfuehrung-auftrag.webp',
  'public/bilder/app-vorfuehrung-bildpaare.webp',
];

/** Bildmasse aus dem Dateikopf, ohne zusaetzliche Abhaengigkeit. */
function masse(datei, buf) {
  if (datei.endsWith('.png') && buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`;
  }
  if (datei.endsWith('.webp') && buf.length > 30 && buf.subarray(8, 12).toString() === 'WEBP') {
    const art = buf.subarray(12, 16).toString();
    // VP8L (verlustfrei) kodiert die Maße als je 14 Bit ab Byte 21.
    if (art === 'VP8L') {
      const bits = buf.readUInt32LE(21);
      return `${(bits & 0x3fff) + 1}x${((bits >> 14) & 0x3fff) + 1}`;
    }
    if (art === 'VP8 ') return `${buf.readUInt16LE(26) & 0x3fff}x${buf.readUInt16LE(28) & 0x3fff}`;
    if (art === 'VP8X') {
      const w = buf[24] | (buf[25] << 8) | (buf[26] << 16);
      const h = buf[27] | (buf[28] << 8) | (buf[29] << 16);
      return `${w + 1}x${h + 1}`;
    }
  }
  if (datei.endsWith('.jpg') || datei.endsWith('.jpeg')) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      const laenge = buf.readUInt16BE(i + 2);
      // SOF0..SOF3 und SOF5..SOF15 tragen die Masse, DHT/DAC/RST nicht.
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return `${buf.readUInt16BE(i + 7)}x${buf.readUInt16BE(i + 5)}`;
      }
      i += 2 + laenge;
    }
  }
  return '';
}

let fehlend = 0;

for (const rel of ERWARTET) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.log(`FEHLT   ${rel}`);
    fehlend += 1;
    continue;
  }
  const buf = fs.readFileSync(abs);
  const kb = (buf.length / 1024).toFixed(0).padStart(6);
  const d = masse(rel, buf);
  console.log(`ok      ${rel.padEnd(46)} ${kb} KB  ${d}`);
}

if (fehlend) {
  console.log(`\n${fehlend} Datei(en) fehlen. Die Seiten binden sie ein — vor dem Veroeffentlichen ablegen.`);
  process.exit(1);
}

console.log('\nAlle erwarteten Medien liegen bereit.');
