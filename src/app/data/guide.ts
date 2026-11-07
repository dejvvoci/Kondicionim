import type { IconKey } from './types';

export interface SystemType {
  slug: string;
  title: string;
  icon: IconKey;
  /** Kur ia vlen. */
  bestFor: string;
  pros: string[];
  limits: string[];
  /** Shërbimi përkatës, për lidhjen "Më shumë". */
  serviceSlug: string;
}

export interface GuideTopic {
  title: string;
  text: string;
}

// TODO: konfirmo me ustain tekstet e udhëzuesit (çdo fakt teknik rishikohet para publikimit)
export const GUIDE = {
  title: 'Si të zgjidhni kondicionerin',
  lead: 'Llogaritni fuqinë e nevojshme për ambientin tuaj, pastaj krahasoni llojet e sistemeve. Ustai e konfirmon zgjedhjen në vend.',
  calculator: {
    eyebrow: 'Kalkulatori BTU',
    title: 'Sa BTU ju duhen?',
    lead: 'Plotësoni të dhënat e ambientit: rezultati përditësohet menjëherë. Llogaritja supozon që aparati përdoret edhe për verë edhe për dimër.',
    note: 'Vlerë orientuese: nxehtësia që hyn në ditën më të nxehtë dhe që del në natën më të ftohtë të qytetit tuaj (të dhënat klimatike ASHRAE). Llogaritja merr ambientin e zakonshëm: kat i ndërmjetëm, mure pa termokapot, dritare dopio 1/8 e dyshemesë dhe 2 persona. Në katin e fundit, përdhe ose me dritare të vjetra nevoja është më e madhe. Ustai e konfirmon pasi sheh ambientin.',
    confirm: 'Kërko çmimin në WhatsApp',
    resultLabel: 'Madhësia e rekomanduar',
    overTitle: 'Një aparat i vetëm nuk mjafton',
    overText:
      'Për këtë ambient ia vlen një sistem multi-split ose VRF. Ustai e përcakton saktë me inspektim.',
    factorsTitle: 'Kushtet e llogaritjes',
    summer: 'Vera (ftohje)',
    winter: 'Dimri (ngrohje)',
    bySummer: 'Madhësia mbulon të dy sezonet; e përcakton vera.',
    byWinter: 'Madhësia mbulon të dy sezonet; e përcakton dimri.',
    cityHelp: 'Nëse qyteti juaj nuk është në listë, zgjidhni më të afërtin me klimë të ngjashme.',
    wallsHelp: 'Muret që kanë jashtë rrugën ose oborrin, jo apartamentin fqinj.',
    coldNote:
      'Në zonat e ftohta zgjidhni një model që e ruan fuqinë e ngrohjes nën zero; ustai ju këshillon për modelin.',
  },
  comparison: {
    eyebrow: 'Llojet e sistemeve',
    title: 'Split, multi-split apo VRF?',
    bestFor: 'Kur ia vlen',
    pros: 'Avantazhet',
    limits: 'Kufizimet',
  },
  topics: {
    eyebrow: 'Para se të blini',
    title: 'Çfarë tjetër ka rëndësi',
  },
  cta: {
    title: 'Kontaktoni për të marrë çmimin',
    lead: 'Ustai vjen, mat ambientin dhe ju thotë cili sistem dhe sa BTU ju duhen.',
  },
} as const;

export const SYSTEM_TYPES: SystemType[] = [
  {
    slug: 'split',
    title: 'Split',
    icon: 'air-conditioning',
    bestFor: 'Një ose dy ambiente, kur secili ka mur të jashtëm afër.',
    pros: [
      'Zgjidhja më ekonomike për një ambient',
      'Montim i shpejtë',
      'I pavarur nga aparatet e tjera',
    ],
    limits: ['Një njësi e jashtme për çdo aparat', 'Njësia e brendshme duket në mur'],
    serviceSlug: 'montim-split',
  },
  {
    slug: 'multi-split',
    title: 'Multi-split',
    icon: 'layout-grid',
    bestFor: 'Apartamente dhe vila me 2–5 ambiente, kur fasada ka pak vend.',
    pros: [
      'Një njësi e jashtme për disa ambiente',
      'Fasadë më e pastër',
      'Kontroll i veçantë për çdo dhomë',
    ],
    limits: [
      'Nëse njësia e jashtme ndalet, ndalen të gjitha kokat',
      'Kërkon planifikim të linjave që në fillim',
    ],
    serviceSlug: 'montim-multi-split',
  },
  {
    slug: 'vrf',
    title: 'VRF/VRV',
    icon: 'building',
    bestFor: 'Hotele, zyra dhe ndërtesa me shumë ambiente që punojnë çdo ditë.',
    pros: [
      'Shumë njësi të brendshme në një sistem',
      'Fuqia rregullohet sipas nevojës së çdo ambienti',
      'Kontroll qendror',
    ],
    limits: ['Investim fillestar më i lartë', 'Kërkon projektim dhe montim të specializuar'],
    serviceSlug: 'sisteme-vrf-vrv',
  },
];

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    title: 'Inverter apo jo-inverter',
    text: 'Aparati inverter e rregullon fuqinë në vend që të ndizet e fiket vazhdimisht. Mban temperaturë më të qëndrueshme, bën më pak zhurmë dhe zakonisht harxhon më pak energji, sidomos kur punon shumë orë në ditë.',
  },
  {
    title: 'Klasa e energjisë',
    text: 'Etiketa e energjisë tregon efikasitetin në ftohje (SEER) dhe në ngrohje (SCOP). Sa më të larta këto vlera, aq më pak harxhon aparati për të njëjtën punë. Krahasoni vlerat, jo vetëm shkronjën e klasës.',
  },
  {
    title: 'Niveli i zhurmës',
    text: 'Për dhomat e gjumit shikoni zhurmën e njësisë së brendshme në shpejtësinë më të ulët (dB). Edhe montimi ka rëndësi: njësia e jashtme me tampona antivibrim dhe tuba të fiksuar mirë është më e qetë.',
  },
  {
    title: 'Ngrohja në dimër',
    text: 'Nëse do ta përdorni edhe për ngrohje, shikoni fuqinë dhe efikasitetin në temperatura të ulëta jashtë. Në zona të ftohta ka rëndësi modeli; ustai ju këshillon sipas zonës ku jetoni.',
  },
];
