import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { ProjectVideo } from '../../../data/types';
import { UI_TEXT } from '../../../i18n';
import { Icon } from '../icon/icon';

/**
 * Video me facade: shfaqet vetëm thumbnail-i; embed-i i YouTube (youtube-nocookie) ngarkohet
 * pas klikimit. Instagram dhe TikTok hapen në tab të ri, pa skriptet e tyre në faqe.
 */
@Component({
  selector: 'ui-video-facade',
  imports: [NgOptimizedImage, NgTemplateOutlet, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (playing() && embedUrl(); as src) {
      <iframe
        class="frame"
        [src]="src"
        [title]="video().title"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    } @else {
      @let v = video();
      @if (v.platform === 'youtube') {
        <button type="button" class="facade" (click)="playing.set(true)">
          <ng-container *ngTemplateOutlet="thumb" />
          <span class="visually-hidden">{{ t.play }}: {{ v.title }}</span>
        </button>
      } @else {
        <a class="facade" [href]="v.id" target="_blank" rel="noopener">
          <ng-container *ngTemplateOutlet="thumb" />
          <span class="visually-hidden">{{ t.openOn }} {{ platformName() }}: {{ v.title }}</span>
        </a>
      }
    }

    <ng-template #thumb>
      <img
        class="facade__img"
        [ngSrc]="video().thumbnail.src"
        [alt]="video().thumbnail.alt"
        [width]="video().thumbnail.width"
        [height]="video().thumbnail.height"
        sizes="(min-width: 768px) 50vw, 100vw"
      />
      <span class="facade__play" aria-hidden="true"
        ><ui-icon name="player-play" [size]="28"
      /></span>
    </ng-template>
  `,
  styleUrl: './video-facade.scss',
})
export class VideoFacade {
  readonly video = input.required<ProjectVideo>();

  protected readonly t = UI_TEXT.video;
  protected readonly playing = signal(false);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly platformName = computed(() =>
    this.video().platform === 'instagram' ? 'Instagram' : 'TikTok',
  );

  /** Vetëm YouTube, me ID të kontrolluar (pa URL arbitrare në iframe). */
  protected readonly embedUrl = computed(() => {
    const v = this.video();
    if (v.platform !== 'youtube' || !/^[\w-]{6,20}$/.test(v.id)) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`,
    );
  });
}
