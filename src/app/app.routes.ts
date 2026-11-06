import { ResolveFn, Routes } from '@angular/router';
import { articleJsonLd, faqJsonLd, serviceJsonLd } from './core/seo/json-ld';
import { type RouteSeo, buildCanonical, truncate } from './core/seo/seo';
import { BUSINESS, businessName } from './data/business';

const NOT_FOUND_SEO: RouteSeo = { title: 'Faqja nuk u gjet', description: '', noindex: true };

/*
 * Resolver-at e SEO-së lexojnë të dhënat me import dinamik, që shërbimet, artikujt dhe
 * pyetjet të mos hyjnë në bundle-in fillestar. Slug i panjohur → 404 (noindex).
 */

const serviceSeo: ResolveFn<RouteSeo> = async (route, state) => {
  const [{ serviceBySlug }, { pricesFor }, { activeCities }] = await Promise.all([
    import('./data/services'),
    import('./data/prices'),
    import('./data/cities'),
  ]);
  const service = serviceBySlug(route.paramMap.get('slug') ?? '');
  if (!service) return NOT_FOUND_SEO;
  return {
    ...service.seo,
    jsonLd: [
      serviceJsonLd({
        service,
        siteUrl: BUSINESS.siteUrl,
        url: buildCanonical(state.url),
        cities: activeCities(),
        prices: pricesFor(service.slug),
      }),
    ],
  };
};

const projectSeo: ResolveFn<RouteSeo> = async (route) => {
  const { projectBySlug } = await import('./data/projects');
  const p = projectBySlug(route.paramMap.get('slug') ?? '');
  return p ? { title: p.title, description: truncate(p.summary), image: p.after } : NOT_FOUND_SEO;
};

const articleSeo: ResolveFn<RouteSeo> = async (route, state) => {
  const { ARTICLES } = await import('./data/articles.generated');
  const article = ARTICLES.find((x) => x.slug === route.paramMap.get('slug'));
  if (!article) return NOT_FOUND_SEO;
  return {
    title: article.title,
    description: article.description,
    type: 'article',
    publishedTime: article.date,
    jsonLd: [
      articleJsonLd({
        article,
        siteUrl: BUSINESS.siteUrl,
        url: buildCanonical(state.url),
        name: businessName(),
      }),
    ],
  };
};

const FAQ_SEO: RouteSeo = {
  title: 'Pyetje të shpeshta për kondicionerët',
  description:
    'Përgjigje të shkurtra për montimin, mirëmbajtjen, defektet dhe zgjedhjen e kondicionerit, të grupuara sipas shërbimit.',
};

/** FAQPage me të njëjtat pyetje që shfaq faqja: të përgjithshmet dhe ato të shërbimeve. */
const faqSeo: ResolveFn<RouteSeo> = async () => {
  const [{ FAQ }, { SERVICES }] = await Promise.all([
    import('./data/faq'),
    import('./data/services'),
  ]);
  return { ...FAQ_SEO, jsonLd: [faqJsonLd([...FAQ, ...SERVICES.flatMap((s) => s.faq)])] };
};

const notFound = {
  loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  data: { seo: NOT_FOUND_SEO },
};

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
          'Montim, riparim dhe mirëmbajtje për çdo sistem kondicionimi: split, multi-split, kanal, VRF/VRV dhe pompa nxehtësie, në Tiranë, Durrës e më gjerë.',
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
    loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
    data: {
      seo: {
        title: 'Rreth ustait',
        description:
          'Përvoja, certifikatat dhe markat me të cilat punon ustai ynë i kondicionimit, me foto nga puna.',
      } satisfies RouteSeo,
    },
  },
  {
    path: 'projektet',
    loadComponent: () => import('./features/projects/projects-page').then((m) => m.ProjectsPage),
    data: {
      seo: {
        title: 'Projektet: para dhe pas montimit',
        description:
          'Projekte reale montimi kondicionerësh në shtëpi, vila, zyra dhe hotele, me foto para dhe pas dhe detaje teknike.',
      } satisfies RouteSeo,
    },
  },
  {
    path: 'projektet/:slug',
    loadComponent: () => import('./features/projects/project-page').then((m) => m.ProjectPage),
    resolve: { seo: projectSeo },
  },
  {
    path: 'cmimet-dhe-garancia',
    loadComponent: () => import('./features/prices/prices-page').then((m) => m.PricesPage),
    data: {
      seo: {
        title: 'Çmimet dhe garancia',
        description:
          'Çmime orientuese për montim, pastrim dhe diagnostikim, çfarë përfshin montimi standard dhe çfarë mbulon garancia mbi punën.',
      } satisfies RouteSeo,
    },
  },
  {
    path: 'pyetje-te-shpeshta',
    loadComponent: () => import('./features/faq/faq-page').then((m) => m.FaqPage),
    resolve: { seo: faqSeo },
  },
  {
    path: 'keshilla',
    loadComponent: () => import('./features/blog/blog-page').then((m) => m.BlogPage),
    data: {
      seo: {
        title: 'Këshilla për kondicionerin',
        description:
          'Pse pikon kondicioneri, pse nuk ftoh, sa shpesh pastrohet dhe çfarë do të thonë kodet e gabimeve: këshilla nga ustai.',
      } satisfies RouteSeo,
    },
  },
  {
    path: 'keshilla/:slug',
    loadComponent: () => import('./features/blog/article-page').then((m) => m.ArticlePage),
    resolve: { seo: articleSeo },
  },
  {
    path: 'privatesia',
    loadComponent: () => import('./features/privacy/privacy-page').then((m) => m.PrivacyPage),
    data: {
      seo: {
        title: 'Politika e privatësisë',
        description:
          'Si i trajtojmë të dhënat: analitika pa cookies, vendndodhja vetëm me pëlqimin tuaj dhe kontakti përmes WhatsApp.',
      } satisfies RouteSeo,
    },
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
