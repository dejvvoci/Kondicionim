// node --import ./scripts/register-ts.mjs skripti.ts
import { register } from 'node:module';

register('./resolve-ts.mjs', import.meta.url);
