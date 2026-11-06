import { PLATFORM_ID, PendingTasks, inject, provideAppInitializer } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
  withDisabledInitialNavigation,
} from '@angular/router';

/**
 * Navigimi i parë nis në një detyrë të veçantë pas krijimit të komponentit rrënjë, jo brenda
 * së njëjtës detyrë: dy detyra më të shkurtra në vend të një të gjatë (TBT/INP).
 * Aplikacioni mbahet "jo i qëndrueshëm" deri në fund të navigimit, që hidratimi të marrë
 * HTML-në e prerenderuar të faqes dhe të mos e fshijë. Në server navigimi nis menjëherë.
 *
 * Përdorimi: `provideRouter(routes, deferredInitialNavigation.feature)` dhe
 * `deferredInitialNavigation.initializer` te providers.
 */
export const deferredInitialNavigation = {
  feature: withDisabledInitialNavigation(),
  initializer: provideAppInitializer(() => {
    const router = inject(Router);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      router.initialNavigation();
      return;
    }
    const done = inject(PendingTasks).add();
    const sub = router.events.subscribe((e) => {
      if (
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ) {
        sub.unsubscribe();
        done();
      }
    });
    setTimeout(() => router.initialNavigation());
  }),
};
