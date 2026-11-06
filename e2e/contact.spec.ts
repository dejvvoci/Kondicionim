import { expect, test } from '@playwright/test';

/** Numri fiktiv i build-it e2e (src/app/data/business.overrides.e2e.ts). */
const WHATSAPP = '355690000000';

test.describe('rrjedha WhatsApp', () => {
  test('sheet-i hapet dhe ndërton URL-në me shërbimin, qytetin, vendndodhjen dhe shënimet', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 41.32751, longitude: 19.81872 });
    await page.goto('/');

    await page.getByRole('main').getByRole('button', { name: 'WhatsApp' }).first().click();
    const sheet = page.getByRole('dialog', { name: 'Na shkruani në WhatsApp' });
    await expect(sheet).toBeVisible();

    await sheet.getByLabel('Shërbimi').selectOption('montim-split');
    await sheet.getByLabel('Qyteti ku do të bëhet puna').selectOption('durres');
    await sheet.getByLabel('Zona, lagjja ose adresa').fill('Plazh, pranë Hotel Ara');
    await sheet.getByRole('button', { name: 'Shto vendndodhjen time' }).click();
    await expect(sheet.getByText('Vendndodhja u shtua')).toBeVisible();
    await sheet.getByRole('textbox', { name: /Shënime/ }).fill('Dy aparate, kati i 3-të');

    const href = await sheet.getByRole('link', { name: 'Vazhdo në WhatsApp' }).getAttribute('href');
    const url = new URL(href ?? '');
    expect(`${url.origin}${url.pathname}`).toBe(`https://wa.me/${WHATSAPP}`);
    expect(url.searchParams.get('text')).toBe(
      [
        'Përshëndetje! Ju kontaktoj nga faqja juaj për të marrë një ofertë ose një vlerësim.',
        'Shërbimi: Montim split',
        'Qyteti: Durrës',
        'Zona/adresa: Plazh, pranë Hotel Ara',
        'Vendndodhja: https://maps.google.com/?q=41.32751,19.81872',
        'Shënime: Dy aparate, kati i 3-të',
      ].join('\n'),
    );

    // Lidhja pa plotësuar, që askush të mos bllokohet.
    await expect(sheet.getByRole('link', { name: 'Hap WhatsApp pa plotësuar' })).toHaveAttribute(
      'href',
      new RegExp(`^https://wa\\.me/${WHATSAPP}`),
    );

    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
  });

  test('pa leje për vendndodhjen, rrjedha vazhdon me mesazh të qartë', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('main').getByRole('button', { name: 'WhatsApp' }).first().click();
    const sheet = page.getByRole('dialog');
    await sheet.getByRole('button', { name: 'Shto vendndodhjen time' }).click();
    await expect(sheet.locator('.location__error')).toBeVisible();
    const href = await sheet.getByRole('link', { name: 'Vazhdo në WhatsApp' }).getAttribute('href');
    expect(decodeURIComponent(href ?? '')).not.toContain('maps.google.com');
  });
});

test('shiriti i kontaktit shfaqet vetëm në celular', async ({ page }, testInfo) => {
  await page.goto('/sherbimet/');
  const bar = page.getByRole('navigation', { name: 'Kontakt i shpejtë' });
  if (testInfo.project.name === 'celular') {
    await expect(bar).toBeVisible();
    await expect(bar.getByRole('link', { name: 'Telefono' })).toHaveAttribute(
      'href',
      'tel:+355690000000',
    );
    await bar.getByRole('button', { name: 'WhatsApp' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  } else {
    await expect(bar).toBeHidden();
  }
});
