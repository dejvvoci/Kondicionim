import { RenderMode, ServerRoute } from '@angular/ssr';
import { SERVICES } from './data/services';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'sherbimet/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SERVICES.map((s) => ({ slug: s.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
