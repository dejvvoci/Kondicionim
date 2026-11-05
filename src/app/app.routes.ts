import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import type { RouteSeo } from './core/seo/seo';

const placeholder = () =>
  import('./features/placeholder/placeholder-page').then((m) => m.PlaceholderPage);

const notFound = {
  loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  data: { seo: { title: 'Faqja nuk u gjet', description: '', noindex: true } satisfies RouteSeo },
};

const page = (h1: string, seo: RouteSeo) => ({ h1, seo });

/** Rrugë vetëm për development: nuk prerenderohen dhe nuk dalin në prodhim. */
const devRoutes: Routes = isDevMode()
  ? [
      {
        path: 'stili',
        loadComponent: () =>
          import('./features/style-guide/style-guide-page').then((m) => m.StyleGuidePage),
        data: { seo: { title: 'Stili', description: '', noindex: true } satisfies RouteSeo },
      },
    ]
  : [];

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: placeholder,
    data: page('Montim, riparim dhe mirëmbajtje për të gjitha sistemet e kondicionimit', {
      title: 'Montim dhe riparim kondicioneri',
      description:
        'Montim, riparim dhe mirëmbajtje për të gjitha sistemet e kondicionimit: split, multi-split, kanal, VRF/VRV dhe pompa nxehtësie në Tiranë, Durrës e më gjerë.',
    }),
  },
  {
    path: 'sherbimet',
    loadComponent: placeholder,
    data: page('Shërbimet', {
      title: 'Shërbimet e kondicionimit',
      description:
        'Konsulencë, montim split dhe multi-split, sisteme me kanale, VRF/VRV, pompa nxehtësie, riparim, rimbushje gazi dhe kontrata mirëmbajtjeje.',
    }),
  },
  {
    path: 'standardet-e-montimit',
    loadComponent: placeholder,
    data: page('Standardet tona të montimit', {
      title: 'Standardet e montimit',
      description:
        'Vakumim i plotë, test presioni me azot, saldim me azot dhe testim final me matje: si montojmë që kondicioneri të punojë mirë për vite.',
    }),
  },
  {
    path: 'si-te-zgjidhni-kondicionerin',
    loadComponent: placeholder,
    data: page('Si të zgjidhni kondicionerin', {
      title: 'Si të zgjidhni kondicionerin',
      description:
        'Llogaritni BTU-të e nevojshme për ambientin tuaj dhe krahasoni split, multi-split, kanal, kasetë dhe VRF para se të blini.',
    }),
  },
  {
    path: 'rreth-ustait',
    loadComponent: placeholder,
    data: page('Rreth ustait', {
      title: 'Rreth ustait',
      description: 'Përvoja, certifikatat dhe markat me të cilat punon ustai ynë i kondicionimit.',
    }),
  },
  {
    path: 'projektet',
    loadComponent: placeholder,
    data: page('Projektet', {
      title: 'Projektet: para dhe pas montimit',
      description:
        'Projekte reale montimi kondicionerësh në shtëpi, vila, zyra dhe hotele, me foto para dhe pas dhe detaje teknike.',
    }),
  },
  {
    path: 'cmimet-dhe-garancia',
    loadComponent: placeholder,
    data: page('Çmimet dhe garancia', {
      title: 'Çmimet dhe garancia',
      description:
        'Çmime orientuese për montim, pastrim dhe diagnostikim, çfarë përfshin montimi standard dhe çfarë mbulon garancia mbi punën.',
    }),
  },
  {
    path: 'pyetje-te-shpeshta',
    loadComponent: placeholder,
    data: page('Pyetje të shpeshta', {
      title: 'Pyetje të shpeshta për kondicionerët',
      description:
        'Përgjigje të shkurtra për montimin, mirëmbajtjen, defektet dhe zgjedhjen e kondicionerit.',
    }),
  },
  {
    path: 'keshilla',
    loadComponent: placeholder,
    data: page('Këshilla', {
      title: 'Këshilla për kondicionerin',
      description:
        'Pse pikon kondicioneri, pse nuk ftoh, sa shpesh pastrohet dhe çfarë do të thonë kodet e gabimeve: këshilla nga ustai.',
    }),
  },
  {
    path: 'privatesia',
    loadComponent: placeholder,
    data: page('Politika e privatësisë', {
      title: 'Politika e privatësisë',
      description:
        'Si i trajtojmë të dhënat: analitika pa cookies, vendndodhja vetëm me pëlqimin tuaj dhe kontakti përmes WhatsApp.',
    }),
  },
  ...devRoutes,
  // Prerenderohet si 404.html (scripts/postbuild.ts) për hostimin statik.
  {
    path: '404',
    ...notFound,
  },
  {
    path: '**',
    ...notFound,
  },
];
