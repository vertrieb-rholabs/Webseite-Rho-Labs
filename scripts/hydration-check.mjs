// Ad-hoc Hydration- und Asset-Check fuer Pre-Rendered Builds.
//
// Benutzung (puppeteer-core ist keine permanente Dependency):
//   npx --yes -p puppeteer-core node scripts/hydration-check.mjs [base-url]
//
// Default base ist http://localhost:5173. Fuer Live-Domain:
//   npx --yes -p puppeteer-core node scripts/hydration-check.mjs https://rholabs.de
//
// Berichtet pro Route: HTTP-Status, Console-Errors/Warnings, Hydration-Flags,
// fehlgeschlagene Subresource-Requests. Exit 0 bei sauberen Hydration-Flags.

import puppeteer from 'puppeteer-core';
import { browserPfad } from './browser.mjs';

const EDGE = browserPfad();
const BASE = process.argv[2] || 'http://localhost:5173';
const ROUTES = [
  '/',
  '/kognitives-training',
  '/home',
  '/evidenz',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/widerruf',
  '/lizenzbedingungen',
  '/demo/danke/',
  '/demo/fertig/',
  '/demo/link-abgelaufen/',
  '/kauf/fertig/',
  '/kauf/abgebrochen/',
  '/kauf/in-arbeit/',
  '/vertrag-widerrufen',
  '/vertrag-widerrufen/eingegangen/',
  '/foo-bar',
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

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
  );

  console.log(`\n=== ${route} (status ${resp?.status()}) ===`);
  console.log(`  Console errors/warnings: ${consoleMessages.length}, Hydration flags: ${hydrationFlags.length}`);
  if (failedRequests.length) {
    console.log(`  Failed/4xx requests (${failedRequests.length}):`);
    failedRequests.slice(0, 10).forEach(f => console.log(`    ${f}`));
  } else {
    console.log(`  No failed requests`);
  }
  await page.close();
}

await browser.close();
