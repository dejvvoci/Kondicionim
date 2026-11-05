import { buildCanonical, buildTitle, TITLE_MAX, truncate } from './seo';

describe('seo', () => {
  it('shton emrin e biznesit te titulli', () => {
    expect(buildTitle('Shërbimet', 'Usta Test')).toBe('Shërbimet | Usta Test');
  });

  it('përdor vetëm emrin kur faqja nuk ka titull', () => {
    expect(buildTitle(null, 'Usta Test')).toBe('Usta Test');
  });

  it('nuk e kalon kufirin e titullit', () => {
    const long = 'Montim kondicioneri multi-split në Tiranë dhe Durrës';
    const title = buildTitle(long, 'Emër shumë i gjatë biznesi');
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(title).toBe(long);
  });

  it('ndërton canonical me / në fund dhe pa query', () => {
    expect(buildCanonical('/sherbimet?x=1#a', 'https://ex.al')).toBe('https://ex.al/sherbimet/');
    expect(buildCanonical('/', 'https://ex.al')).toBe('https://ex.al/');
    expect(buildCanonical('/projektet/', 'https://ex.al')).toBe('https://ex.al/projektet/');
  });
});

describe('truncate', () => {
  it('e lë tekstin e shkurtër të pandryshuar', () => {
    expect(truncate('Tekst i shkurtër')).toBe('Tekst i shkurtër');
  });

  it('e pret në fund të fjalës dhe shton …', () => {
    const t = truncate('një dy tre katër pesë', 12);
    expect(t).toBe('një dy tre…');
    expect(t.length).toBeLessThanOrEqual(12);
  });
});
