# Kondicionim: faqja e ustait të kondicionimit

Sajt prezantues në shqip, i ndërtuar me Angular 21 dhe prerendering (SSG): çdo rrugë gjenerohet si
HTML statik gjatë build-it dhe hostohet në një CDN statike (Cloudflare Pages), pa server.

## Kërkesat

- Node.js 24 (`node -v`). Shënim: Angular 22 kërkon Node ≥ 24.15; projekti është në Angular 21
  derisa Node të përditësohet, pastaj `ng update @angular/core @angular/cli`.
- npm 11

## Zhvillimi lokal

```bash
npm install
npm start            # http://localhost:4200, me placeholder-at TODO të dukshëm
npm test             # unit tests (Vitest)
npm run lint         # ESLint (angular-eslint)
npm run format       # Prettier
npm run build        # kontroll përmbajtjeje + build me prerender → dist/kondicionim/browser
npm run preview      # shërben build-in si Cloudflare Pages në http://localhost:4300
```

Testet e plota (si në CI):

```bash
npx playwright install chromium   # një herë
npm run build:e2e    # build me numra kontakti fiktivë → dist/e2e/browser
npm run e2e          # Playwright + axe, në celular (390px) dhe desktop (1280px)
npm run lighthouse   # Lighthouse CI mbi 5 faqe (kërkon Chrome)
```

Build-i i testeve zëvendëson vetëm `src/app/data/business.overrides.ts` me
`business.overrides.e2e.ts` (telefon dhe WhatsApp fiktivë), që butonat e kontaktit të testohen
edhe pa të dhënat reale. Përndryshe është i njëjtë me build-in e prodhimit.

## Struktura

```
src/app/
  core/          # SeoService, kontakti, layout (header, footer)
  shared/ui/     # komponentët UI (button, icon, ...)
  features/      # faqet (lazy loaded)
  data/          # PËRMBAJTJA: business.ts, cities.ts, navigation.ts, ...
  i18n/          # tekstet e ndërfaqes (ui-text.sq.ts)
src/styles/      # tokens, fonts, base, typography, utilities, mixins
public/          # fontet, favicon, og-image.png, _headers (Cloudflare)
scripts/         # build-content, postbuild (404, sitemap, robots), check-dist, serve, build-og
e2e/             # testet Playwright + axe
```

## Komponentët UI

`ng serve` punon pa HMR (`"hmr": false` te `angular.json`): me HMR, blloqet `@defer` me
hidratim graduale dyfishonin faqen në development. Pas çdo ndryshimi faqja ringarkohet e plotë.

Katalogu i të gjithë komponentëve shfaqet te **http://localhost:4200/stili** (vetëm me `npm start`,
nuk përfshihet në build-in e prodhimit).

| Komponenti                           | Përdorimi                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `a[ui-button]`, `button[ui-button]`  | `variant`: primary, secondary, outline, link, outline-light; `size`: md, lg          |
| `ui-badge`                           | badge besueshmërie: `icon`, `tone` (white, soft)                                     |
| `ui-card`                            | `title`, `icon`, `link` (e gjithë karta e klikueshme), `level` (2/3)                 |
| `ui-section`                         | `eyebrow`, `title`, `lead`, `tone` (white, soft, base), `center`, `narrow`, `anchor` |
| `ui-accordion` + `ui-accordion-item` | mbi `<details>/<summary>`; `group` = vetëm një i hapur                               |
| `ui-sheet`                           | bottom sheet (celular) / modal (desktop) mbi `<dialog>`; `[(open)]`, `title`         |
| `ui-icon`                            | ikonat Tabler në `icons.ts`                                                          |

Rrjedha WhatsApp hapet nga çdo komponent me `inject(WhatsAppFlow).open({ source, service? })`.

## Përditësimi i përmbajtjes

Të gjitha tekstet dhe të dhënat që ndryshojnë janë në `src/app/data/`. Nuk preken komponentët.

- **Të dhënat e biznesit** (emri, telefoni, WhatsApp, orari, NIPT, rrjetet sociale):
  `src/app/data/business.ts`
- **Një qytet i ri**: një rresht i ri në `src/app/data/cities.ts`
- **Menuja**: `src/app/data/navigation.ts`
- **Projektet** (foto para/pas) janë të fikura derisa të kemi punë tonat të dokumentuara:
  ndizen me `PROJECTS_ENABLED = true` te `src/app/data/features.ts` (menuja, faqet, kryefaqja,
  shërbimet dhe harta shfaqen sërish).
- **Një projekt i ri**: foto para/pas në `public/images/projektet/` (emër përshkrues, p.sh.
  `vile-multi-split-tirane-para.avif`) dhe një objekt në `src/app/data/projects.ts`. Faqja
  `/projektet/{slug}` krijohet vetë; me `featured: true` del edhe në kryefaqe.
