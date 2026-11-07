import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  isDevMode,
  linkedSignal,
} from '@angular/core';
import { BUSINESS, WHATSAPP_TEMPLATE } from '../../data/business';
import { activeCities } from '../../data/cities';
import { SERVICES, SERVICE_CATEGORIES, servicesIn } from '../../data/services';
import { UI_TEXT } from '../../i18n';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Sheet } from '../../shared/ui/sheet/sheet';
import { AnalyticsService } from '../analytics/analytics.service';
import { loadPrefs, savePrefs } from './contact-prefs';
import { type Coords, type LocationError, requestLocation } from './geolocation';
import { buildMessage, buildWhatsAppUrl, mapsUrl } from './whatsapp';
import { WhatsAppFlow, type WhatsAppRequest } from './whatsapp-flow.service';

const OFFER = 'oferte';
const OTHER = 'tjeter';

type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; coords: Coords }
  | { status: 'error'; error: LocationError };

/**
 * Rrjedha e kontaktit (zëvendëson formularin): shërbimi, qyteti, adresa, vendndodhja dhe
 * shënimet → mesazh i parambushur në WhatsApp. Asgjë nuk dërgohet në ndonjë server.
 */
@Component({
  selector: 'app-whatsapp-sheet',
  imports: [Sheet, Button, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './whatsapp-sheet.html',
  styleUrl: './whatsapp-sheet.scss',
})
export class WhatsAppSheet {
  protected readonly t = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  private readonly analytics = inject(AnalyticsService);
  private readonly win = inject(DOCUMENT).defaultView;

  protected readonly OFFER = OFFER;
  protected readonly OTHER = OTHER;
  protected readonly categories = SERVICE_CATEGORIES;
  protected readonly servicesIn = servicesIn;
  protected readonly cities = activeCities();
  protected readonly number = BUSINESS.whatsapp;
  protected readonly showTodo = isDevMode();

  // Fushat rinisen sa herë hapet rrjedha me një kërkesë të re.
  protected readonly service = linkedSignal(() => this.initialService(this.flow.request()));
  protected readonly city = this.resetOnOpen(() => this.initialCity());
  protected readonly cityOther = this.resetOnOpen(() => '');
  protected readonly address = this.resetOnOpen(() => '');
  protected readonly notes = linkedSignal(() => this.flow.request()?.notes ?? '');
  protected readonly location = this.resetOnOpen<LocationState>(() => ({ status: 'idle' }));

  protected readonly message = computed(() => {
    const loc = this.location();
    return buildMessage(WHATSAPP_TEMPLATE, {
      sherbimi: this.serviceLabel(this.service()),
      qyteti: this.cityLabel(),
      adresa: this.address(),
      lat: loc.status === 'ok' ? loc.coords.lat.toFixed(5) : null,
      lng: loc.status === 'ok' ? loc.coords.lng.toFixed(5) : null,
      shenime: this.notes(),
    });
  });

  protected readonly sendUrl = computed(() =>
    this.number ? buildWhatsAppUrl(this.number, this.message()) : null,
  );
  protected readonly skipUrl = this.number
    ? buildWhatsAppUrl(this.number, WHATSAPP_TEMPLATE[0])
    : null;
  protected readonly mapsLink = computed(() => {
    const loc = this.location();
    return loc.status === 'ok' ? mapsUrl(loc.coords.lat, loc.coords.lng) : null;
  });

  protected onOpenChange(open: boolean): void {
    if (!open) this.flow.close();
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }

  protected async addLocation(): Promise<void> {
    this.location.set({ status: 'loading' });
    try {
      const coords = await requestLocation(this.win?.navigator.geolocation);
      this.location.set({ status: 'ok', coords });
    } catch (error) {
      this.location.set({ status: 'error', error: error as LocationError });
    }
  }

  protected removeLocation(): void {
    this.location.set({ status: 'idle' });
  }

  /** Linku hapet nga vetë <a target="_blank">; këtu vetëm ruhen preferencat dhe matet. */
  protected onSend(filled: boolean): void {
    const source = this.flow.request()?.source ?? 'cta';
    if (filled) {
      savePrefs(this.storage(), { service: this.service(), city: this.city() });
    }
    this.analytics.track('whatsapp_open', {
      service: filled ? this.service() || 'pa-zgjedhur' : 'pa-plotesuar',
      city: filled ? this.city() || 'pa-zgjedhur' : 'pa-plotesuar',
      source,
    });
    this.flow.close();
  }

  private resetOnOpen<T>(initial: () => T) {
    return linkedSignal<WhatsAppRequest | null, T>({
      source: this.flow.request,
      computation: initial,
    });
  }

  private initialCity(): string {
    const saved = loadPrefs(this.storage()).city;
    return this.cities.find((c) => c.slug === saved)?.slug ?? '';
  }

  private initialService(request: WhatsAppRequest | null): string {
    const wanted = request?.service ?? loadPrefs(this.storage()).service ?? '';
    const valid = wanted === OFFER || wanted === OTHER || SERVICES.some((s) => s.slug === wanted);
    return valid ? wanted : '';
  }

  private serviceLabel(slug: string): string {
    if (slug === OFFER) return this.t.serviceOffer;
    if (slug === OTHER) return this.t.serviceOther;
    return SERVICES.find((s) => s.slug === slug)?.title ?? '';
  }

  private cityLabel(): string {
    const slug = this.city();
    if (slug === OTHER) return this.cityOther().trim() || this.t.cityOther;
    return this.cities.find((c) => c.slug === slug)?.name ?? '';
  }

  private storage(): Storage | undefined {
    try {
      return this.win?.localStorage;
    } catch {
      return undefined;
    }
  }
}
