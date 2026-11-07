import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icons';
import { UI_TEXT } from '../../../i18n';

/**
 * Kartë (p.sh. shërbimi): ikonë në katror 40px, titull, përshkrim i projektuar dhe link
 * "Më shumë →". Kur ka `link`, e gjithë karta bëhet e klikueshme (stretched link).
 */
@Component({
  selector: 'ui-card',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
  styleUrl: './card.scss',
  host: { '[class.ui-card--link]': '!!link()' },
})
export class Card {
  readonly title = input.required<string>();
  readonly icon = input<IconName>();
  readonly link = input<string>();
  readonly linkLabel = input<string>(UI_TEXT.common.more);
  /** Niveli i titullit, sipas hierarkisë së faqes. */
  readonly level = input<2 | 3 | 4>(3);
}
