import type { Service } from './types';
import { servicePlaceholders } from './placeholders';

// TODO: konfirmo me ustain tekstet e shërbimeve (çdo fakt teknik rishikohet para publikimit)
// TODO: kohëzgjatja (duration) dhe foto nga punë reale për çdo shërbim
export const SERVICES: Service[] = [
  {
    slug: 'konsulence-dhe-zgjedhja-e-sistemit',
    title: 'Konsulencë dhe zgjedhja e sistemit',
    short:
      'Inspektim në vend, llogaritja e fuqisë dhe rekomandimi i sistemit të duhur për ambientin dhe buxhetin tuaj.',
    icon: 'clipboard-check',
    intro:
      'Para se të blini, ia vlen të dini çfarë ju duhet në të vërtetë. Ustai vjen në vend, mat ambientet dhe ju shpjegon cili sistem ka kuptim për shtëpinë ose biznesin tuaj, pa ju shtyrë drejt aparatit më të shtrenjtë.',
    includes: [
      'Inspektim në vend dhe matja e ambienteve',
      'Llogaritja e fuqisë (BTU) për çdo ambient',
      'Krahasim i opsioneve: split, multi-split, kanal ose VRF',
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
    faq: [
      {
        q: 'A duhet ta blej aparatin para inspektimit?',
        a: 'Më mirë jo. Pas inspektimit e dini fuqinë dhe llojin e duhur, dhe shmangni një aparat të vogël që punon pa pushim ose një të madh që ndizet e fiket shpesh.',
      },
      {
        q: 'Çfarë duhet të përgatis për inspektimin?',
        a: 'Mjafton që ustai të ketë qasje në ambientet, në ballkon ose tarracë dhe te paneli elektrik. Nëse keni plan të shtëpisë, mbajeni gati edhe atë.',
      },
    ],
    seo: {
      title: 'Konsulencë dhe zgjedhja e kondicionerit',
      description:
        'Inspektim në vend, llogaritja e BTU-ve dhe rekomandim i sistemit të duhur: split, multi-split, kanal ose VRF, para se të blini.',
    },
  },
  {
    slug: 'montim-split',
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
    slug: 'sisteme-me-kanale-dhe-dysheme-tavan',
    title: 'Sisteme me kanale dhe dysheme-tavan',
    short:
      'Ajër i shpërndarë në mënyrë të padukshme përmes kanaleve, ose njësi dysheme-tavan për ambiente të mëdha.',
    icon: 'wind',
    intro:
      'Sistemet me kanale fshihen në tavan të rënë dhe e shpërndajnë ajrin me grila në disa ambiente. Njësitë dysheme-tavan janë zgjidhje e fortë për salla, dyqane dhe ambiente me tavan të lartë.',
    includes: [
      'Përzgjedhja e njësisë dhe llogaritja e prurjes së ajrit',
      'Projektimi i kanaleve, grilave dhe kthimit të ajrit',
      'Montimi i njësisë, tubave dhe kondensatës',
      'Koordinim me punimet e gipsit dhe të elektrikut',
      'Testim i prurjes dhe i temperaturave në çdo grilë',
    ],
    audience: [
      'Shtëpi dhe vila në ndërtim ose rikonstruksion',
      'Dyqane, restorante dhe salla',
      'Zyra me tavan të rënë',
    ],
    duration: null,
    photos: servicePlaceholders(
      'sisteme-me-kanale-dhe-dysheme-tavan',
      'Sisteme me kanale dhe dysheme-tavan',
    ), // TODO: foto shembull, zëvendësohet me foton reale
    faq: [
      {
        q: 'Kur duhet planifikuar sistemi me kanale?',
        a: 'Para se të mbyllet tavani i rënë. Kanalet, grilat dhe kondensata kanë nevojë për hapësirë dhe pjerrësi, prandaj ustai duhet të jetë në objekt që në fazën e punimeve.',
      },
      {
        q: 'A bën zhurmë sistemi me kanale?',
        a: 'Njësia ndodhet larg ambienteve dhe ajri del nga grilat, prandaj zakonisht është më i qetë se një split në mur, kur kanalet janë të dimensionuara mirë.',
      },
    ],
    seo: {
      title: 'Kondicionim me kanale dhe dysheme-tavan',
      description:
        'Sisteme me kanale të fshehura në tavan dhe njësi dysheme-tavan për shtëpi, dyqane, restorante dhe zyra: projektim, montim dhe testim.',
    },
  },
  {
    slug: 'sisteme-vrf-vrv',
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
      {
        q: 'A mund të ndahet konsumi për çdo ambient ose apartament?',
        a: 'Shumë sisteme VRF e mundësojnë me kontroll qendror dhe matës të veçantë. Kjo vendoset në fazën e projektimit, sipas modelit.',
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
];

export const serviceBySlug = (slug: string): Service | undefined =>
  SERVICES.find((s) => s.slug === slug);
