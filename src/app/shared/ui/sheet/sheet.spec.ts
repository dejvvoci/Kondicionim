import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Sheet } from './sheet';

@Component({
  imports: [Sheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button id="opener" (click)="open.set(true)">Hap</button>
    <ui-sheet title="Test sheet" [(open)]="open"><p>Përmbajtja</p></ui-sheet>
  `,
})
class Host {
  readonly open = signal(false);
}

describe('Sheet', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    document.body.appendChild(el);
    const dialog = el.querySelector('dialog') as HTMLDialogElement;
    return { fixture, el, dialog, host: fixture.componentInstance };
  }

  it('ka dialog të etiketuar nga titulli', async () => {
    const { dialog } = await setup();
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(labelledBy).toBe('test-sheet-sheet');
    expect(dialog.querySelector(`#${labelledBy}`)?.textContent).toBe('Test sheet');
  });

  it('hapet kur open=true dhe mbyllet me butonin ✕', async () => {
    const { fixture, dialog, host } = await setup();
    host.open.set(true);
    await fixture.whenStable();
    expect(dialog.open).toBe(true);
    expect(document.documentElement.classList.contains('has-modal')).toBe(true);

    (dialog.querySelector('.sheet__close') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(host.open()).toBe(false);
    expect(dialog.open).toBe(false);
  });

  it('mbyllet me klik mbi backdrop, jo mbi përmbajtjen', async () => {
    const { fixture, dialog, host } = await setup();
    host.open.set(true);
    await fixture.whenStable();

    (dialog.querySelector('p') as HTMLElement).click();
    await fixture.whenStable();
    expect(host.open()).toBe(true);

    dialog.click();
    await fixture.whenStable();
    expect(host.open()).toBe(false);
  });

  it('sinkronizon gjendjen kur browser-i e mbyll (Esc)', async () => {
    const { fixture, dialog, host } = await setup();
    host.open.set(true);
    await fixture.whenStable();

    // Esc: browser-i e mbyll dialogun dhe lëshon 'close'.
    dialog.removeAttribute('open');
    dialog.dispatchEvent(new Event('close'));
    await fixture.whenStable();
    expect(host.open()).toBe(false);
    expect(document.documentElement.classList.contains('has-modal')).toBe(false);
  });
});
