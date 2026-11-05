import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, isDevMode } from '@angular/core';
import type { Photo as PhotoData } from '../../../data/types';

/**
 * Foto reale me NgOptimizedImage (width/height të deklaruara, lazy ose priority).
 * Pa foto: në development shfaqet një kuti gri "Foto reale këtu", në prodhim asgjë.
 */
@Component({
  selector: 'ui-photo',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (photo(); as p) {
      <img
        [ngSrc]="p.src"
        [width]="p.width"
        [height]="p.height"
        [alt]="p.alt"
        [priority]="priority()"
        [sizes]="sizes()"
      />
    } @else if (showPlaceholder) {
      <div
        class="placeholder"
        [style.aspect-ratio]="ratio()"
        role="img"
        [attr.aria-label]="label()"
      >
        <span>Foto reale këtu</span>
        @if (label()) {
          <small>{{ label() }}</small>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    img {
      width: 100%;
      height: auto;
      border-radius: inherit;
    }
    .placeholder {
      display: grid;
      place-content: center;
      gap: var(--sp-1);
      padding: var(--sp-4);
      border-radius: inherit;
      background: var(--c-placeholder);
      color: var(--c-text-muted);
      font-family: var(--font-heading);
      font-weight: 500;
      text-align: center;
    }
    small {
      font-family: var(--font-body);
      font-weight: 400;
    }
  `,
})
export class Photo {
  readonly photo = input<PhotoData | null>(null);
  /** Vetëm për imazhin LCP (seksioni i parë). */
  readonly priority = input(false);
  readonly sizes = input('100vw');
  /** Raporti i placeholder-it, p.sh. "4 / 3". */
  readonly ratio = input('4 / 3');
  /** Çfarë foto duhet këtu (shfaqet te placeholder-i). */
  readonly label = input('');

  protected readonly showPlaceholder = isDevMode();
}
