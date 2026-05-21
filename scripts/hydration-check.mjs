// Ad-hoc Hydration- und Asset-Check fuer den Pre-Rendered Build.
//
// Benutzung (puppeteer-core ist keine permanente Dependency):
//   1) npm run build
//   2) npx --yes serve docs -l 5173   (in eigenem Terminal lassen)
//   3) npx --yes -p puppeteer-core node scripts/hydration-check.mjs
//
// Berichtet pro Route: HTTP-Status, Console-Errors/Warnings, Hydration-Flags,
// fehlgeschlagene Subresource-Requests. Exit 0 bei sauberen Hydration-Flags.

import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:5173';
const ROUTES = ['/', '/kognitives-training', '/evidenz', '/kontakt', '/impressum', '/datenschutz', '/foo-bar'];

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
