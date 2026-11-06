import { type Page, expect, test } from '@playwright/test';

test('kalkulatori BTU jep rezultatin e pritur', async ({ page }) => {
  await page.goto('/si-te-zgjidhni-kondicionerin/');
  const result = page.locator('.result__size');

  // Vlera fillestare: 20 m², 2.7 m, kushte mesatare → 6800 BTU → 9000.
  await expect(result).toHaveText(/9000\s*BTU/);

  // 30 m² × 340 × 1.15 (diell) × 1.15 (kati i fundit) = 13 489.5 → 13 500 → 18000.
  await page.getByLabel('Sipërfaqja (m²)').fill('30');
  await page.getByRole('group', { name: 'Ekspozimi ndaj diellit' }).getByLabel('Shumë').check();
  await page.getByRole('group', { name: 'Kati' }).getByLabel('I fundit nën çati').check();
  await expect(result).toHaveText(/18000\s*BTU/);
  await expect(page.locator('.result__calc')).toContainText('13');

  // Mbi aparatin më të madh: rekomandim për multi-split/kanal/inspektim.
  await page.getByLabel('Sipërfaqja (m²)').fill('80');
  await expect(result).toHaveText(/Mbi 24000\s*BTU/);
});

test('harta navigohet me tastierë', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { name: 'Ku punojmë', exact: true }).scrollIntoViewIfNeeded();

  const shkoder = page.getByRole('button', { name: 'Shkodër' });
  await shkoder.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Lezhë' })).toBeFocused();

  await page.keyboard.press('Enter');
  const tip = page.locator('#map-tip-lezhe');
  await expect(tip).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lezhë' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );

  await page.keyboard.press('Tab');
  await expect(tip.getByRole('link', { name: /Shiko projektet në Lezhë/ })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(tip).toBeHidden();
});

test('faqja 404 kthen statusin 404, noindex dhe lidhje për t’u kthyer', async ({ page }) => {
  const response = await page.goto('/kjo-faqe-nuk-ekziston/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Faqja nuk u gjet');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');

  await page.getByRole('main').getByRole('link', { name: 'Kryefaqja' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('çdo faqe ka një H1, title, description dhe JSON-LD të vlefshëm', async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);
  expect(paths.length).toBeGreaterThan(20);

  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator('h1'), path).toHaveCount(1);
    expect((await page.title()).length, path).toBeLessThanOrEqual(60);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0, path).toBeGreaterThan(50);
    expect(description?.length ?? 0, path).toBeLessThanOrEqual(155);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((b) =>
      [JSON.parse(b)].flat().map((x: { '@type': string }) => x['@type']),
    );
    expect(types, path).toContain('HVACBusiness');
    if (path !== '/') expect(types, path).toContain('BreadcrumbList');
    if (path.startsWith('/sherbimet/') && path !== '/sherbimet/')
      expect(types, path).toContain('Service');
    if (path.startsWith('/keshilla/') && path !== '/keshilla/')
      expect(types, path).toContain('BlogPosting');
    if (path === '/pyetje-te-shpeshta/') expect(types, path).toContain('FAQPage');
  }
});

/** JS nis pas eventit load; hidratimi mbaron kur app-root humbet atributin ngh. */
const hydrated = (page: Page) => page.waitForSelector('app-root:not([ngh])', { state: 'attached' });

test('navigimi pas hidratimit bëhet brenda faqes, pa rifreskim', async ({ page }, testInfo) => {
  await page.goto('/');
  await hydrated(page);
  // Shënjë në window: zhduket nëse faqja rifreskohet krejt.
  await page.evaluate(() => ((window as unknown as { spa: boolean }).spa = true));

  if (testInfo.project.name === 'celular') {
    await page.getByRole('button', { name: 'Hap menunë' }).click();
  }
  const nav = page.getByRole('navigation', { name: 'Navigimi kryesor' });
  await nav.getByRole('link', { name: 'Shërbimet' }).click();

  await expect(page).toHaveURL(/\/sherbimet$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Shërbimet/);
  await expect(page).toHaveTitle(/^Shërbimet e kondicionimit/);
  // Blloqet @defer shfaqen edhe kur faqja ndërtohet në browser.
  await expect(page.getByRole('link', { name: /Montim split/ }).first()).toBeVisible();
  // Header-i hidratohet pas navigimit, që lidhja aktive të ndryshojë (në celular menuja
  // mbyllet pas klikimit, ndaj lidhja kontrollohet direkt në DOM).
  await expect(page.locator('#main-nav a[href="/sherbimet"]')).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(await page.evaluate(() => (window as unknown as { spa?: boolean }).spa)).toBe(true);
});

test.describe('pa JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('faqet e prerenderuara lexohen dhe lidhjet funksionojnë', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/sherbimet/');
    await page
      .getByRole('link', { name: /Montim split/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/sherbimet\/montim-split\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('split');
  });
});

test('vlerat e shkruara në kalkulator para nisjes së JS-së ruhen pas hidratimit', async ({
  page,
}) => {
  // JS-ja mbahet deri sa të shkruajmë, si në një lidhje të ngadaltë.
  let release!: () => void;
  const held = new Promise<void>((r) => (release = r));
  await page.route(/\/main-[\w-]+\.js$/, async (route) => {
    await held;
    await route.continue();
  });

  await page.goto('/si-te-zgjidhni-kondicionerin/');
  await page.getByLabel('Sipërfaqja (m²)').fill('30');
  await page.getByRole('group', { name: 'Kati' }).getByLabel('I fundit nën çati').check();
  await page.getByRole('group', { name: 'Ekspozimi ndaj diellit' }).getByLabel('Shumë').check();

  release();
  await hydrated(page);
  await page.getByLabel('Sipërfaqja (m²)').scrollIntoViewIfNeeded();
  await expect(page.locator('.result__size')).toHaveText(/18000\s*BTU/);
  await expect(page.getByLabel('Sipërfaqja (m²)')).toHaveValue('30');
});
