import type { Service } from './types';

// TODO: konfirmo me ustain tekstet e shërbimeve (çdo fakt teknik rishikohet para publikimit)
export const SERVICES: Service[] = [
  {
    slug: 'konsulence-dhe-zgjedhja-e-sistemit',
    title: 'Konsulencë dhe zgjedhja e sistemit',
    short:
      'Inspektim në vend, llogaritja e fuqisë dhe rekomandimi i sistemit të duhur për ambientin dhe buxhetin tuaj.',
    icon: 'clipboard-check',
  },
  {
    slug: 'montim-split',
    title: 'Montim split',
    short:
      'Një njësi e brendshme dhe një e jashtme, e montuar me vakumim të plotë dhe testim me matje.',
    icon: 'air-conditioning',
  },
  {
    slug: 'montim-multi-split',
    title: 'Montim multi-split',
    short:
      'Një njësi e jashtme me disa koka të brendshme, për apartamente dhe vila me shumë ambiente.',
    icon: 'layout-grid',
  },
  {
    slug: 'sisteme-me-kanale-dhe-dysheme-tavan',
    title: 'Sisteme me kanale dhe dysheme-tavan',
    short:
      'Ajër i shpërndarë në mënyrë të padukshme përmes kanaleve, ose njësi dysheme-tavan për ambiente të mëdha.',
    icon: 'wind',
  },
  {
    slug: 'sisteme-vrf-vrv',
    title: 'Sisteme VRF/VRV',
    short:
      'Sisteme qendrore për ndërtesa, hotele dhe zyra, me kontroll të veçantë për çdo ambient.',
    icon: 'building',
  },
  {
    slug: 'pompa-nxehtesie',
    title: 'Pompa nxehtësie',
    short:
      'Ngrohje efikase për dimrin, me pompë nxehtësie të zgjedhur dhe të montuar sipas ndërtesës.',
    icon: 'temperature-sun',
  },
  {
    slug: 'diagnostikim-dhe-riparim',
    title: 'Diagnostikim dhe riparim',
    short:
      'Kodet e gabimeve, kompresori, pllakat elektronike: gjejmë shkakun para se të ndërrojmë pjesë.',
    icon: 'tool',
  },
  {
    slug: 'kontroll-rrjedhjeje-dhe-rimbushje-gazi',
    title: 'Kontroll rrjedhjeje dhe rimbushje gazi',
    short:
      'Gjejmë dhe riparojmë rrjedhjen me detektor dhe test me azot, pastaj rimbushim gazin në sasinë e saktë.',
    icon: 'droplet',
  },
  {
    slug: 'cmontim-dhe-zhvendosje',
    title: 'Çmontim dhe zhvendosje',
    short:
      'Gazi mblidhet në njësinë e jashtme, aparati çmontohet pa dëmtime dhe rimontohet në vendin e ri.',
    icon: 'truck',
  },
  {
    slug: 'kontrata-mirembajtjeje-per-biznese',
    title: 'Kontrata mirëmbajtjeje për biznese',
    short:
      'Pastrim dhe kontroll periodik për zyra, dyqane dhe hotele, sipas një plani vjetor të rënë dakord.',
    icon: 'calendar-check',
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  SERVICES.find((s) => s.slug === slug);
