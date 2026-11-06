import type { Photo } from './types';
import { placeholder } from './placeholders';

export const ABOUT = {
  eyebrow: 'Rreth ustait',
  title: 'Rreth ustait',
  intro: [
    'Ardit punon prej 4 vitesh me kondicionerë: montim, servis dhe riparim, në shtëpi, zyra dhe ambiente biznesi. Baza është në Tiranë dhe punon në të gjitha qytetet e Shqipërisë.',
    'Ka qenë drejtues i stafit teknik për kondicionerët në kompaninë Neptun, ku ka punuar me të gjitha markat që kompania tregton. Kjo përvojë i ka dhënë njohje të drejtpërdrejtë me modele dhe sisteme të ndryshme, si dhe me defektet që shfaqen më shpesh tek secila.',
    'Zanatin e ka mësuar përmes kurseve profesionale dhe praktikave më të mira të punës europiane, të cilat i zbaton në çdo punë: vakumim i plotë, test presioni me azot dhe testim me matje para dorëzimit.',
    'Deri sot ka kryer rreth 100 montime dhe ka riparuar mbi 350 pajisje, në repart dhe në terren. Çdo montim ka garanci 3-vjeçare mbi punën.',
  ],
  photosTitle: 'Ustai dhe ekipi në punë',
  brandsTitle: 'Markat me të cilat punon',
  authorized: 'Partner i autorizuar',
  ctaTitle: 'Flisni drejtpërdrejt me ustain',
};

/** Foto të ustait dhe ekipit në punë (asnjë foto stock). */
export const ABOUT_PHOTOS: Photo[] = [
  // TODO: foto shembull, zëvendësohet me foton reale
  placeholder('usta-portret-ne-terren', 'portret i ustait në terren, me rrobat e punës'),
  placeholder('ekipi-gjate-montimit', 'ekipi gjatë një montimi'),
  placeholder('usta-me-veglat', 'ustai me veglat profesionale'),
  // TODO: 2–3 foto të ustait dhe ekipit në punë
];
