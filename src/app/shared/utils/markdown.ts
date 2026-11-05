/**
 * Konvertues i vogël Markdown → HTML për artikujt (pa librari): tituj ## dhe ###, paragrafë,
 * lista (- dhe 1.), citime (>), **bold**, *italic*, `kod` dhe [lidhje](url).
 * Teksti escape-ohet para formatimit; komentet <!-- --> hiqen.
 */

const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function safeUrl(url: string): string | null {
  return /^(https?:\/\/|\/|#|mailto:|tel:)/.test(url) ? url : null;
}

export function inline(text: string): string {
  return escape(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, url: string) => {
      const safe = safeUrl(url.replace(/&amp;/g, '&'));
      if (!safe) return label;
      const external = /^https?:\/\//.test(safe);
      return `<a href="${escape(safe)}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
    });
}

export function markdownToHtml(md: string): string {
  const lines = md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\r\n?/g, '\n')
    .split('\n');
  const out: string[] = [];
  let paragraph: string[] = [];
  let list: { tag: 'ul' | 'ol'; items: string[] } | null = null;
  let quote: string[] = [];

  const flush = () => {
    if (paragraph.length) out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    if (list)
      out.push(
        `<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`,
      );
    if (quote.length) out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
    paragraph = [];
    list = null;
    quote = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    const ul = /^[-*]\s+(.+)$/.exec(line);
    const ol = /^\d+[.)]\s+(.+)$/.exec(line);
    const bq = /^>\s?(.*)$/.exec(line);

    if (!line) {
      flush();
    } else if (heading) {
      flush();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else if (ul || ol) {
      const tag = ul ? 'ul' : 'ol';
      if (paragraph.length || quote.length || (list && list.tag !== tag)) flush();
      list ??= { tag, items: [] };
      list.items.push((ul ?? ol)![1]);
    } else if (bq) {
      if (paragraph.length || list) flush();
      quote.push(bq[1]);
    } else if (list) {
      // Vazhdim i elementit të fundit të listës.
      list.items[list.items.length - 1] += ` ${line}`;
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return out.join('\n');
}

/** Koha e leximit në minuta (200 fjalë/minutë), minimumi 1. */
export function readingMinutes(md: string): number {
  const words = md
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export interface Frontmatter {
  data: Record<string, string>;
  body: string;
}

/** Frontmatter i thjeshtë "çelës: vlerë" mes dy rreshtave ---. */
export function parseFrontmatter(source: string): Frontmatter {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!m) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line.trim());
    if (kv) data[kv[1]] = kv[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return { data, body: m[2] };
}
