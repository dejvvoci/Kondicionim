import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { activeCities } from '../../../data/cities';
import { PROJECTS_ENABLED } from '../../../data/features';
import type { City } from '../../../data/types';
import { UI_TEXT } from '../../../i18n';
import { ALBANIA_MAP } from './albania-map.generated';
import { project } from './projection';

/**
 * Harta e Shqipërisë me qytetet aktive: SVG inline (pa librari, pa tiles), pin-e si butona
 * të fokusueshëm me tastierë dhe tooltip me lidhje te projektet e qytetit.
 */
@Component({
  selector: 'ui-map-albania',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-albania.html',
  styleUrl: './map-albania.scss',
  host: { '(keydown.escape)': 'close()' },
})
export class MapAlbania {
  readonly cities = input<City[]>(activeCities());

  protected readonly t = UI_TEXT.map;
  /** Lidhja "Shiko projektet në …" vetëm kur projektet janë të ndezura (features.ts). */
  protected readonly projectsEnabled = PROJECTS_ENABLED;
  protected readonly map = ALBANIA_MAP;
  protected readonly ratio = `${ALBANIA_MAP.width} / ${ALBANIA_MAP.height}`;
  protected readonly openSlug = signal<string | null>(null);
  private readonly analytics = inject(AnalyticsService);

  /** Pozicionet në % të hartës; nga veriu në jug, që Tab të ndjekë hartën. */
  protected readonly pins = computed(() =>
    [...this.cities()]
      .sort((a, b) => b.lat - a.lat)
      .map((city) => {
        const [x, y] = project(city.lat, city.lng, ALBANIA_MAP.projection);
        return {
          city,
          left: (x / ALBANIA_MAP.width) * 100,
          top: (y / ALBANIA_MAP.height) * 100,
          label: city.mapLabel ?? 'right',
        };
      }),
  );

  protected toggle(city: City): void {
    const opening = this.openSlug() !== city.slug;
    this.openSlug.set(opening ? city.slug : null);
    if (opening) this.analytics.track('map_city_click', { city: city.slug });
  }

  protected show(slug: string): void {
    this.openSlug.set(slug);
  }

  /** Mbyll kur fokusi ose miu del jashtë pin-it dhe tooltip-it të tij. */
  protected leave(slug: string, event: FocusEvent | MouseEvent): void {
    const next = event.relatedTarget as Node | null;
    const pin = event.currentTarget as HTMLElement;
    if (next && pin.contains(next)) return;
    if (this.openSlug() === slug) this.openSlug.set(null);
  }

  protected close(): void {
    this.openSlug.set(null);
  }

  protected projectsText(city: City): string | null {
    if (city.projectCount === null) return null;
    return city.projectCount === 1 ? this.t.oneProject : `${city.projectCount} ${this.t.projects}`;
  }
}
