/**
 * Pjesët e faqes që ndizen/fiken me një çelës. Skedar i vogël pa të dhëna, që menuja dhe rrugët
 * ta lexojnë pa futur të dhënat e projekteve në bundle-in fillestar.
 */

/**
 * Projektet me foto para/pas (/projektet, /projektet/{slug}). Të fikura derisa të kemi punë
 * tonat të dokumentuara me foto. Kur bëhet true, shfaqen sërish: lidhja në menu dhe footer,
 * faqet e projekteve, seksioni në kryefaqe, projektet te faqja e çdo shërbimi dhe lidhjet nga
 * harta dhe lista e qyteteve. Komponentët (slider-i para/pas, kartat, filtrat) dhe të dhënat
 * (projects.ts) mbeten në kod; slider-i para/pas shihet në development te /stili.
 */
export const PROJECTS_ENABLED = false;
