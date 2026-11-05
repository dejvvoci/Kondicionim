import { TestBed } from '@angular/core/testing';
import { BeforeAfter } from './before-after';

describe('BeforeAfter', () => {
  async function render() {
    const fixture = TestBed.createComponent(BeforeAfter);
    fixture.componentRef.setInput('before', {
      src: '/images/a-para.avif',
      alt: 'Dhoma para montimit',
      width: 1200,
      height: 900,
    });
    fixture.componentRef.setInput('after', {
      src: '/images/a-pas.avif',
      alt: 'Dhoma pas montimit',
      width: 1200,
      height: 900,
    });
    fixture.componentRef.setInput('label', 'Vilë në Tiranë');
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('ka të dyja fotot me alt dhe raportin e fotos', async () => {
    const { el } = await render();
    const alts = [...el.querySelectorAll('img')].map((i) => i.alt);
    expect(alts).toEqual(['Dhoma pas montimit', 'Dhoma para montimit']);
    expect((el.querySelector('.ba') as HTMLElement).style.aspectRatio).toBe('1200 / 900');
  });

  it('kontrollohet me input range të etiketuar (tastierë dhe lexues ekrani)', async () => {
    const { fixture, el } = await render();
    const range = el.querySelector<HTMLInputElement>('input[type="range"]');
    expect(range?.getAttribute('aria-label')).toBe('Krahaso para dhe pas: Vilë në Tiranë');
    expect(range?.getAttribute('aria-valuetext')).toBe('50% para, 50% pas');

    range!.value = '80';
    range!.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const before = el.querySelector<HTMLElement>('.ba__before');
    expect(before?.style.clipPath.replace(/0px/g, '0')).toBe('inset(0 20% 0 0)');
    expect(range?.getAttribute('aria-valuetext')).toBe('80% para, 20% pas');
  });
});
