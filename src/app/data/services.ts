import type { Service, ServiceCategory } from './types';
import { servicePlaceholders } from './placeholders';

// TODO: konfirmo me ustain tekstet e shërbimeve (çdo fakt teknik rishikohet para publikimit)
// TODO: kohëzgjatja (duration) dhe foto nga punë reale për çdo shërbim
export const SERVICES: Service[] = [
  {
    slug: 'konsulence-dhe-zgjedhja-e-sistemit',
    category: 'kondicionim',
    title: 'Konsulencë dhe zgjedhja e sistemit',
    short:
      'Inspektim në vend, llogaritja e fuqisë dhe rekomandimi i sistemit të duhur për ambientin dhe buxhetin tuaj.',
    icon: 'clipboard-check',
    intro:
      'Para se të blini, ia vlen të dini çfarë ju duhet në të vërtetë. Ustai vjen në vend, mat ambientet dhe ju shpjegon cili sistem ka kuptim për shtëpinë ose biznesin tuaj, pa ju shtyrë drejt aparatit më të shtrenjtë.',
    includes: [
      'Inspektim në vend dhe matja e ambienteve',
      'Llogaritja e fuqisë (BTU) për çdo ambient',
      'Krahasim i opsioneve: split, multi-split ose VRF',
      'Pozicioni i njësive dhe rruga e tubave',
      'Rekomandim për modelin dhe fuqinë',
    ],
    audience: [
      'Familje që blejnë kondicionerin e parë ose ndërrojnë të vjetrin',
      'Ndërtime të reja dhe rikonstruksione, para suvasë',
      'Zyra, dyqane dhe hotele që duan një sistem të planifikuar',
    ],
    duration: null,
    photos: servicePlaceholders(
      'konsulence-dhe-zgjedhja-e-sistemit',
      'Konsulencë dhe zgjedhja e sistemit',
    ), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [],
    seo: {
      title: 'Konsulencë dhe zgjedhja e kondicionerit',
      description:
        'Inspektim në vend, llogaritja e BTU-ve dhe rekomandim i sistemit të duhur: split, multi-split ose VRF, para se të blini.',
    },
  },
  {
    slug: 'montim-split',
    category: 'kondicionim',
    title: 'Montim split',
    short:
      'Një njësi e brendshme dhe një e jashtme, e montuar me vakumim të plotë dhe testim me matje.',
    icon: 'air-conditioning',
    intro:
      'Montimi vendos sa mirë dhe sa gjatë do të punojë aparati. Çdo split montohet me vakumim të plotë, test presioni me azot dhe testim final me matje, sipas standardeve tona.',
    includes: [
      'Vendosja e njësisë së brendshme dhe të jashtme me mbajtëse',
      'Tuba bakri të izoluar dhe kabllo sipas fuqisë së aparatit',
      'Tubi i kondensatës me pjerrësinë e duhur',
      'Vakumim dhe test presioni para hapjes së gazit',
      'Testim me matje dhe shpjegim i përdorimit',
    ],
    audience: [
      'Dhoma gjumi, ndenjie dhe kuzhina',
      'Apartamente dhe shtëpi',
      'Zyra dhe dyqane të vogla',
    ],
    duration: null,
    photos: servicePlaceholders('montim-split', 'Montim split'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'A mund ta montoni aparatin që e kam blerë vetë?',
        a: 'Po, në shumicën e rasteve. Para montimit kontrollojmë që fuqia e aparatit t’i përshtatet ambientit dhe që të gjitha pjesët të jenë të plota.',
      },
      {
        q: 'Ku vendoset njësia e jashtme?',
        a: 'Në një vend me ajrim të mirë, të qëndrueshëm dhe të arritshëm për servis, sa më afër njësisë së brendshme. Pozicionin e zgjedhim bashkë para se të fillojë puna.',
      },
    ],
    seo: {
      title: 'Montim kondicioneri split',
      description:
        'Montim split me vakumim të plotë, test presioni me azot dhe testim me matje, në Tiranë, Durrës, Elbasan, Lezhë dhe Shkodër.',
    },
  },
  {
    slug: 'montim-multi-split',
    category: 'kondicionim',
    title: 'Montim multi-split',
    short:
      'Një njësi e jashtme me disa koka të brendshme, për apartamente dhe vila me shumë ambiente.',
    icon: 'layout-grid',
    intro:
      'Me multi-split, një njësi e jashtme ushqen disa koka të brendshme. Fasada mbetet më e pastër dhe çdo ambient ka kontrollin e vet, por planifikimi i linjave dhe i fuqisë duhet bërë me kujdes.',
    includes: [
      'Llogaritja e fuqisë për çdo ambient dhe për njësinë e jashtme',
      'Planifikimi i linjave të tubave, të dukshme ose të fshehura në mur',
      'Montimi i kokave të brendshme dhe i njësisë së jashtme',
      'Vakumim dhe test presioni për çdo linjë',
      'Testim i secilës kokë dhe i punës njëkohësisht',
    ],
    audience: [
      'Apartamente me disa ambiente',
      'Vila dhe shtëpi me disa kate',
      'Zyra me disa dhoma',
    ],
    duration: null,
    photos: servicePlaceholders('montim-multi-split', 'Montim multi-split'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Multi-split apo disa split të veçantë?',
        a: 'Multi-split kërkon vetëm një njësi të jashtme dhe e mban fasadën të pastër. Disa split të veçantë janë më të pavarur: nëse njëri prishet, të tjerët punojnë. Ustai ju këshillon sipas ambienteve dhe buxhetit.',
      },
      {
        q: 'A mund të shtoj një kokë më vonë?',
        a: 'Vetëm nëse njësia e jashtme ka dalje dhe fuqi të lirë. Prandaj ia vlen ta planifikoni që në fillim, edhe nëse kokën e fundit e montoni më vonë.',
      },
    ],
    seo: {
      title: 'Montim kondicioneri multi-split',
      description:
        'Një njësi e jashtme për disa ambiente: llogaritja e fuqisë, linja të fshehura në mur dhe testim i çdo koke, për apartamente dhe vila.',
    },
  },
  {
    slug: 'sisteme-vrf-vrv',
    category: 'kondicionim',
    title: 'Sisteme VRF/VRV',
    short:
      'Sisteme qendrore për ndërtesa, hotele dhe zyra, me kontroll të veçantë për çdo ambient.',
    icon: 'building',
    intro:
      'Sistemet VRF/VRV lidhin shumë njësi të brendshme me një ose disa njësi të jashtme dhe e rregullojnë fuqinë sipas nevojës së çdo ambienti. Janë zgjidhja për hotele, zyra dhe ndërtesa me shumë ambiente.',
    includes: [
      'Studimi i ngarkesës termike dhe zgjedhja e sistemit',
      'Projektimi i linjave, degëzimeve dhe kontrollit',
      'Montimi i njësive, tubave dhe kabllove të komunikimit',
      'Test presioni me azot dhe vakumim i gjithë rrjetit',
      'Komisionim, testim dhe udhëzime për stafin',
    ],
    audience: [
      'Hotele dhe bujtina',
      'Zyra dhe ndërtesa administrative',
      'Pallate dhe komplekse me shumë ambiente',
    ],
    duration: null,
    photos: servicePlaceholders('sisteme-vrf-vrv', 'Sisteme VRF/VRV'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Çfarë e dallon VRF nga multi-split?',
        a: 'VRF mban shumë më tepër njësi të brendshme dhe linja më të gjata, dhe e rregullon fuqinë vazhdimisht sipas kërkesës. Është ndërtuar për ndërtesa të mëdha dhe punë të gjatë çdo ditë.',
      },
    ],
    seo: {
      title: 'Sisteme VRF/VRV për hotele dhe zyra',
      description:
        'Projektim, montim dhe komisionim i sistemeve VRF/VRV për hotele, zyra dhe ndërtesa: test me azot, vakumim i plotë dhe testim me matje.',
    },
  },
  {
    slug: 'diagnostikim-dhe-riparim',
    category: 'kondicionim',
    title: 'Diagnostikim dhe riparim',
    short:
      'Kodet e gabimeve, kompresori, pllakat elektronike: gjejmë shkakun para se të ndërrojmë pjesë.',
    icon: 'tool',
    intro:
      'Një kod gabimi ose një aparat që nuk ftoh mirë ka gjithmonë një shkak. Me matje dhe vegla diagnostike e gjejmë atë para se të ndërrojmë pjesë, që të paguani vetëm për atë që duhet.',
    includes: [
      'Leximi i kodeve të gabimit dhe kontroll i sensorëve',
      'Matja e presioneve, temperaturave dhe rrymës',
      'Kontroll i kompresorit, ventilatorëve dhe kondensatorëve',
      'Diagnostikim i pllakave elektronike',
      'Shpjegim i shkakut dhe ofertë para riparimit',
    ],
    audience: [
      'Aparate që nuk ftohin ose nuk ngrohin si duhet',
      'Aparate që pikojnë, bëjnë zhurmë ose shfaqin kod gabimi',
      'Split, multi-split dhe sisteme komerciale',
    ],
    duration: null,
    photos: servicePlaceholders('diagnostikim-dhe-riparim', 'Diagnostikim dhe riparim'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Çfarë të bëj kur shfaqet një kod gabimi?',
        a: 'Shënoni kodin dhe modelin e aparatit, fikeni nga siguresa për disa minuta dhe ndizeni sërish. Nëse kodi rishfaqet, na dërgoni një foto në WhatsApp.',
      },
      {
        q: 'A ia vlen riparimi i një aparati të vjetër?',
        a: 'Varet nga defekti dhe gjendja e aparatit. Pas diagnostikimit ju themi sinqerisht nëse ia vlen riparimi apo zëvendësimi.',
      },
    ],
    seo: {
      title: 'Riparim dhe diagnostikim kondicioneri',
      description:
        'Kode gabimi, kompresor, pllaka elektronike, aparat që nuk ftoh ose pikon: diagnostikim me matje dhe riparim pasi shkaku është i qartë.',
    },
  },
  {
    slug: 'kontroll-rrjedhjeje-dhe-rimbushje-gazi',
    category: 'kondicionim',
    title: 'Kontroll rrjedhjeje dhe rimbushje gazi',
    short:
      'Gjejmë dhe riparojmë rrjedhjen me detektor dhe test me azot, pastaj rimbushim gazin në sasinë e saktë.',
    icon: 'droplet',
    intro:
      'Një kondicioner nuk e harxhon gazin: nëse mungon, diku ka rrjedhje. Rimbushja pa e gjetur rrjedhjen është para e humbur, prandaj fillojmë gjithmonë me kontrollin.',
    includes: [
      'Kontroll me detektor elektronik rrjedhjeje',
      'Test presioni me azot për rrjedhjet e vogla',
      'Riparimi i pikës së rrjedhjes',
      'Vakumim i linjës para rimbushjes',
      'Rimbushje me sasinë e saktë sipas prodhuesit',
    ],
    audience: [
      'Aparate që ftohin dobët ose formojnë akull në tuba',
      'Aparate të rimbushura më parë që sërish nuk ftohin',
      'Sisteme pas zhvendosjes ose dëmtimit të tubave',
    ],
    duration: null,
    photos: servicePlaceholders(
      'kontroll-rrjedhjeje-dhe-rimbushje-gazi',
      'Kontroll rrjedhjeje dhe rimbushje gazi',
    ), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Sa shpesh duhet rimbushur gazi?',
        a: 'Në një sistem pa rrjedhje, kurrë. Nëse aparati ka nevojë për gaz çdo vit, ka një rrjedhje që duhet gjetur dhe riparuar.',
      },
      {
        q: 'Si e kuptoj që mungon gazi?',
        a: 'Shenjat më të shpeshta janë ajri jo mjaftueshëm i ftohtë, akulli në tubat e njësisë së jashtme dhe aparati që punon pa pushim. Diagnostikimi me matje e konfirmon.',
      },
    ],
    seo: {
      title: 'Kontroll rrjedhjeje dhe rimbushje gazi',
      description:
        'Gjejmë rrjedhjen me detektor dhe test me azot, e riparojmë dhe vetëm pastaj rimbushim gazin në sasinë e saktë sipas prodhuesit.',
    },
  },
  {
    slug: 'cmontim-dhe-zhvendosje',
    category: 'kondicionim',
    title: 'Çmontim dhe zhvendosje',
    short:
      'Gazi mblidhet në njësinë e jashtme, aparati çmontohet pa dëmtime dhe rimontohet në vendin e ri.',
    icon: 'truck',
    intro:
      'Kur ndërroni shtëpi ose rikonstruktoni, aparati mund të zhvendoset pa humbur gazin dhe pa u dëmtuar. Gazi mblidhet në njësinë e jashtme para çmontimit dhe linja e re montohet sipas të njëjtave standarde.',
    includes: [
      'Mbledhja e gazit në njësinë e jashtme (pump-down)',
      'Çmontim i kujdesshëm i njësive dhe tubave',
      'Mbrojtja e lidhjeve gjatë transportit',
      'Rimontim me tuba të rinj kur duhet',
      'Vakumim, test presioni dhe testim në vendin e ri',
    ],
    audience: [
      'Familje që ndërrojnë banesë',
      'Rikonstruksione dhe lyerje fasadash',
      'Biznese që zhvendosin zyrën ose dyqanin',
    ],
    duration: null,
    photos: servicePlaceholders('cmontim-dhe-zhvendosje', 'Çmontim dhe zhvendosje'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'A mund të ripërdoren tubat e vjetër?',
        a: 'Ndonjëherë po, por shpesh linja e re ka gjatësi tjetër dhe lidhjet e vjetra janë të lodhura. Tubat e rinj janë zakonisht zgjidhja më e sigurt.',
      },
      {
        q: 'A humbet gazi gjatë zhvendosjes?',
        a: 'Jo, kur gazi mblidhet më parë në njësinë e jashtme. Mund të nevojitet vetëm shtesë kur linja e re është më e gjatë.',
      },
    ],
    seo: {
      title: 'Çmontim dhe zhvendosje kondicioneri',
      description:
        'Zhvendosje kondicioneri pa humbur gazin: pump-down, çmontim i kujdesshëm, rimontim, vakumim dhe testim në banesën ose zyrën e re.',
    },
  },
  // ── Punime elektrike ──
  // TODO: konfirmo me ustain shërbimet elektrike dhe tekstet e tyre
  {
    slug: 'instalime-elektrike',
    category: 'elektrike',
    title: 'Instalime elektrike',
    short:
      'Rrjet elektrik i ri ose i rinovuar për apartamente, shtëpi dhe zyra, i ndarë në qarqe sipas përdorimit.',
    icon: 'home-bolt',
    intro:
      'Një instalim i mirë nis me planin: sa qarqe duhen, ku shkojnë prizat dhe dritat, dhe çfarë fuqie do të kenë pajisjet. Kabllot vendosen me seksionin e duhur, çdo qark ka siguresën e vet dhe në fund gjithçka testohet.',
    includes: [
      'Planifikimi i qarqeve sipas ambienteve dhe pajisjeve',
      'Tubacione dhe kabllo me seksion sipas ngarkesës',
      'Kuti shpërndarëse, priza dhe çelësa',
      'Lidhja me panelin elektrik dhe tokëzimi',
      'Testim i çdo qarku para dorëzimit',
    ],
    audience: [
      'Apartamente dhe shtëpi në rikonstruksion',
      'Ndërtime të reja, para suvasë',
      'Zyra dhe dyqane',
    ],
    duration: null,
    photos: servicePlaceholders('instalime-elektrike', 'Instalime elektrike'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Kur ia vlen të rinovohet instalimi elektrik?',
        a: 'Kur kabllot janë të vjetra, siguresat hidhen shpesh, prizat ngrohen ose shtëpia po rikonstruktohet. Rikonstruksioni është momenti më i mirë, sepse kabllot kalojnë në mur para suvasë.',
      },
      {
        q: 'A mund të punohet pa thyer gjithë muret?',
        a: 'Shpesh po: një pjesë e kabllove kalon nëpër tubacionet ekzistuese ose në kanalina të jashtme. Pasi e shohim instalimin, ju themi çfarë mund të ruhet dhe çfarë duhet ndërruar.',
      },
    ],
    seo: {
      title: 'Instalime elektrike për shtëpi dhe zyra',
      description:
        'Instalime elektrike të reja ose të rinovuara për apartamente, shtëpi dhe zyra: qarqe të ndara, kabllo sipas ngarkesës, tokëzim dhe testim.',
    },
  },
  {
    slug: 'paneli-elektrik-dhe-siguresat',
    category: 'elektrike',
    title: 'Paneli elektrik dhe siguresat',
    short:
      'Montim ose përmirësim i panelit, siguresa automatike për çdo qark dhe salvavita për mbrojtjen nga goditja elektrike.',
    icon: 'circuit-switch-open',
    intro:
      'Paneli elektrik mbron gjithë shtëpinë. Çdo qark duhet të ketë siguresën që i përshtatet kabllos, dhe salvavita (mbrojtja diferenciale) e ndërpret rrymën kur ajo rrjedh aty ku nuk duhet, përfshirë trupin e njeriut.',
    includes: [
      'Montim i panelit të ri ose zëvendësim i të vjetrit',
      'Siguresa automatike sipas qarqeve dhe kabllove',
      'Salvavita (mbrojtje diferenciale)',
      'Kontroll i tokëzimit',
      'Etiketim i qarqeve në panel',
    ],
    audience: [
      'Shtëpi me panel të vjetër ose me siguresa me tela',
      'Apartamente ku siguresat hidhen shpesh',
      'Zyra dhe dyqane që shtojnë pajisje',
    ],
    duration: null,
    photos: servicePlaceholders('paneli-elektrik-dhe-siguresat', 'Paneli elektrik dhe siguresat'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Çfarë është salvavita?',
        a: 'Është mbrojtja diferenciale: e ndërpret rrymën kur një pjesë e saj rrjedh drejt tokës, për shembull përmes një pajisjeje me defekt ose përmes trupit të njeriut. Është mbrojtja kryesore nga goditja elektrike.',
      },
      {
        q: 'Pse duhen etiketuar qarqet?',
        a: 'Që në një defekt ose riparim të dini menjëherë cilën siguresë të fikni, pa e lënë gjithë shtëpinë pa rrymë.',
      },
    ],
    seo: {
      title: 'Panel elektrik, siguresa dhe salvavita',
      description:
        'Montim ose përmirësim i panelit elektrik: siguresa automatike për çdo qark, salvavita kundër goditjes elektrike, tokëzim dhe etiketim.',
    },
  },
  {
    slug: 'priza-celesa-dhe-ndricim',
    category: 'elektrike',
    title: 'Priza, çelësa dhe ndriçim',
    short:
      'Shtim ose zhvendosje prizash dhe çelësash, montim ndriçuesish dhe ndriçim LED brenda dhe jashtë.',
    icon: 'bulb',
    intro:
      'Priza aty ku ju duhen, drita që ndizen nga vendi i duhur dhe ndriçim që i përshtatet ambientit. Çdo pikë e re lidhet me qarkun e duhur, që të mos mbingarkohet.',
    includes: [
      'Shtim, zhvendosje ose ndërrim prizash dhe çelësash',
      'Montim llambadarësh, spotesh dhe ndriçuesish LED',
      'Çelësa nga dy vende (korridor, shkallë)',
      'Ndriçim i jashtëm për ballkone, oborre dhe hyrje',
      'Kontroll që qarku e mban ngarkesën e re',
    ],
    audience: [
      'Apartamente dhe shtëpi',
      'Zyra dhe dyqane',
      'Ambiente të jashtme: ballkone, oborre, hyrje',
    ],
    duration: null,
    photos: servicePlaceholders('priza-celesa-dhe-ndricim', 'Priza, çelësa dhe ndriçim'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'A mund të shtoj priza pa thyer murin?',
        a: 'Po, me kanalina të jashtme që vendosen në mur pa thyerje. Nëse muri do të suvatohet ose lyhet, prizat mund të futen edhe brenda tij.',
      },
      {
        q: 'Sa priza mund të lidhen në një qark?',
        a: 'Varet nga pajisjet që do të përdoren, jo vetëm nga numri i prizave. Pajisjet me fuqi të madhe kanë nevojë për qark të vetin.',
      },
    ],
    seo: {
      title: 'Priza, çelësa dhe ndriçim LED',
      description:
        'Shtim dhe zhvendosje prizash e çelësash, montim llambadarësh, spotesh dhe ndriçimi LED për shtëpi, zyra dhe ambiente të jashtme.',
    },
  },
  {
    slug: 'defekte-elektrike',
    category: 'elektrike',
    title: 'Defekte elektrike',
    short:
      'Siguresa që hidhen, priza pa rrymë, drita që fiken: gjejmë shkakun me matje dhe e riparojmë.',
    icon: 'bolt',
    intro:
      'Një siguresë që hidhet vazhdimisht ose një prizë pa rrymë ka gjithmonë një shkak: mbingarkesë, qark i shkurtër ose rrjedhje drejt tokës. Me matje e gjejmë ku është defekti para se të ndërrojmë diçka.',
    includes: [
      'Kontroll i panelit, siguresave dhe salvavitës',
      'Gjetja e qarkut dhe e pikës me defekt',
      'Matje e izolimit dhe e tokëzimit',
      'Riparim ose zëvendësim i kabllove, prizave dhe çelësave',
      'Shpjegim i shkakut dhe çfarë duhet bërë më tej',
    ],
    audience: [
      'Shtëpi dhe zyra ku hidhen siguresat',
      'Priza ose drita që nuk punojnë',
      'Kabllo, priza ose çelësa që ngrohen ose bëjnë shkëndija',
    ],
    duration: null,
    photos: servicePlaceholders('defekte-elektrike', 'Defekte elektrike'), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Pse më hidhet siguresa?',
        a: 'Shkaqet kryesore janë shumë pajisje në të njëjtin qark, një qark i shkurtër ose një rrjedhje që e kap salvavita. Mos e ngrini siguresën vazhdimisht: shkëputni pajisjet dhe na kontaktoni.',
      },
      {
        q: 'Çfarë të bëj kur ndiej erë djegieje nga një prizë?',
        a: 'Fikni siguresën e atij qarku dhe mos e përdorni prizën. Era e djegies ose ngjyra e nxirë tregon mbinxehje, që duhet kontrolluar sa më shpejt.',
      },
    ],
    seo: {
      title: 'Riparim defektesh elektrike',
      description:
        'Siguresa që hidhen, priza pa rrymë, kabllo që ngrohen: gjejmë defektin me matje dhe e riparojmë në shtëpi, apartament ose zyrë.',
    },
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  SERVICES.find((s) => s.slug === slug);

/** Seksionet e shërbimeve, në rendin që shfaqen. */
export const SERVICE_CATEGORIES: { key: ServiceCategory; title: string; lead: string }[] = [
  {
    key: 'kondicionim',
    title: 'Kondicionim',
    lead: 'Zgjedhja, montimi, riparimi dhe mirëmbajtja e kondicionerëve, nga split-i te sistemet VRF.',
  },
  {
    key: 'elektrike',
    title: 'Punime elektrike',
    lead: 'Instalime, panele, priza dhe ndriçim, dhe zgjidhja e defekteve në shtëpi, apartamente dhe zyra.',
  },
];

export const servicesIn = (category: ServiceCategory): Service[] =>
  SERVICES.filter((s) => s.category === category);
