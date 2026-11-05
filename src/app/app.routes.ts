import { ResolveFn, Routes } from '@angular/router';
import type { RouteSeo } from './core/seo/seo';

const NOT_FOUND_SEO: RouteSeo = { title: 'Faqja nuk u gjet', description: '', noindex: true };

/**
 * SEO e faqes së shërbimit nga services.ts; slug i panjohur → noindex.
 * Import dinamik, që të dhënat e shërbimeve të mos hyjnë në bundle-in fillestar.
 */
const serviceSeo: ResolveFn<RouteSeo> = async (route) => {
  const { serviceBySlug } = await import('./data/services');
  return serviceBySlug(route.paramMap.get('slug') ?? '')?.seo ?? NOT_FOUND_SEO;
};

const placeholder = () =>
  import('./features/placeholder/placeholder-page').then((m) => m.PlaceholderPage);

const notFound = {
  loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  data: { seo: NOT_FOUND_SEO },
};

const page = (h1: string, seo: RouteSeo) => ({ h1, seo });

/** Angular e zëvendëson me false në build-in e prodhimit, ndaj kodi i mëposhtëm hiqet krejt. */
declare const ngDevMode: boolean | undefined;

/** Rrugë vetëm për development: nuk prerenderohen dhe nuk dalin në prodhim. */
const devRoutes: Routes =
  typeof ngDevMode === 'undefined' || ngDevMode
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
    loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
    data: {
      seo: {
        title: 'Montim dhe riparim kondicioneri',
        description:
          'Montim, riparim dhe mirëmbajtje për të gjitha sistemet e kondicionimit: split, multi-split, kanal, VRF/VRV dhe pompa nxehtësie në Tiranë, Durrës e më gjerë.',
      } satisfies RouteSeo,
    },
  },
  {
    path: 'sherbimet',
    loadComponent: () => import('./features/services/services-page').then((m) => m.ServicesPage),
    data: {
      seo: {
        title: 'Shërbimet e kondicionimit',
        description:
          'Konsulencë, montim split dhe multi-split, sisteme me kanale, VRF/VRV, pompa nxehtësie, riparim, rimbushje gazi dhe kontrata mirëmbajtjeje.',
      } satisfies RouteSeo,
    },
  },
  {
    path: 'sherbimet/:slug',
    loadComponent: () => import('./features/services/service-page').then((m) => m.ServicePage),
    resolve: { seo: serviceSeo },
  },
  {
    path: 'standardet-e-montimit',
    loadComponent: () => import('./features/standards/standards-page').then((m) => m.StandardsPage),
    data: {
      seo: {
        title: 'Standardet e montimit',
        description:
          'Vakumim i plotë, test presioni me azot, saldim me azot dhe testim final me matje: si montojmë që kondicioneri të punojë mirë për vite.',
      } satisfies RouteSeo,
    },
  },
  {
    path: 'si-te-zgjidhni-kondicionerin',
    loadComponent: () => import('./features/guide/guide-page').then((m) => m.GuidePage),
    data: {
      seo: {
        title: 'Si të zgjidhni kondicionerin: kalkulatori BTU',
        description:
          'Llogaritni BTU-të e nevojshme për ambientin tuaj dhe krahasoni split, multi-split, kanal, kasetë dhe VRF para se të blini.',
      } satisfies RouteSeo,
    },
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
