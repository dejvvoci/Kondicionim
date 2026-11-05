import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  isDevMode,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { BUSINESS, businessName } from '../../../data/business';
import { MAIN_NAV } from '../../../data/navigation';
import { UI_TEXT } from '../../../i18n';
import { TrackPhone } from '../../analytics/track-phone.directive';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { formatPhone, telHref } from '../../contact/phone';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Button, Icon, TrackPhone],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(document:keydown.escape)': 'close()' },
})
export class Header {
  protected readonly t = UI_TEXT;
  protected readonly nav = MAIN_NAV;
  protected readonly name = businessName();
  protected readonly phone = BUSINESS.phone;
  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;
  protected readonly phoneLabel = BUSINESS.phone ? formatPhone(BUSINESS.phone) : null;
  protected readonly showTodo = isDevMode();
  protected readonly menuOpen = signal(false);

  constructor() {
    const sub = inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.close());
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
  }

  protected toggle(): void {
    this.menuOpen.update((open) => !open);
  }

  protected close(): void {
    this.menuOpen.set(false);
  }
}
