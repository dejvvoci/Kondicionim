import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { ServicePage } from './service-page';

describe('ServicePage', () => {
  async function render(slug: string) {
    await TestBed.configureTestingModule({
      imports: [ServicePage],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ServicePage);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shfaq shërbimin nga services.ts', async () => {
    const el = await render('montim-multi-split');
    expect(el.querySelector('h1')?.textContent).toBe('Montim multi-split');
    expect(el.querySelectorAll('.checklist li').length).toBeGreaterThanOrEqual(3);
    expect(el.querySelectorAll('ui-accordion-item').length).toBeGreaterThanOrEqual(2);
    expect(el.querySelector('ui-breadcrumbs')?.textContent).toContain('Shërbimet');
  });

  it('lidh 3 shërbime të tjera, pa veten', async () => {
    const el = await render('montim-split');
    const links = [...el.querySelectorAll<HTMLAnchorElement>('app-service-grid a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(links).toHaveLength(3);
    expect(links).not.toContain('/sherbimet/montim-split');
  });

  it('butoni WhatsApp parazgjedh shërbimin', async () => {
    const el = await render('sisteme-vrf-vrv');
    const flow = TestBed.inject(WhatsAppFlow);
    el.querySelector<HTMLButtonElement>('.actions button')?.click();
    expect(flow.request()).toEqual({ source: 'sherbimi', service: 'sisteme-vrf-vrv' });
  });

  it('slug i panjohur shfaq faqen 404', async () => {
    const el = await render('nuk-ekziston');
    expect(el.querySelector('h1')?.textContent).toBe('Faqja nuk u gjet');
  });
});
