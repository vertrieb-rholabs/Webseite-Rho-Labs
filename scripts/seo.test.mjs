// Erst npm run build: Diese Prüfungen lesen das tatsächlich ausgelieferte HTML.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchRoutes } from 'react-router-dom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docs = path.join(root, 'docs');
const origin = 'https://rholabs.de';
const read = (file) => fs.readFileSync(file, 'utf8');

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

function pagePath(file) {
  return `/${path.relative(docs, file).split(path.sep).join('/')}`.replace(/index\.html$/, '');
}

// React schreibt Attributwerte in Anführungszeichen. Reihenfolge und zusätzliche
// Attribute (etwa data-rh von Head) sind für diese Prüfung unerheblich.
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) =>
    Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
      .map(([, key, double, single]) => [key.toLowerCase(), double ?? single])),
  );
}

function canonical(html) {
  return tags(html, 'link').filter((tag) => tag.rel === 'canonical').map((tag) => tag.href);
}

test('SEO: jeder Seitenordner hat genau seinen Canonical und og:url mit Schrägstrich', () => {
  const pages = htmlFiles(docs).filter((file) => path.basename(file) === 'index.html');
  assert.ok(pages.length > 1, 'Keine vorgerenderten Unterseiten — zuerst bauen.');
  for (const file of pages) {
    const html = read(file);
    const expected = `${origin}${pagePath(file)}`;
    assert.deepEqual(canonical(html), [expected], `${file}: Canonical passt nicht zum Ordner.`);
    assert.deepEqual(
      tags(html, 'meta').filter((tag) => tag.property === 'og:url').map((tag) => tag.content),
      [expected], `${file}: og:url weicht vom Canonical ab.`,
    );
  }
});

test('SEO: die 404-Seite hat keinen Canonical und behält noindex', () => {
  const html = read(path.join(docs, '404.html'));
  assert.deepEqual(canonical(html), []);
  assert.ok(tags(html, 'meta').some((tag) => tag.name === 'robots' && /\bnoindex\b/.test(tag.content)));
  assert.deepEqual(
    tags(html, 'meta').filter((tag) => tag.property === 'og:url').map((tag) => tag.content),
    [`${origin}/404/`],
  );
});

test('SEO: die aktive Navigation stimmt schon vor der Hydration', () => {
  let checked = 0;
  for (const file of htmlFiles(docs).filter((entry) => path.basename(entry) === 'index.html')) {
    for (const tag of tags(read(file), 'a')) {
      if (!tag.class?.split(' ').includes('nav__link') || tag.href !== pagePath(file)) continue;
      checked++;
      assert.equal(tag['aria-current'], 'page', `${file}: aktive Navigation fehlt.`);
      assert.ok(tag.class.split(' ').includes('active'), `${file}: aktive Gestaltung fehlt.`);
    }
  }
  assert.ok(checked > 1, 'Keine Navigation für Unterseiten gefunden.');
});

test('SEO: jeder Sitemap-Eintrag endet auf / und hat eine vorgerenderte Seite', () => {
  const sitemap = read(path.join(docs, 'sitemap.xml'));
  assert.equal(sitemap, read(path.join(root, 'public', 'sitemap.xml')));
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
  assert.ok(locations.length > 1, 'Die Sitemap ist leer oder enthält nur die Startseite.');
  assert.equal(new Set(locations).size, locations.length, 'Doppelte Sitemap-Einträge.');
  for (const loc of locations) {
    const url = new URL(loc);
    assert.equal(url.origin, origin, loc);
    assert.ok(loc.endsWith('/'), `${loc}: Schrägstrich fehlt.`);
    assert.equal(url.search + url.hash, '', `${loc}: Abfrage oder Anker in der Sitemap.`);
    const file = path.join(docs, url.pathname, 'index.html');
    assert.ok(fs.existsSync(file), `${loc}: ${file} fehlt.`);
    assert.deepEqual(canonical(read(file)), [loc]);
  }
});

test('SEO: interne Links im gesamten HTML-Erzeugnis umgehen Schrägstrich-Weiterleitungen', () => {
  let checked = 0;
  for (const file of htmlFiles(docs)) {
    const base = `${origin}${pagePath(file)}`;
    for (const tag of tags(read(file), '(?:a|area|link)')) {
      if (!tag.href) continue;
      const href = tag.href.replace(/&amp;/g, '&');
      const url = new URL(href, base);
      if (url.origin !== origin) continue;
      checked++;
      // Anker und Abfragen gehören hinter den Schrägstrich. Dateien wie
      // /sitemap.xml, /logo.png und die CSS-/JS-Bündel sind ausgenommen.
      assert.ok(
        url.pathname.endsWith('/') || path.posix.extname(url.pathname),
        `${file}: interner Link ohne abschließenden Schrägstrich: ${href}`,
      );
    }
  }
  assert.ok(checked > 0, 'Keine internen Links gefunden.');
});

test('SEO: alle bestehenden Router-Pfade funktionieren mit und ohne Schrägstrich', () => {
  const app = read(path.join(root, 'src', 'App.tsx'));
  const children = [...app.matchAll(/\{ path: '([^']+)', Component:/g)]
    .map(([, route]) => ({ path: route }));
  assert.ok(children.length > 1, 'Routen aus App.tsx nicht gefunden.');
  const routes = [{ path: '/', children }];
  for (const route of children.filter((entry) => entry.path !== '*')) {
    const pathname = `/${route.path}`;
    for (const suffix of ['', '/', '/?ref=test#inhalt']) {
      const match = matchRoutes(routes, `${pathname}${suffix}`)?.at(-1);
      assert.equal(match?.route, route, `${pathname}${suffix}: falsche Route.`);
    }
    assert.ok(fs.existsSync(path.join(docs, route.path, 'index.html')), `${pathname}: Seite fehlt.`);
  }
});
