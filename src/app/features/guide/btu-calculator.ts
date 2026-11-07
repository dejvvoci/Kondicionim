import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  type WritableSignal,
} from '@angular/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { BTU_CONFIG, type ExteriorWalls, type Floor, type Insulation } from '../../data/btu-config';
import { CITIES } from '../../data/cities';
import { GUIDE } from '../../data/guide';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { type BtuInput, calculateBtu, summarize } from './btu';

interface Option<T> {
  value: T;
  label: string;
}

/** Nën këtë temperaturë dimri shfaqet shënimi për modelet që ngrohin mirë në të ftohtë. */
const COLD_WINTER = -5;

/**
 * Kalkulatori BTU: llogaritje live me signals (pa buton "Llogarit"), logjika në btu.ts.
 * Llogarit verën dhe dimrin veçmas dhe rekomandon madhësinë që mbulon të dyja.
 * "Kërko çmimin në WhatsApp" hap WhatsApp me përmbledhjen në shënime.
 */
@Component({
  selector: 'app-btu-calculator',
  imports: [Button, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './btu-calculator.html',
  styleUrl: './btu-calculator.scss',
})
export class BtuCalculator {
  protected readonly t = GUIDE.calculator;
  protected readonly limits = BTU_CONFIG.limits;
  protected readonly maxSize = BTU_CONFIG.sizes.at(-1);
  protected readonly flow = inject(WhatsAppFlow);
  private readonly analytics = inject(AnalyticsService);

  protected readonly cityOptions: Option<string>[] = CITIES.filter(
    (c) => c.slug in BTU_CONFIG.cities,
  ).map((c) => ({ value: c.slug, label: c.name }));
  protected readonly wallOptions: Option<ExteriorWalls>[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2 (qoshe)' },
    { value: 3, label: '3' },
  ];
  protected readonly insulationOptions: Option<Insulation>[] = [
    { value: 'mire', label: 'I mirë' },
    { value: 'mesatar', label: 'Mesatar' },
    { value: 'dobet', label: 'I dobët' },
  ];
  protected readonly floorOptions: Option<Floor>[] = [
    { value: 'perdhe', label: 'Përdhe' },
    { value: 'ndermjetem', label: 'I ndërmjetëm' },
    { value: 'fundit', label: 'I fundit' },
  ];

  protected readonly city = signal('tirane');
  protected readonly area = signal(20);
  protected readonly height = signal<number>(BTU_CONFIG.limits.height.default);
  protected readonly walls = signal<ExteriorWalls>(1);
  protected readonly insulation = signal<Insulation>('mesatar');
  protected readonly floor = signal<Floor>('ndermjetem');
  /** Event-i btu_calculated dërgohet vetëm pasi përdoruesi ka ndryshuar diçka. */
  private readonly touched = signal(false);

  protected readonly input = computed<BtuInput>(() => ({
    city: this.city(),
    area: this.area(),
    height: this.height(),
    walls: this.walls(),
    insulation: this.insulation(),
    floor: this.floor(),
  }));
  protected readonly result = computed(() => calculateBtu(this.input()));
  private readonly fmt = new Intl.NumberFormat('sq-AL');
  protected readonly coolingLabel = computed(() => this.fmt.format(this.result().cooling));
  protected readonly heatingLabel = computed(() => this.fmt.format(this.result().heating));
  protected readonly coldWinter = computed(() => {
    const station = BTU_CONFIG.cities[this.city()];
    return !!station && BTU_CONFIG.stations[station].winter <= COLD_WINTER;
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // Kalkulatori hidratohet kur shfaqet në ekran. Nëse përdoruesi ka shkruar para kësaj, vlerat
    // merren nga fushat e prerenderuara tani, para se render-i i parë të shkruajë vlerat fillestare
    // në to. (Pa hidratim, host-i është ende bosh këtu dhe nuk ndodh asgjë.)
    this.syncFromDom();

    // Një event pasi vlera qetësohet, jo në çdo shkronjë (vetëm në browser).
    afterRenderEffect((onCleanup) => {
      const size = this.result().size;
      if (!this.touched()) return;
      const timer = setTimeout(
        () => this.analytics.track('btu_calculated', { size: size ? String(size) : 'mbi-max' }),
        1500,
      );
      onCleanup(() => clearTimeout(timer));
    });
  }

  private syncFromDom(): void {
    const root = this.host.nativeElement;
    const syncNumber = (id: string, target: WritableSignal<number>) => {
      const value = root.querySelector<HTMLInputElement>(`#${id}`)?.value;
      if (value !== undefined && value !== String(target())) this.applyNumber(target, value);
    };
    const syncChoice = <T extends string | number>(
      selector: string,
      options: readonly Option<T>[],
      target: WritableSignal<T>,
    ) => {
      const value = root.querySelector<HTMLInputElement | HTMLSelectElement>(selector)?.value;
      const option = options.find((o) => String(o.value) === value);
      if (option && option.value !== target()) this.setChoice(target, option.value);
    };
    syncChoice('#btu-city', this.cityOptions, this.city);
    syncNumber('btu-area', this.area);
    syncNumber('btu-height', this.height);
    syncChoice('[name="btu-walls"]:checked', this.wallOptions, this.walls);
    syncChoice('[name="btu-insulation"]:checked', this.insulationOptions, this.insulation);
    syncChoice('[name="btu-floor"]:checked', this.floorOptions, this.floor);
  }

  protected setNumber(target: WritableSignal<number>, event: Event): void {
    this.applyNumber(target, (event.target as HTMLInputElement).value);
  }

  private applyNumber(target: WritableSignal<number>, value: string): void {
    const raw = value.replace(',', '.');
    target.set(raw === '' ? NaN : Number(raw));
    this.touched.set(true);
  }

  protected setChoice<T>(target: WritableSignal<T>, value: T): void {
    target.set(value);
    this.touched.set(true);
  }

  protected selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected confirm(): void {
    const cityName = this.cityOptions.find((c) => c.value === this.city())?.label ?? '';
    this.flow.open({
      source: 'kalkulatori',
      service: 'konsulence-dhe-zgjedhja-e-sistemit',
      notes: summarize(this.input(), this.result(), cityName),
    });
  }
}
