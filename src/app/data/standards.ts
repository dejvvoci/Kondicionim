import type { InstallStandard, Photo } from './types';

// TODO: konfirmo me ustain tekstet e standardeve dhe shto foto reale për secilin
export const STANDARDS: InstallStandard[] = [
  {
    slug: 'vakumim-i-plote',
    title: 'Vakumim i plotë i linjës me pompë vakumi',
    text: 'Para se të hapet gazi, nga tubat nxirret ajri dhe lagështia me pompë vakumi, jo duke i "pastruar me gaz". Lagështia që mbetet në linjë dëmton vajin dhe kompresorin me kalimin e kohës.',
    icon: 'gauge',
    featured: true,
    photo: null,
  },
  {
    slug: 'test-presioni-me-azot',
    title: 'Test presioni me azot',
    text: 'Linja mbushet me azot nën presion dhe kontrollohet që presioni të mos bjerë. Kështu rrjedhjet gjenden para se të hyjë gazi, jo pas disa javësh kur aparati nuk ftoh më.',
    icon: 'shield-check',
    featured: true,
    photo: null,
  },
  {
    slug: 'saldim-me-azot',
    title: 'Saldim me azot',
    text: 'Gjatë saldimit kalon azot brenda tubit, që bakri të mos oksidohet nga brenda. Përndryshe ashklat e oksidit qarkullojnë në sistem dhe bllokojnë valvulat dhe filtrat.',
    icon: 'tool',
    featured: true,
    photo: null,
  },
  {
    slug: 'tuba-dhe-izolim',
    title: 'Tuba bakri me trashësinë e duhur dhe izolim cilësor',
    text: 'Diametri dhe trashësia e tubave zgjidhen sipas aparatit dhe gjatësisë së linjës. Izolimi i plotë ruan efikasitetin dhe parandalon kondensimin brenda mureve.',
    icon: 'layout-grid',
    featured: false,
    photo: null,
  },
  {
    slug: 'pjerresia-e-kondensates',
    title: 'Pjerrësia e duhur e tubit të kondensatës',
    text: 'Tubi i ujit montohet me rënie të vazhdueshme, pa ulje-ngritje. Kjo është arsyeja më e shpeshtë pse një kondicioner pikon brenda në shtëpi.',
    icon: 'droplet',
    featured: false,
    photo: null,
  },
  {
    slug: 'njesia-e-jashtme',
    title: 'Mbajtëse antivibrim dhe pozicionim i saktë i njësisë së jashtme',
    text: 'Njësia e jashtme vendoset në nivel, me hapësirë për ajrim dhe me tampona antivibrim. Më pak zhurmë për ju dhe fqinjët, dhe më pak sforcim mbi tubat.',
    icon: 'air-conditioning',
    featured: false,
    photo: null,
  },
  {
    slug: 'kabllo-dhe-siguresa',
    title: 'Kabllo dhe siguresë sipas fuqisë së aparatit',
    text: 'Seksioni i kabllos dhe siguresa zgjidhen sipas rrymës së aparatit, jo sipas asaj që gjendet në shtëpi. Kjo shmang mbinxehjen dhe ndërprerjet.',
    icon: 'certificate',
    featured: false,
    photo: null,
  },
  {
    slug: 'testim-final',
    title: 'Testim final me matje dhe dorëzim me shpjegime',
    text: 'Në fund maten presionet, temperaturat dhe rryma, dhe krahasohen me vlerat e prodhuesit. Ju shpjegojmë përdorimin, pastrimin e filtrave dhe kur duhet thirrur ustai.',
    icon: 'clipboard-check',
    featured: true,
    photo: null,
  },
];

export const STANDARDS_PAGE = {
  eyebrow: 'Standardet e montimit',
  title: 'Standardet tona të montimit',
  lead: 'Një kondicioner mund të ndizet edhe kur montohet keq. Ndryshimi duket pas një, dy ose pesë vitesh: në konsum, në zhurmë dhe në defekte. Këto janë hapat që nuk i anashkalojmë.',
  why: 'Pse ka rëndësi',
  tools: {
    title: 'Veglat me të cilat punojmë',
    text: 'Manometra dixhitalë, pompë vakumi, detektor rrjedhjeje dhe termometra: matjet tregojnë nëse sistemi punon siç duhet, jo përshtypja.',
  },
} as const;

/** Foto e veglave profesionale. */
export const TOOLS_PHOTO: Photo | null = null; // TODO: foto e veglave (manometra dixhitalë, pompë vakumi, detektor rrjedhjeje, termometra)
