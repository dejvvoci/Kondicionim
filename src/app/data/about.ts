import type { Certification, Photo } from './types';
import { placeholder } from './placeholders';

export const ABOUT = {
  eyebrow: 'Rreth ustait',
  title: 'Rreth ustait',
  // TODO: prezantimi i ustait (kush është, që kur punon, si e ka mësuar zanatin), 2–3 paragrafë.
  intro: [] as string[],
  photosTitle: 'Ustai dhe ekipi në punë',
  certificationsTitle: 'Certifikatat dhe trajnimet',
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

export const CERTIFICATIONS: Certification[] = [
  // TODO: certifikatat (trajnime nga prodhuesit, F-gas nëse ka, kualifikime elektrike) me foto
  // p.sh. { title: 'Certifikim F-gas', issuer: '...', year: 2022, photo: { src: '/images/certifikata/f-gas.avif', alt: '...', width: 1200, height: 850 } }
];
