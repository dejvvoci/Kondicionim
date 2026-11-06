/**
 * Artikujt Markdown (src/content/keshilla/*.md) → src/app/data/articles.generated.ts (lista)
 * dhe src/app/data/article-html.generated.ts (teksti, vetëm për faqen e artikullit).
 * Ekzekutohet automatikisht para `npm start` dhe `npm run build`.
 *
 * Frontmatter-i i çdo artikulli:
 *   title: Pse më pikon kondicioneri?
 *   description: (deri 155 karaktere, për Google)
 *   date: 2026-11-05
 *   services: montim-split, diagnostikim-dhe-riparim   (opsionale, slug-e nga services.ts)
 * Slug-u = emri i skedarit (pa .md).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import {
  markdownToHtml,
  parseFrontmatter,
  readingMinutes,
} from '../src/app/shared/utils/markdown.ts';

const root = join(import.meta.dirname, '..');
const dir = join(root, 'src/content/keshilla');
const out = join(root, 'src/app/data/articles.generated.ts');
const outHtml = join(root, 'src/app/data/article-html.generated.ts');

const errors: string[] = [];
const articles = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const slug = basename(file, '.md');
    const { data, body } = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
    for (const key of ['title', 'description', 'date']) {
      if (!data[key]) errors.push(`${file}: mungon "${key}" në frontmatter`);
    }
    if (!/^[a-z0-9-]+$/.test(slug))
      errors.push(`${file}: emri i skedarit duhet pa ë/ç dhe hapësira`);
    if ((data['description'] ?? '').length > 155)
      errors.push(`${file}: description > 155 karaktere`);
    return {
      slug,
      title: data['title'] ?? slug,
      description: data['description'] ?? '',
      date: data['date'] ?? '',
      services: (data['services'] ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      readingMinutes: readingMinutes(body),
      html: markdownToHtml(body),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

if (errors.length) {
  console.error(`build-content:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

const header =
  '// Gjeneruar nga scripts/build-content.ts nga src/content/keshilla/*.md. Mos e ndrysho me dorë.';
const index = articles.map(({ html: _html, ...meta }) => meta);
const bodies = Object.fromEntries(articles.map((a) => [a.slug, a.html]));

writeFileSync(
  out,
  `${header}
import type { Article } from './types';

export const ARTICLES: Article[] = ${JSON.stringify(index, null, 2)};
`,
);
writeFileSync(
  outHtml,
  `${header}
/** HTML-ja e çdo artikulli sipas slug-ut, e ngarkuar vetëm nga faqja e artikullit. */
export const ARTICLE_HTML: Record<string, string> = ${JSON.stringify(bodies, null, 2)};
`,
);
console.log(`build-content: ${articles.length} artikuj`);
