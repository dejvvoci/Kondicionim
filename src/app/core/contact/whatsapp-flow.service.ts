import { Injectable, computed, isDevMode, signal } from '@angular/core';
import { BUSINESS } from '../../data/business';

/** Nga ku u hap rrjedha WhatsApp (për analitikën). */
export type WhatsAppSource =
  'hero' | 'shiriti' | 'kalkulatori' | 'sherbimi' | 'header' | 'footer' | 'cta';

export interface WhatsAppRequest {
  source: WhatsAppSource;
  /** Slug-u i shërbimit të parazgjedhur, ose 'oferte' për "Ofertë / vlerësim". */
  service?: string;
  /** Shënime të parambushura (p.sh. përmbledhja e kalkulatorit BTU). */
  notes?: string;
}

/**
 * Gjendja e rrjedhës WhatsApp: çdo buton WhatsApp/Ofertë thërret `open()`, dhe sheet-i në App
 * (WhatsAppSheet) shfaqet me formën e shkurtër.
 */
@Injectable({ providedIn: 'root' })
export class WhatsAppFlow {
  private readonly current = signal<WhatsAppRequest | null>(null);

  /** Pa numër WhatsApp, butonat fshihen në prodhim (në development shfaqen me TODO). */
  readonly available = !!BUSINESS.whatsapp || isDevMode();

  readonly request = this.current.asReadonly();
  readonly isOpen = computed(() => this.current() !== null);

  open(request: WhatsAppRequest): void {
    this.current.set(request);
  }

  close(): void {
    this.current.set(null);
  }
}
