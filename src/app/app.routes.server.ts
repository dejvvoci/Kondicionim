import { RenderMode, ServerRoute } from '@angular/ssr';
import { ARTICLES } from './data/articles.generated';
import { PROJECTS_ENABLED } from './data/features';
import { PROJECTS } from './data/projects';
import { SERVICES } from './data/services';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'sherbimet/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SERVICES.map((s) => ({ slug: s.slug })),
  },
  ...(PROJECTS_ENABLED
    ? [
        {
          path: 'projektet/:slug',
          renderMode: RenderMode.Prerender,
          getPrerenderParams: async () => PROJECTS.map((p) => ({ slug: p.slug })),
        } satisfies ServerRoute,
      ]
    : []),
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
