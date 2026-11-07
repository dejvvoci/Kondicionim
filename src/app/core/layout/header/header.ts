import { ChangeDetectionStrategy, Component, isDevMode } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BUSINESS, businessName } from '../../../data/business';
import { MAIN_NAV } from '../../../data/navigation';
import { UI_TEXT } from '../../../i18n';
import { TrackPhone } from '../../analytics/track-phone.directive';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { formatPhone, telHref } from '../../contact/phone';

/**
 * Header-i me logon dhe menunë. Në desktop menuja është në të njëjtin rresht me logon; në
 * celular dhe tablet tab-et janë gjithmonë të dukshme në një rresht poshtë logos, që rrëshqet
 * anash kur nuk nxë (pa buton ☰). Tab-in aktiv e sjell në pamje App (app.ts).
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Button, Icon, TrackPhone],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly t = UI_TEXT;
  protected readonly nav = MAIN_NAV;
  protected readonly name = businessName();
  protected readonly phone = BUSINESS.phone;
  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;
  protected readonly phoneLabel = BUSINESS.phone ? formatPhone(BUSINESS.phone) : null;
  protected readonly showTodo = isDevMode();
}
