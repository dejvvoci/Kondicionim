import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  signal,
  type WritableSignal,
} from '@angular/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import {
  BTU_CONFIG,
  type Floor,
  type Insulation,
  type RoomType,
  type Sun,
} from '../../data/btu-config';
import { GUIDE } from '../../data/guide';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { type BtuInput, calculateBtu, summarize } from './btu';

interface Option<T> {
  value: T;
  label: string;
}

/**
 * Kalkulatori BTU: llogaritje live me signals (pa buton "Llogarit"), logjika në btu.ts.
 * "Konfirmo me inspektim falas" hap WhatsApp me përmbledhjen në shënime.
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

  protected readonly sunOptions: Option<Sun>[] = [
    { value: 'pak', label: 'Pak' },
    { value: 'mesatar', label: 'Mesatar' },
    { value: 'shume', label: 'Shumë' },
  ];
  protected readonly floorOptions: Option<Floor>[] = [
    { value: 'perdhe', label: 'Përdhe' },
    { value: 'ndermjetem', label: 'I ndërmjetëm' },
    { value: 'fundit', label: 'I fundit nën çati' },
  ];
  protected readonly insulationOptions: Option<Insulation>[] = [
    { value: 'mire', label: 'I mirë' },
    { value: 'mesatar', label: 'Mesatar' },
    { value: 'dobet', label: 'I dobët' },
  ];
  protected readonly roomOptions: Option<RoomType>[] = [
    { value: 'gjumi', label: 'Dhomë gjumi' },
    { value: 'ndenjie', label: 'Dhomë ndenjie' },
    { value: 'kuzhine', label: 'Kuzhinë' },
    { value: 'zyre', label: 'Zyrë' },
    { value: 'dyqan', label: 'Dyqan' },
  ];

  protected readonly area = signal(20);
  protected readonly height = signal<number>(BTU_CONFIG.limits.height.default);
  protected readonly sun = signal<Sun>('mesatar');
  protected readonly floor = signal<Floor>('ndermjetem');
  protected readonly insulation = signal<Insulation>('mesatar');
  protected readonly room = signal<RoomType>('gjumi');
  protected readonly persons = signal<number>(BTU_CONFIG.limits.persons.default);
  /** Event-i btu_calculated dërgohet vetëm pasi përdoruesi ka ndryshuar diçka. */
  private readonly touched = signal(false);

  protected readonly input = computed<BtuInput>(() => ({
    area: this.area(),
    height: this.height(),
    sun: this.sun(),
    floor: this.floor(),
    insulation: this.insulation(),
    room: this.room(),
    persons: this.persons(),
  }));
  protected readonly result = computed(() => calculateBtu(this.input()));
  protected readonly btuLabel = computed(() =>
    new Intl.NumberFormat('sq-AL').format(this.result().btu),
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // Kalkulatori hidratohet kur shfaqet në ekran. Nëse përdoruesi ka shkruar para kësaj,
    // vlerat merren nga fushat, që rezultati të përputhet me atë që shihet.
    afterNextRender(() => this.syncFromDom());

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
    const syncChoice = <T extends string>(
      selector: string,
      options: readonly Option<T>[],
      target: WritableSignal<T>,
    ) => {
      const value = root.querySelector<HTMLInputElement | HTMLSelectElement>(selector)?.value;
      const option = options.find((o) => o.value === value);
      if (option && option.value !== target()) this.setChoice(target, option.value);
    };
    syncNumber('btu-area', this.area);
    syncNumber('btu-height', this.height);
    syncNumber('btu-persons', this.persons);
    syncChoice('[name="btu-sun"]:checked', this.sunOptions, this.sun);
    syncChoice('[name="btu-floor"]:checked', this.floorOptions, this.floor);
    syncChoice('[name="btu-insulation"]:checked', this.insulationOptions, this.insulation);
    syncChoice('#btu-room', this.roomOptions, this.room);
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

  protected selectValue(event: Event): RoomType {
    return (event.target as HTMLSelectElement).value as RoomType;
  }

  protected confirm(): void {
    this.flow.open({
      source: 'kalkulatori',
      service: 'konsulence-dhe-zgjedhja-e-sistemit',
      notes: summarize(this.input(), this.result()),
    });
  }
}
