import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DESCRIPTION_MAX, TITLE_MAX } from '../../core/seo/seo';
import { ARTICLES } from '../../data/articles.generated';
import { SERVICES } from '../../data/services';
import { formatDate } from './article-date';
import { ArticlePage } from './article-page';

describe('ArticlePage', () => {
  async function render(slug: string) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ArticlePage);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shfaq titullin, datën, kohën e leximit dhe përmbajtjen', async () => {
    const a = ARTICLES[0];
    const el = await render(a.slug);
    expect(el.querySelector('h1')?.textContent).toBe(a.title);
    expect(el.querySelector('time')?.getAttribute('datetime')).toBe(a.date);
    expect(el.querySelector('.meta')?.textContent).toContain('min lexim');
    expect(el.querySelector('.prose h2')).toBeTruthy();
  });

  it('slug i panjohur → 404', async () => {
    const el = await render('nuk-ekziston');
    expect(el.querySelector('h1')?.textContent).toBe('Faqja nuk u gjet');
  });
});

describe('ARTICLES (të gjeneruara)', () => {
  it('5 artikujt e parë, me SEO brenda kufijve dhe shërbime që ekzistojnë', () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(5);
    for (const a of ARTICLES) {
      expect(a.title.length).toBeLessThanOrEqual(TITLE_MAX);
      expect(a.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      expect(a.html).not.toContain('TODO');
      for (const s of a.services) expect(SERVICES.some((x) => x.slug === s)).toBe(true);
    }
  });
});

describe('formatDate', () => {
  it('datë në shqip', () => {
    expect(formatDate('2026-11-05')).toBe('5 nëntor 2026');
    expect(formatDate('2027-01-31')).toBe('31 janar 2027');
  });
});
