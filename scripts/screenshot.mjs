import puppeteer from 'puppeteer-core';
import { browserPfad } from './browser.mjs';
const EDGE = browserPfad();
const URL = process.argv[2] || 'https://rholabs.de/';
const OUT = process.argv[3] || 'C:\\Users\\Feixp\\Downloads\\rholabs-current.png';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--ignore-certificate-errors'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 20000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: OUT, fullPage: false });
console.log(`Screenshot: ${OUT}`);
await browser.close();
