import { RenderMode, ServerRoute } from '@angular/ssr';
import { ARTICLES } from './data/articles.generated';
import { PROJECTS } from './data/projects';
import { SERVICES } from './data/services';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'sherbimet/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SERVICES.map((s) => ({ slug: s.slug })),
  },
  {
    path: 'projektet/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((p) => ({ slug: p.slug })),
  },
  {
    path: 'keshilla/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ARTICLES.map((a) => ({ slug: a.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
