import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = (name) => resolve(__dirname, 'screenshots', `${name}.png`);
const BASE = 'http://localhost:3001';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function shoot(name, url, { full = false, waitExtra = 600, actions } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, waitExtra));
  if (actions) await actions(page);
  const path = out(name);
  await page.screenshot({ path, fullPage: full });
  console.log(`✓ ${name} -> ${path}`);
  await page.close();
}

try {
  // 1. Home — hero (viewport only, the fold)
  await shoot('01-home-hero', '/');

  // 2. Services section (scroll to it)
  await shoot('02-services', '/', {
    actions: async (page) => {
      await page.evaluate(() => document.querySelector('#servicios')?.scrollIntoView({ block: 'start' }));
      await new Promise((r) => setTimeout(r, 800));
    },
  });

  // 3. Team
  await shoot('03-team', '/', {
    actions: async (page) => {
      await page.evaluate(() => document.querySelector('#equipo')?.scrollIntoView({ block: 'start' }));
      await new Promise((r) => setTimeout(r, 800));
    },
  });

  // 3b. Full page
  await shoot('00-home-full', '/', { full: true });

  // 4. Booking modal — step 1
  await shoot('04-booking-step1', '/', {
    actions: async (page) => {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find((b) =>
          /agendar/i.test(b.textContent || '')
        );
        btn?.click();
      });
      await new Promise((r) => setTimeout(r, 900));
    },
  });

  // 5. Booking modal — step final (navigate through steps)
  await shoot('05-booking-step3', '/', {
    actions: async (page) => {
      // open dialog
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find((b) =>
          /agendar/i.test(b.textContent || '')
        );
        btn?.click();
      });
      await new Promise((r) => setTimeout(r, 900));
      // step 1: pick first service + first barber
      // Services live inside <li><button>; barbers are direct <button> siblings under "Barbero" label.
      await page.evaluate(() => {
        const dlg = document.querySelector('[data-dialog="booking"]');
        const svc = dlg?.querySelector('li button');
        if (svc) svc.click();
      });
      await new Promise((r) => setTimeout(r, 500));
      await page.evaluate(() => {
        const dlg = document.querySelector('[data-dialog="booking"]');
        if (!dlg) return;
        // Barber buttons: direct <button> (not in <li>), text is "First Last" (two words),
        // not a nav button, not the close X.
        const all = Array.from(dlg.querySelectorAll('button'));
        const barber = all.find((b) => {
          if (b.closest('li')) return false;
          const t = (b.textContent || '').trim();
          if (!t || /\$/.test(t)) return false;
          if (/^(continuar|atrás|cerrar|reservar|confirmar)/i.test(t)) return false;
          // Name pattern: two or more alphabetic words
          return /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+)+$/.test(t);
        });
        if (barber) barber.click();
      });
      await new Promise((r) => setTimeout(r, 400));
      await new Promise((r) => setTimeout(r, 300));
      // click Continuar
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        btns.find((b) => /continuar/i.test(b.textContent || ''))?.click();
      });
      await new Promise((r) => setTimeout(r, 500));
      // step 2: set date (tomorrow) in input type=date
      await page.evaluate(() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        const iso = d.toISOString().split('T')[0];
        const input = document.querySelector('input[type="date"]');
        if (input) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          ).set;
          nativeInputValueSetter.call(input, iso);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await new Promise((r) => setTimeout(r, 1200));
      // pick first available slot
      await page.evaluate(() => {
        const slotBtns = Array.from(document.querySelectorAll('button'))
          .filter((b) => /^\s*\d{2}:\d{2}\s*$/.test(b.textContent || ''));
        slotBtns[0]?.click();
      });
      await new Promise((r) => setTimeout(r, 250));
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        btns.find((b) => /continuar/i.test(b.textContent || ''))?.click();
      });
      await new Promise((r) => setTimeout(r, 600));
    },
  });

  // 6. Admin Dashboard — wait longer for client-side Prisma fetch
  await shoot('06-admin-dashboard', '/admin/dashboard', { full: true, waitExtra: 2500 });

  // 7. Admin Appointments
  await shoot('07-admin-appointments', '/admin/appointments', { full: true, waitExtra: 2500 });

  // 8. Admin Clients
  await shoot('08-admin-clients', '/admin/clients', { full: true, waitExtra: 2500 });
} catch (e) {
  console.error('ERROR', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
