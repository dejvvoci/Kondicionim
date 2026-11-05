import type { FaqItem } from './types';

// TODO: konfirmo me ustain përgjigjet (çdo fakt teknik rishikohet para publikimit)
export const FAQ: FaqItem[] = [
  {
    q: 'Sa BTU më duhen për dhomën time?',
    a: 'Varet nga sipërfaqja, lartësia e tavanit, ekspozimi ndaj diellit, kati dhe izolimi. Për një vlerë orientuese përdorni kalkulatorin te udhëzuesi; ustai e konfirmon me inspektim në vend.',
    home: true,
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
    home: true,
  },
  {
    q: 'A mund të dërgoj foto para se të vini?',
    a: 'Po. Pasi të hapet chati në WhatsApp, dërgoni foto të aparatit, të etiketës së tij ose të ambientit. Kështu vijmë të përgatitur me pjesët dhe veglat e duhura.',
    home: true,
  },
];

export const homeFaq = (): FaqItem[] => FAQ.filter((f) => f.home);