- **Një artikull i ri**: një skedar `src/content/keshilla/{slug}.md` me frontmatter `title`,
  `description` (≤ 155 karaktere), `date` dhe opsionalisht `services`. Shih artikujt ekzistues si
  shembull. Gjenerohet automatikisht me `npm start` / `npm run build`.
- **Çmimet dhe garancia**: `src/app/data/prices.ts`
- **Rreth ustait, certifikatat, markat**: `src/app/data/about.ts`, `src/app/data/brands.ts`
- **Politika e privatësisë**: `src/app/data/privacy.ts`
- **Koeficientët e kalkulatorit BTU**: `src/app/data/btu-config.ts`
- **Tekstet e udhëzuesit dhe krahasimi i sistemeve**: `src/app/data/guide.ts`
- **Standardet e montimit (tekst dhe foto)**: `src/app/data/standards.ts`

### Fotot shembull (për prezantim)

Derisa të vijnë fotot reale, faqja shfaq foto shembull (`public/images/shembull/*.svg`): secila
tregon "Foto shembull", çfarë duhet të shfaqë fotoja reale, përmasat (p.sh. 1200 × 900 px, 4:3)
dhe emrin e sugjeruar të skedarit. Janë 58: hero, 3 te "Rreth ustait", 3 për çdo shërbim, 8 te
standardet, fotoja e veglave dhe fotot para/pas të projekteve shembull. Përcaktohen me
`placeholder(...)` në skedarët e të dhënave (shih `src/app/data/placeholders.ts`) dhe vizatohen
me `npm run build:placeholders`.

**Projektet shembull** (`example: true` te `src/app/data/projects.ts`): 6 projekte me qytete dhe
sisteme të ndryshme, që të shihen filtrat dhe slider-i para/pas. Shënohen "Shembull" kudo ku
shfaqen, faqet e tyre kanë `noindex` dhe nuk hyjnë në sitemap; BTU dhe kohëzgjatja mbeten bosh.
Kur vijnë projektet reale, fshi `...exampleProjects()` dhe funksionin.

Për ta zëvendësuar një foto: vendos foton reale te `public/images/` me emrin e sugjeruar (AVIF
ose WebP; hero nën 150 KB) dhe zëvendëso thirrjen `placeholder(...)` me objektin `Photo` real,
me `alt` përshkrues në shqip. Fotot shembull nuk dalin kurrë si foto e biznesit te Google
(JSON-LD), `npm run build` tregon sa faqe i kanë ende, dhe `check-content --strict` dështon
derisa të mos mbetet asnjë.

### Harta e Shqipërisë

Harta është SVG inline, e gjeneruar një herë nga kufijtë e Natural Earth dhe e ruajtur në
`src/app/shared/ui/map-albania/albania-map.generated.ts` (rreth 4 KB). Qytetet vendosen nga
`lat`/`lng` në `cities.ts` me të njëjtin projeksion, ndaj një qytet i ri nuk kërkon rigjenerim.
Rigjenerimi (vetëm nëse ndryshon burimi ose madhësia):

```bash
npm run build:map
```

Vlera `null` me koment `// TODO:` = e dhënë që mungon. Në development shfaqet si placeholder i
dukshëm; në prodhim elementi fshihet. `npm run build` liston të gjitha TODO-t; para publikimit
final ekzekuto `node scripts/check-content.ts --strict` (dështon nëse ka TODO).

Pas ndryshimit: commit → push → deploy automatik.

## SEO

- **Title, description, canonical, Open Graph dhe Twitter Card** vendosen nga `SeoService` sipas
  `data.seo` të çdo rruge në `src/app/app.routes.ts` (ose nga të dhënat, për shërbimet, projektet
  dhe artikujt). Testet kontrollojnë kufijtë: titulli ≤ 60, description ≤ 155 karaktere.
