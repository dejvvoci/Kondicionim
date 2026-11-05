import { inline, markdownToHtml, parseFrontmatter, readingMinutes } from './markdown';

describe('markdownToHtml', () => {
  it('tituj, paragrafë dhe lista', () => {
    const html = markdownToHtml(
      [
        '## Pse pikon?',
        '',
        'Rreshti i parë',
        'vazhdon këtu.',
        '',
        '- tubi i bllokuar',
        '- filtrat',
        '',
        '1. fikeni',
        '2. telefononi',
        '',
        '### Nëntitull',
      ].join('\n'),
    );
    expect(html).toBe(
      [
        '<h2>Pse pikon?</h2>',
        '<p>Rreshti i parë vazhdon këtu.</p>',
        '<ul><li>tubi i bllokuar</li><li>filtrat</li></ul>',
        '<ol><li>fikeni</li><li>telefononi</li></ol>',
        '<h3>Nëntitull</h3>',
      ].join('\n'),
    );
  });

  it('citime dhe heqja e komenteve TODO', () => {
    expect(markdownToHtml('<!-- TODO: rishikim -->\n> Kujdes me rrymën.')).toBe(
      '<blockquote><p>Kujdes me rrymën.</p></blockquote>',
    );
  });

  it('escape-on HTML-në e shkruar në tekst', () => {
    expect(markdownToHtml('<script>alert(1)</script>')).toBe(
      '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>',
    );
  });
});

describe('inline', () => {
  it('bold, italic dhe kod', () => {
    expect(inline('**kujdes** me *filtrat* dhe `E1`')).toBe(
      '<strong>kujdes</strong> me <em>filtrat</em> dhe <code>E1</code>',
    );
  });

  it('lidhje të brendshme dhe të jashtme, por jo javascript:', () => {
    expect(inline('[shërbimi](/sherbimet/montim-split)')).toBe(
      '<a href="/sherbimet/montim-split">shërbimi</a>',
    );
    expect(inline('[burimi](https://example.com)')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener">burimi</a>',
    );
    expect(inline('[x](javascript:alert(1))')).toBe('x)');
  });
});

describe('parseFrontmatter', () => {
  it('lexon çelësat dhe trupin', () => {
    const { data, body } = parseFrontmatter(
      '---\ntitle: "Pse më pikon kondicioneri?"\ndate: 2026-11-05\n---\n\nTrupi',
    );
    expect(data).toEqual({ title: 'Pse më pikon kondicioneri?', date: '2026-11-05' });
    expect(body.trim()).toBe('Trupi');
  });
});

describe('readingMinutes', () => {
  it('200 fjalë në minutë, minimumi 1', () => {
    expect(readingMinutes('pak fjalë')).toBe(1);
    expect(readingMinutes(Array(600).fill('fjalë').join(' '))).toBe(3);
  });
});
