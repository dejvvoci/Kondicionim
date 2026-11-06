import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { deferredInitialNavigation } from './core/routing/deferred-initial-navigation';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      deferredInitialNavigation.feature,
    ),
    deferredInitialNavigation.initializer,
    // Hidratim i pjesshëm: blloqet @defer (hydrate …) mbeten HTML statike deri në ndërveprim.
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};
