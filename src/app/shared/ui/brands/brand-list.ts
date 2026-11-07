import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AUTHORIZED_LABEL, BRANDS, BRANDS_NOTE } from '../../../data/brands';

/**
 * Markat me të cilat punon ustai: logoja (kur ka) ose emri, në kuti me të njëjtën madhësi,
 * dhe shënimi që logot janë marka të pronarëve të tyre. Përdoret në kryefaqe dhe te "Rreth ustait".
 */
@Component({
  selector: 'ui-brand-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="brands">
      @for (b of shown(); track b.name) {
        <li class="brand">
          @if (b.logo) {
            <img
              class="brand__logo"
              [src]="b.logo"
              [alt]="b.name"
              width="140"
              height="48"
              loading="lazy"
              decoding="async"
            />
          } @else {
            <span class="brand__name">{{ b.name }}</span>
          }
          @if (b.authorized) {
            <small>{{ authorizedLabel }}</small>
          }
        </li>
      }
    </ul>
    <p class="note">{{ note }}</p>
  `,
  styles: `
    :host {
      display: block;
    }
    .brands {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: var(--sp-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .brand {
      display: grid;
      place-items: center;
      gap: var(--sp-1);
      min-height: 88px;
      padding: var(--sp-4) var(--sp-3);
      border: 1px solid var(--c-border);
      border-radius: var(--radius-card);
      background: var(--c-white);
    }
    .brand__logo {
      display: block;
      width: 100%;
      max-width: 140px;
      height: 48px;
      object-fit: contain;
    }
    .brand__name {
      font-family: var(--font-heading);
      font-size: var(--fs-lg);
      font-weight: 600;
      color: var(--c-base);
    }
    small {
      font-size: var(--fs-xs);
      font-weight: 600;
      color: var(--c-teal-text);
    }
    .note {
      margin: var(--sp-4) 0 0;
      font-size: var(--fs-xs);
      color: var(--c-text-muted);
    }
  `,
})
export class BrandList {
  /** Sa marka të shfaqen (kryefaqja tregon më pak); pa vlerë = të gjitha. */
  readonly limit = input<number>();
  protected readonly shown = computed(() => BRANDS.slice(0, this.limit() ?? BRANDS.length));
  protected readonly authorizedLabel = AUTHORIZED_LABEL;
  protected readonly note = BRANDS_NOTE;
}
