// Ad-hoc Hydration- und Asset-Check fuer Pre-Rendered Builds.
//
// Benutzung (puppeteer-core ist keine permanente Dependency):
//   npx --yes -p puppeteer-core node scripts/hydration-check.mjs [base-url]
//
// Default base ist http://localhost:5173. Fuer Live-Domain:
//   npx --yes -p puppeteer-core node scripts/hydration-check.mjs https://rholabs.de
//
// Berichtet pro Route: HTTP-Status, Console-Errors/Warnings, Hydration-Flags,
// fehlgeschlagene Subresource-Requests. Fehler führen zu Exit 1.

import puppeteer from 'puppeteer-core';
import { browserPfad } from './browser.mjs';

const EDGE = browserPfad();
const BASE = process.argv[2] || 'http://localhost:5173';
const ROUTES = [
  '/',
  '/kognitives-training/',
  '/home/',
  '/evidenz/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/',
  '/agb/',
  '/widerruf/',
  '/lizenzbedingungen/',
  '/demo/danke/',
  '/demo/fertig/',
  '/demo/link-abgelaufen/',
  '/kauf/fertig/',
  '/kauf/abgebrochen/',
  '/kauf/in-arbeit/',
  '/vertrag-widerrufen/',
  '/vertrag-widerrufen/eingegangen/',
  '/pilotpartner/',
  '/pilotpartner/danke/',
  '/pilotpartner/zustimmung/',
  '/pilotpartner/zustimmung/fertig/',
  '/pilotpartner/zustimmung/fehler/',
  '/pilotbedingungen/',
  // Vite Preview serves its SPA fallback for unknown URLs. Check the generated 404 page directly.
  '/404.html',
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

let failures = 0;
try {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const consoleMessages = [];
    const failedRequests = [];

    page.on('console', m => {
      const t = m.type();
      if (t === 'error' || t === 'warning') consoleMessages.push(`[${t}] ${m.text()}`);
    });
    page.on('pageerror', e => consoleMessages.push(`[pageerror] ${e.message}`));
    page.on('requestfailed', req => failedRequests.push(`FAILED ${req.url()} - ${req.failure()?.errorText}`));
    page.on('response', resp => {
      if (resp.status() >= 400) failedRequests.push(`${resp.status()} ${resp.url()}`);
    });

    const resp = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 500));

    const hydrationFlags = consoleMessages.filter(m =>
      m.toLowerCase().includes('hydrat') || m.toLowerCase().includes('mismatch') || m.toLowerCase().includes('did not match')
      || /Minified React error #(418|423|425)/.test(m)
    );

    const seoErrors = await page.evaluate((route) => {
      const errors = [];
      const canonicals = [...document.querySelectorAll('link[rel="canonical"]')];
      if (route === '/404.html') {
        if (canonicals.length) errors.push('404 hat einen Canonical');
        if (!document.querySelector('meta[name="robots"]')?.content.includes('noindex')) {
          errors.push('404 hat kein noindex');
        }
      } else {
        const expected = `https://rholabs.de${route}`;
        if (canonicals.length !== 1 || canonicals[0].href !== expected) errors.push('Canonical weicht ab');
        if (document.querySelector('meta[property="og:url"]')?.content !== expected) errors.push('og:url weicht ab');
        const nav = [...document.querySelectorAll('a.nav__link')].find(link => link.getAttribute('href') === route);
        if (nav && (nav.getAttribute('aria-current') !== 'page' || !nav.classList.contains('active'))) {
          errors.push('aktive Navigation fehlt');
        }
      }
      return errors;
    }, route);

    console.log(`\n=== ${route} (status ${resp?.status()}) ===`);
    console.log(`  Console errors/warnings: ${consoleMessages.length}, Hydration flags: ${hydrationFlags.length}`);
    consoleMessages.forEach(message => console.log(`    ${message}`));
    console.log(`  SEO/navigation errors: ${seoErrors.length}`);
    seoErrors.forEach(message => console.log(`    ${message}`));
    if (failedRequests.length) {
      console.log(`  Failed/4xx requests (${failedRequests.length}):`);
      failedRequests.slice(0, 10).forEach(f => console.log(`    ${f}`));
    } else {
      console.log(`  No failed requests`);
    }
    if (!resp?.ok() || consoleMessages.length || failedRequests.length || seoErrors.length) failures++;
    await page.close();
  }
} finally {
  await browser.close();
}
if (failures) process.exitCode = 1;
