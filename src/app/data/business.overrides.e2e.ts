import type { Business } from './types';

/**
 * VETËM për build-in e testeve e2e: numra fiktivë, që butonat e telefonit dhe WhatsApp
 * të shfaqen dhe të testohen. Nuk hyn kurrë në build-in e prodhimit.
 */
export const BUSINESS_OVERRIDES: Partial<Business> = {
  phone: '+355690000000',
  whatsapp: '355690000000',
};
