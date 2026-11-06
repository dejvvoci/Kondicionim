import { defineConfig } from '@playwright/test';

/**
 * Testet e2e dhe të aksesueshmërisë mbi build-in e testeve (`npm run build:e2e` → dist/e2e),
 * i shërbyer si në Cloudflare Pages nga scripts/serve.ts. Dy viewport-e: celular 390px dhe
 * desktop 1280px.
 */
const PORT = 4310;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'sq-AL',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'celular',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `node scripts/serve.ts dist/e2e/browser ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env['CI'],
  },
});
