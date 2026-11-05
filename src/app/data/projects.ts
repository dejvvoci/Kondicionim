import type { Project, SystemKind } from './types';

/**
 * Portofoli. Për një projekt të ri: shto foto para/pas në public/images/projektet/ (me emër
 * përshkrues, p.sh. vile-multi-split-tirane-para.avif) dhe një objekt këtu.
 */
export const PROJECTS: Project[] = [
  // TODO: projektet reale (të paktën 6) me foto para/pas, qytetin, sistemin, BTU dhe kohëzgjatjen.
  // Shembull:
  // {
  //   slug: 'vile-multi-split-5-koka-tirane',
  //   title: 'Vilë 3-katëshe, multi-split me 5 koka',
  //   city: 'tirane',
  //   system: 'multi-split',
  //   btu: 48000,
  //   duration: '2 ditë',
  //   summary: 'Tubacione të fshehura në mure, një njësi e jashtme në tarracë.',
  //   story: 'Sfida ...\n\nZgjidhja ...',
  //   before: { src: '/images/projektet/vile-tirane-para.avif', alt: '...', width: 1200, height: 900 },
  //   after: { src: '/images/projektet/vile-tirane-pas.avif', alt: '...', width: 1200, height: 900 },
  //   gallery: [],
  //   video: null,
  //   services: ['montim-multi-split'],
  //   featured: true,
  //   date: '2026-06-15',
  // },
];

export const SYSTEM_LABELS: Record<SystemKind, string> = {
  split: 'Split',
  'multi-split': 'Multi-split',
  kanal: 'Me kanale',
  kasete: 'Kasetë',
  'dysheme-tavan': 'Dysheme-tavan',
  vrf: 'VRF/VRV',
  'pompe-nxehtesie': 'Pompë nxehtësie',
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
