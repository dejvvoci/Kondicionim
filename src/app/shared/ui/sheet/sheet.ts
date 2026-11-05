import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { UI_TEXT } from '../../../i18n';
import { Icon } from '../icon/icon';
import { slugify } from '../../utils/slugify';

/**
 * Bottom sheet në celular, modal në desktop, mbi <dialog> nativ me showModal():
 * pjesa tjetër e faqes bëhet inerte (focus trap), Esc mbyll, klik jashtë mbyll,
 * fokusi kthehet te butoni që e hapi.
 */
@Component({
  selector: 'ui-sheet',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sheet.html',
  styleUrl: './sheet.scss',
})
export class Sheet {
  readonly open = model(false);
  readonly title = input.required<string>();

  protected readonly t = UI_TEXT;
  protected readonly titleId = computed(() => `${slugify(this.title())}-sheet`);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly doc = inject(DOCUMENT);
  private opener: HTMLElement | null = null;

  constructor() {
    // Vetëm në browser: afterRenderEffect nuk ekzekutohet gjatë prerender-it.
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      const shouldOpen = this.open();
      if (shouldOpen && !dialog.open) this.show(dialog);
      if (!shouldOpen && dialog.open) this.hide(dialog);
    });
  }

  close(): void {
    this.open.set(false);
  }

  /** Klik mbi backdrop: target-i është vetë <dialog>, jo përmbajtja. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  /** Esc ose mbyllje nga browser-i: sinkronizo gjendjen dhe kthe fokusin. */
  protected onClosed(): void {
    this.open.set(false);
    this.doc.documentElement.classList.remove('has-modal');
    this.opener?.focus();
    this.opener = null;
  }

  private show(dialog: HTMLDialogElement): void {
    this.opener = this.doc.activeElement as HTMLElement | null;
    this.doc.documentElement.classList.add('has-modal');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  /** Mjedise pa <dialog> të plotë (browser-a të vjetër, jsdom): i njëjti efekt si close(). */
  private hide(dialog: HTMLDialogElement): void {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    }
  }
}
