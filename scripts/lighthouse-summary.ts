/**
 * Tabela e rezultateve të Lighthouse CI (.lighthouseci/lhr-*.json), për përmbledhjen e CI-së:
 *   node scripts/lighthouse-summary.ts >> "$GITHUB_STEP_SUMMARY"
 * Për çdo faqe tregon ekzekutimin më të mirë (si asertimet e LHCI) dhe intervalin e performancës.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

interface Lhr {
  finalDisplayedUrl: string;
  categories: Record<string, { score: number }>;
  audits: Record<string, { numericValue?: number }>;
}

const dir = join(import.meta.dirname, '..', '.lighthouseci');
if (!existsSync(dir)) {
  console.log('Lighthouse: nuk ka rezultate.');
  process.exit(0);
}

const runs = new Map<string, Lhr[]>();
for (const file of readdirSync(dir).filter((f) => /^lhr-.*\.json$/.test(f))) {
  const lhr = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Lhr;
  const path = new URL(lhr.finalDisplayedUrl).pathname;
  runs.set(path, [...(runs.get(path) ?? []), lhr]);
}

const score = (l: Lhr, c: string) => Math.round(l.categories[c].score * 100);
const num = (l: Lhr, a: string) => l.audits[a].numericValue ?? 0;

const rows = [...runs].map(([path, list]) => {
  const best = [...list].sort((a, b) => score(b, 'performance') - score(a, 'performance'))[0];
  const perf = list.map((l) => score(l, 'performance'));
  return `| ${path} | ${score(best, 'performance')} (${Math.min(...perf)}–${Math.max(...perf)}) | ${score(best, 'accessibility')} | ${score(best, 'best-practices')} | ${score(best, 'seo')} | ${(num(best, 'largest-contentful-paint') / 1000).toFixed(2)} s | ${Math.round(num(best, 'total-blocking-time'))} ms | ${num(best, 'cumulative-layout-shift').toFixed(3)} |`;
});

console.log(`### Lighthouse (celular)

| Faqja | Performance (intervali) | A11y | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}
`);
