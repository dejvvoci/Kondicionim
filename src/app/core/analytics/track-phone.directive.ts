import { Directive, inject, input } from '@angular/core';
import { AnalyticsService } from './analytics.service';

/** Mat klikimet në linkun tel: (`<a appTrackPhone="hero" href="tel:...">`). */
@Directive({
  selector: 'a[appTrackPhone]',
  host: { '(click)': 'onClick()' },
})
export class TrackPhone {
  readonly appTrackPhone = input.required<string>();
  private readonly analytics = inject(AnalyticsService);

  protected onClick(): void {
    this.analytics.track('phone_click', { source: this.appTrackPhone() });
  }
}
