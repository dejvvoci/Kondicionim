import type { FaqItem } from './types';

// TODO: konfirmo me ustain përgjigjet (çdo fakt teknik rishikohet para publikimit)
export const FAQ: FaqItem[] = [
  {
    q: 'Sa BTU më duhen për dhomën time?',
    a: 'Varet nga qyteti (sa i ftohtë është dimri dhe sa e nxehtë vera), sipërfaqja, lartësia e tavanit dhe sa mure të jashtme ka ambienti. Kalkulatori llogarit veçmas verën dhe dimrin dhe jep madhësinë që mbulon të dyja; ustai e konfirmon pasi sheh ambientin.',
    home: true,
    link: { label: 'Llogaritni BTU-të me kalkulatorin', path: '/si-te-zgjidhni-kondicionerin' },
  },
  {
    q: 'Pse më pikon kondicioneri brenda?',
    a: 'Shkaqet më të shpeshta janë tubi i kondensatës pa pjerrësi të mjaftueshme ose i bllokuar, filtrat shumë të ndotur ose njësia e montuar jo në nivel. Mos e lini pa kontroll: uji dëmton murin dhe pajisjet elektrike.',
    home: true,
  },
  {
    q: 'Sa shpesh duhet pastruar kondicioneri?',
    a: 'Filtrat e njësisë së brendshme mund t’i pastroni vetë çdo disa javë kur aparati punon shpesh. Pastrimi i plotë i baterive, ventilatorit dhe kondensatës bëhet nga ustai të paktën një herë në vit, mirë është para sezonit.',
    home: true,
  },
  {
    q: 'A ia vlen ngrohja me kondicioner në dimër?',
    a: 'Kondicionerët inverter ngrohin si pompë nxehtësie dhe zakonisht harxhojnë më pak energji se ngrohësit me rezistencë elektrike. Në zona shumë të ftohta ka rëndësi modeli dhe fuqia në temperatura të ulëta; ustai ju këshillon sipas rastit.',
    home: false,
  },
];

export const homeFaq = (): FaqItem[] => FAQ.filter((f) => f.home);
