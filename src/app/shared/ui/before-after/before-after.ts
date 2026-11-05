import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { Photo } from '../../../data/types';
import { UI_TEXT } from '../../../i18n';

/**
 * Slider para/pas: dy foto me të njëjtin raport, ndarës i tërhequshëm me maus dhe prekje.
 * I ndërtuar mbi <input type="range"> që mbulon gjithë foton: tastiera (shigjetat, Home/End),
 * lexuesit e ekranit dhe prekja punojnë nativisht.
 */
@Component({
  selector: 'ui-before-after',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './before-after.html',
  styleUrl: './before-after.scss',
})
export class BeforeAfter {
  readonly before = input.required<Photo>();
  readonly after = input.required<Photo>();
  /** Emri i projektit, për etiketën e slider-it. */
  readonly label = input('');
  readonly priority = input(false);
  readonly sizes = input('(min-width: 1024px) 50vw, 100vw');

  protected readonly t = UI_TEXT.beforeAfter;
  /** Sa % e fotos "para" shihet (nga e majta). */
  protected readonly position = signal(50);
  protected readonly ratio = computed(() => `${this.after().width} / ${this.after().height}`);
  protected readonly clip = computed(() => `inset(0 ${100 - this.position()}% 0 0)`);
  protected readonly valueText = computed(
    () =>
      `${this.position()}% ${this.t.before.toLowerCase()}, ${100 - this.position()}% ${this.t.after.toLowerCase()}`,
  );

  protected onInput(event: Event): void {
    this.position.set(Number((event.target as HTMLInputElement).value));
  }
}
