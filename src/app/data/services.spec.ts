import { DESCRIPTION_MAX, TITLE_MAX } from '../core/seo/seo';
import { slugify } from '../shared/utils/slugify';
import { SERVICES, servicesIn } from './services';

describe('SERVICES', () => {
  it('ka 12 shërbime (7 kondicionim, 5 elektrike) me slug unik dhe pa ë/ç', () => {
    expect(SERVICES).toHaveLength(12);
    expect(servicesIn('kondicionim')).toHaveLength(7);
    expect(servicesIn('elektrike')).toHaveLength(5);
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toBe(slugify(slug));
  });

  it.each(SERVICES.map((s) => [s.slug, s] as const))(
    '%s: SEO brenda kufijve dhe përmbajtje e plotë',
    (_, s) => {
      expect(s.seo.title.length).toBeLessThanOrEqual(TITLE_MAX);
      expect(s.seo.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      expect(s.includes.length).toBeGreaterThanOrEqual(3);
      expect(s.audience.length).toBeGreaterThanOrEqual(2);
      expect(s.faq.length).toBeLessThanOrEqual(3);
    },
  );
});
