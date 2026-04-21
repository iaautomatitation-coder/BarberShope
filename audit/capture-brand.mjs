import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = (name) => resolve(__dirname, 'screenshots', `${name}.png`);
const BASE = 'http://localhost:3001';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brand = process.argv[2] || 'unknown';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: out(`brand-${brand}-hero`) });

  await page.evaluate(() => document.querySelector('#servicios')?.scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: out(`brand-${brand}-services`) });

  await page.evaluate(() => document.querySelector('#equipo')?.scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: out(`brand-${brand}-team`) });

  console.log(`Captured brand: ${brand}`);
} finally {
  await browser.close();
}