- **JSON-LD**: `HVACBusiness` në çdo faqe (nga `business.ts` dhe `cities.ts`), `Service` në faqet e
  shërbimeve, `FAQPage` te pyetjet, `BlogPosting` te artikujt dhe `BreadcrumbList` në faqet e
  brendshme. Fushat që mungojnë nuk shkruhen; nuk ka `aggregateRating`. Pas publikimit, kontrollo
  disa faqe me [Rich Results Test](https://search.google.com/test/rich-results).
- **sitemap.xml dhe robots.txt** gjenerohen nga `scripts/postbuild.ts` me faqet e prerenderuara
  (pa ato me `noindex`), me URL-në kanonike dhe datën e artikujve.
- **Imazhi OG** (`public/og-image.png`, 1200×630) ndërtohet nga emri, qytetet dhe harta.
  Rindërtoje kur ndryshon emri i biznesit: `npm run build:og`.

## Performanca

Faqet janë HTML e plotë që në build, ndaj JavaScript-i nevojitet vetëm për ndërveprimin:

- **JS nis pas ngarkimit të faqes** (`boot-*.js`, i krijuar nga `scripts/postbuild.ts`). Klikimet e
  bëra para kësaj ruhen dhe përsëriten pas nisjes (`withEventReplay`).
- **Hidratim i pjesshëm** (`withIncrementalHydration`): header-i, footer-i dhe seksionet poshtë
  kokës së faqes janë në blloqe `@defer (on immediate; hydrate on interaction)` dhe mbeten HTML
  statike deri në klikimin e parë. Kalkulatori, harta dhe slider-i para/pas përdorin
  `hydrate on viewport` dhe lexojnë vlerat nga DOM-i nëse përdoruesi i ndryshoi para hidratimit.
  Një seksion i ri pa ndërveprim të veçantë futet në bllokun ekzistues të faqes.
- **CSS-ja globale** futet brenda çdo faqeje (pa kërkesë shtesë dhe pa `onload` inline).
- `scripts/check-dist.ts` dështon nëse JS-ja fillestare kalon 150 KB gzip, nëse imazhi hero kalon
  150 KB ose nëse ka lidhje të prishura; Lighthouse CI kontrollon pikët dhe LCP/CLS/TBT.

## Gjuhët e tjera

Tekstet e ndërfaqes janë në `src/app/i18n/ui-text.sq.ts` (tipi `UiText`). Për anglisht ose
italisht: krijo `ui-text.en.ts` me të njëjtin tip dhe një konfigurim build-i me `fileReplacements`
dhe `baseHref: /en/`. Të dhënat në `src/app/data/` ndahen në të njëjtën mënyrë sipas gjuhës.

## Hostimi dhe deploy-i (Cloudflare Pages)

Build-i nxjerr vetëm skedarë statikë në `dist/kondicionim/browser`. `scripts/postbuild.ts` krijon
`404.html` (pa të, Pages kthen kryefaqen për çdo URL të panjohur).

Header-at e sigurisë dhe të cache-it janë në `public/_headers`: CSP, HSTS, `nosniff`,
`Referrer-Policy`, `Permissions-Policy` dhe cache afatgjatë vetëm për JS, CSS dhe fontet (HTML-ja
rifreskohet menjëherë). CSP-ja nuk lejon skripte inline: `postbuild.ts` shton hash-et e skripteve
të vogla të Angular-it dhe testi `e2e/security.spec.ts` kontrollon që faqja punon pa asnjë shkelje.
Kur zgjidhet analitika, domeni i saj shtohet te `script-src`/`connect-src` (shih komentet në
`_headers`).

Logoja origjinale është te `branding/logo.png`. `npm run build:logo` nxjerr prej saj versionet
për faqen (`public/images/logo/`: logoja për header-in dhe për Google) dhe simbolin për ikonat
(`branding/simboli.png`). Ikonat (favicon, Apple touch, manifest) ndërtohen me
`npm run build:icons` dhe imazhi i ndarjes së linkut me `npm run build:og`. Kur ndryshon logoja,
ekzekuto të treja me radhë; kur ndryshon emri i biznesit, `build:icons` dhe `build:og`. Hapat e publikimit në domenin final janë te
[PUBLIKIMI.md](PUBLIKIMI.md).

Deploy-i bëhet nga GitHub Actions (`.github/workflows/ci.yml`): çdo PR merr një preview me URL të
vetën, merge në `main` = deploy në prodhim. Konfigurimi një herë:

1. Në Cloudflare: **Workers & Pages → Create → Pages → Direct Upload**, projekt me emrin
   `kondicionim` (ose ndrysho `--project-name` në workflow).
2. Krijo një API token me lejen **Account → Cloudflare Pages → Edit**.
3. Në GitHub repo → **Settings → Secrets and variables → Actions** shto `CLOUDFLARE_API_TOKEN` dhe
   `CLOUDFLARE_ACCOUNT_ID`.

Pa sekretet, CI ekzekuton lint, testet dhe build-in, por e kalon hapin e deploy-it.

Për të ndryshuar hostimin (Netlify, Firebase Hosting): publiko `dist/kondicionim/browser`, konverto
`_headers` në formatin e hostit dhe vendos `404.html` si faqen e gabimit.

## Licencat e burimeve të jashtme

- Fontet Poppins dhe Open Sans: SIL Open Font License 1.1 (self-hosted në `public/fonts`)
- Harta: Natural Earth, Admin 0 Countries 1:10m, domain publik
  (https://www.naturalearthdata.com/about/terms-of-use/)
- Ikonat: Tabler Icons, licenca MIT (vetëm path-et e përdorura, në `src/app/shared/ui/icon/icons.ts`)
