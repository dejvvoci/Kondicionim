import AxeBuilder from '@axe-core/playwright';
import { type Page, expect, test } from '@playwright/test';

/** WCAG 2.2 AA (seksioni 6.3). Testi dështon për çdo shkelje serioze ose kritike. */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      targets: v.nodes.map((n) => n.target.join(' ')),
    }));
}

/** Lëviz faqen deri në fund, që të ngarkohen blloqet @defer (on viewport). */
async function revealDeferred(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

test('axe: asnjë shkelje serioze ose kritike në asnjë rrugë', async ({ page, request }) => {
  // 25+ faqe, secila e lëvizur deri në fund: më gjatë se kufiri i zakonshëm.
  test.setTimeout(240_000);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const paths = [
    ...[...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]),
    '/kjo-faqe-nuk-ekziston/',
  ];

  const report: Record<string, unknown> = {};
  for (const path of paths) {
    await page.goto(path);
    await revealDeferred(page);
    const found = await seriousViolations(page);
    if (found.length) report[path] = found;
  }
  expect(report).toEqual({});
});

test('axe: sheet-i WhatsApp i hapur', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('main').getByRole('button', { name: 'WhatsApp' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});

test('menuja e celularit dhe tooltip-i i hartës', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'celular') {
    await page.getByRole('button', { name: /Menu/i }).click();
    expect(await seriousViolations(page)).toEqual([]);
    await page.keyboard.press('Escape');
  }
  await page.getByRole('heading', { name: 'Ku punojmë', exact: true }).scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Tiranë' }).click();
  expect(await seriousViolations(page)).toEqual([]);
});
