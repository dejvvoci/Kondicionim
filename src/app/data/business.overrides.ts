import type { Business } from './types';

/**
 * Bosh në prodhim. Build-i i testeve e2e (`npm run build:e2e`) e zëvendëson me
 * business.overrides.e2e.ts (fileReplacements në angular.json). Mos e ndrysho.
 */
export const BUSINESS_OVERRIDES: Partial<Business> = {};
