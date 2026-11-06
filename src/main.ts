import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Një pushim i shkurtër midis ekzekutimit të moduleve dhe nisjes së Angular-it: dy detyra më
// të shkurtra në vend të një të gjatë, që thread-i kryesor të mos bllokohet (TBT/INP).
setTimeout(() => bootstrapApplication(App, appConfig).catch((err) => console.error(err)));
