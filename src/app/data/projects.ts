import { placeholder } from './placeholders';
import type { Project, SystemKind } from './types';

/**
 * Portofoli. Për një projekt të ri: shto foto para/pas në public/images/projektet/ (me emër
 * përshkrues, p.sh. vile-multi-split-tirane-para.avif) dhe një objekt këtu, p.sh.
 *
 *   {
 *     slug: 'vile-multi-split-5-koka-tirane',
 *     title: 'Vilë 3-katëshe, multi-split me 5 koka',
 *     city: 'tirane',
 *     system: 'multi-split',
 *     btu: 48000,
 *     duration: '2 ditë',
 *     summary: 'Tubacione të fshehura në mure, një njësi e jashtme në tarracë.',
 *     story: 'Sfida ...\n\nZgjidhja ...',
 *     before: { src: '/images/projektet/vile-tirane-para.avif', alt: '...', width: 1200, height: 900 },
 *     after: { src: '/images/projektet/vile-tirane-pas.avif', alt: '...', width: 1200, height: 900 },
 *     gallery: [],
 *     video: null,
 *     services: ['montim-multi-split'],
 *     featured: true,
 *     date: '2026-06-15',
 *   }
 */
export const PROJECTS: Project[] = [
  // TODO: projektet reale (të paktën 6) me foto para/pas, qytetin, sistemin, BTU dhe kohëzgjatjen.
  // TODO: projektet shembull më poshtë (example: true) janë vetëm për prezantim; fshiji kur
  // vijnë projektet reale. BTU dhe kohëzgjatja mbeten bosh që të mos shfaqen shifra të trilluara.
  ...exampleProjects(),
];

/** Gjashtë projekte shembull, me qytete dhe sisteme të ndryshme, që të shihen filtrat. */
function exampleProjects(): Project[] {
  const story =
    'Këtu ustai shkruan rastin: si ishte ambienti, çfarë kërkonte klienti dhe cila ishte vështirësia.\n\n' +
    'Pastaj zgjidhja: ku u vendosën njësitë, nga kaluan tubat dhe çfarë u bë ndryshe nga zakonisht.\n\n' +
    'Në fund, rezultati dhe çdo detaj teknik që e bën këtë punë të veçantë.';
  const example = (
    n: number,
    p: Pick<Project, 'title' | 'city' | 'system' | 'services' | 'featured'> & {
      place: string;
      before: string;
      after: string;
    },
  ): Project => ({
    slug: `projekt-shembull-${n}`,
    title: `Projekt shembull: ${p.title}`,
    city: p.city,
    system: p.system,
    btu: null,
    duration: null,
    summary: `Përshkrim i shkurtër teknik për ${p.place}: sa njësi, ku u vendosën dhe si kaluan tubat.`,
    story,
    before: placeholder(`projekt-shembull-${n}-para`, `${p.place} para punës: ${p.before}`),
    after: placeholder(`projekt-shembull-${n}-pas`, `${p.place} pas punës: ${p.after}`),
    gallery:
      n === 1
        ? [
            placeholder(`projekt-shembull-${n}-galeri-1`, 'njësia e jashtme e montuar'),
            placeholder(`projekt-shembull-${n}-galeri-2`, 'ustai gjatë vakumimit të linjës'),
            placeholder(`projekt-shembull-${n}-galeri-3`, 'testimi final me matje'),
          ]
        : [],
    video: null,
    services: p.services,
    featured: p.featured,
    date: `2026-0${7 - n}-01`,
    example: true,
  });

  return [
    example(1, {
      title: 'vilë me multi-split',
      city: 'tirane',
      system: 'multi-split',
      services: ['montim-multi-split'],
      featured: true,
      place: 'vila',
      before: 'muri ku do të vendoset njësia e brendshme',
      after: 'njësia e brendshme e montuar, pa tuba të dukshëm',
    }),
    example(2, {
      title: 'apartament me split',
      city: 'durres',
      system: 'split',
      services: ['montim-split'],
      featured: true,
      place: 'apartamenti',
      before: 'dhoma para montimit',
      after: 'kondicioneri i montuar mbi derë',
    }),
    example(3, {
      title: 'zyrë me sistem me kanale',
      city: 'tirane',
      system: 'kanal',
      services: ['sisteme-me-kanale-dhe-dysheme-tavan'],
      featured: true,
      place: 'zyra',
      before: 'tavani i hapur para kanaleve',
      after: 'grilat e ajrit në tavanin e mbyllur',
    }),
    example(4, {
      title: 'hotel me VRF',
      city: 'shkoder',
      system: 'vrf',
      services: ['sisteme-vrf-vrv'],
      featured: false,
      place: 'hoteli',
      before: 'tarraca ku vendosen njësitë e jashtme',
      after: 'njësitë e jashtme VRF të montuara',
    }),
    example(5, {
      title: 'dyqan me kasetë',
      city: 'elbasan',
      system: 'kasete',
      services: ['sisteme-me-kanale-dhe-dysheme-tavan'],
      featured: false,
      place: 'dyqani',
      before: 'tavani i dyqanit',
      after: 'kaseta e montuar në tavan',
    }),
    example(6, {
      title: 'restorant me dysheme-tavan',
      city: 'lezhe',
      system: 'dysheme-tavan',
      services: ['sisteme-me-kanale-dhe-dysheme-tavan'],
      featured: false,
      place: 'restoranti',
      before: 'salla e restorantit para montimit',
      after: 'njësia dysheme-tavan e montuar në sallë',
    }),
  ];
}

export const SYSTEM_LABELS: Record<SystemKind, string> = {
  split: 'Split',
  'multi-split': 'Multi-split',
  kanal: 'Me kanale',
  kasete: 'Kasetë',
  'dysheme-tavan': 'Dysheme-tavan',
  vrf: 'VRF/VRV',
};

/** Më të rejat të parat. */
export const sortedProjects = (): Project[] =>
  [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));

export const projectBySlug = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug);

export const featuredProjects = (): Project[] =>
  sortedProjects()
    .filter((p) => p.featured)
    .slice(0, 3);

export const projectsForService = (serviceSlug: string): Project[] =>
  sortedProjects().filter((p) => p.services.includes(serviceSlug));

export interface ProjectFilter {
  city?: string | null;
  system?: string | null;
}

export function filterProjects(projects: Project[], f: ProjectFilter): Project[] {
  return projects.filter(
    (p) => (!f.city || p.city === f.city) && (!f.system || p.system === f.system),
  );
}
