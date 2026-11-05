import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { activeCities } from '../../../data/cities';
import { ALBANIA_MAP } from './albania-map.generated';
import { MapAlbania } from './map-albania';
import { project } from './projection';

describe('MapAlbania', () => {
  async function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(MapAlbania);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('ka një pin të fokusueshëm për çdo qytet aktiv, nga veriu në jug', async () => {
    const { el } = await render();
    const buttons = [...el.querySelectorAll<HTMLButtonElement>('.pin__dot')];
    expect(buttons).toHaveLength(activeCities().length);
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(
      [...activeCities()].sort((a, b) => b.lat - a.lat).map((c) => c.name),
    );
  });

  it('klikimi hap tooltip-in me lidhjen te projektet; Esc e mbyll', async () => {
    const { fixture, el } = await render();
    const durres = [...el.querySelectorAll<HTMLButtonElement>('.pin__dot')].find((b) =>
      b.textContent?.includes('Durrës'),
    );
    const tip = el.querySelector<HTMLElement>('#map-tip-durres');
    expect(tip?.hidden).toBe(true);

    durres?.click();
    await fixture.whenStable();
    expect(durres?.getAttribute('aria-expanded')).toBe('true');
    expect(tip?.hidden).toBe(false);
    expect(tip?.querySelector('a')?.getAttribute('href')).toBe('/projektet?qyteti=durres');
    expect(tip?.textContent).toContain('Shiko projektet në Durrës');

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(tip?.hidden).toBe(true);
  });

  it('pozicionet e qyteteve bien brenda hartës', () => {
    for (const c of activeCities()) {
      const [x, y] = project(c.lat, c.lng, ALBANIA_MAP.projection);
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(ALBANIA_MAP.width);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(ALBANIA_MAP.height);
    }
  });

  it('path-i i hartës mbetet i vogël (< 30 KB)', () => {
    expect(ALBANIA_MAP.path.length).toBeLessThan(30_000);
    expect(ALBANIA_MAP.path).toMatch(/^M[\d.]+ [\d.]+L/);
  });
});
