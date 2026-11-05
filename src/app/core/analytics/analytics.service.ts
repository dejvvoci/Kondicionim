import { DOCUMENT } from '@angular/common';
import { Injectable, inject, isDevMode } from '@angular/core';

/** Event-et e matura. Asnjë e dhënë personale: vetëm slug-e dhe burimi. */
export interface AnalyticsEvents {
  whatsapp_open: { service: string; city: string; source: string };
  phone_click: { source: string };
  btu_calculated: { size: string };
  map_city_click: { city: string };
}

type AnalyticsWindow = Window & {
  /** Plausible (nëse zgjidhet si analitikë pa cookies). */
  plausible?: (name: string, options?: { props: Record<string, string> }) => void;
};

/**
 * Pikë e vetme për analitikën, e pavarur nga ofruesi. Pa skript analitike të ngarkuar, event-et
 * shfaqen vetëm në konsolë gjatë development-it.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly win = inject(DOCUMENT).defaultView as AnalyticsWindow | null;

  track<K extends keyof AnalyticsEvents>(name: K, props: AnalyticsEvents[K]): void {
    if (!this.win) return; // prerender
    this.win.plausible?.(name, { props });
    if (isDevMode()) console.debug('[analytics]', name, props);
  }
}
