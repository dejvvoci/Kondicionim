import { expect, test } from '@playwright/test';

/**
 * Header-at e sigurisë nga public/_headers (scripts/serve.ts i zbaton si Cloudflare Pages)
 * dhe asnjë shkelje e CSP-së kur faqja hidratohet dhe përdoret.
 */

declare global {
  interface Window {
    cspViolations: string[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.cspViolations = [];
    document.addEventListener('securitypolicyviolation', (e) =>
      window.cspViolations.push(`${e.violatedDirective}: ${e.blockedURI || 'inline'}`),
    );
  });
});

const hydrated = (page: import('@playwright/test').Page) =>
  page.waitForSelector('app-root:not([ngh])', { state: 'attached' });

test('header-at e sigurisë dhe CSP pa unsafe-inline për skriptet', async ({ request }) => {
  const res = await request.get('/');
  const h = res.headers();
  const csp = h['content-security-policy'] ?? '';
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toMatch(/script-src 'self'( 'sha256-[A-Za-z0-9+/=]+')+;/);
  expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
  expect(h['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['permissions-policy']).toBe('geolocation=(self), camera=(), microphone=()');
});

test('asnjë shkelje e CSP-së: hidratimi, WhatsApp, harta dhe kalkulatori', async ({ page }) => {
  await page.goto('/');
  await hydrated(page);
  await page.getByRole('main').getByRole('button', { name: 'WhatsApp' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('heading', { name: 'Ku punojmë', exact: true }).scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Tiranë' }).click();

  await page.goto('/si-te-zgjidhni-kondicionerin/');
  await hydrated(page);
  await page.getByLabel('Sipërfaqja (m²)').fill('25');

  await page.goto('/keshilla/pse-me-pikon-kondicioneri/');
  await hydrated(page);

  expect(await page.evaluate(() => window.cspViolations)).toEqual([]);
});

test('ikonat dhe manifesti', async ({ page, request }) => {
  await page.goto('/');
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  const res = await request.get(manifest ?? '');
  expect(res.ok()).toBe(true);
  const json = (await res.json()) as { icons: { src: string }[]; lang: string };
  expect(json.lang).toBe('sq');
  for (const icon of json.icons) expect((await request.get(icon.src)).ok()).toBe(true);
  for (const href of [
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/images/logo/logo-header.webp',
    '/images/logo/logo.png',
  ]) {
    expect((await request.get(href)).ok(), href).toBe(true);
  }
});
