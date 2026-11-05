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
npm run preview      # shërben build-in statik në http://localhost:4300
```

## Struktura

```
src/app/
  core/          # SeoService, kontakti, layout (header, footer)
  shared/ui/     # komponentët UI (button, icon, ...)
  features/      # faqet (lazy loaded)
  data/          # PËRMBAJTJA: business.ts, cities.ts, navigation.ts, ...
  i18n/          # tekstet e ndërfaqes (ui-text.sq.ts)
src/styles/      # tokens, fonts, base, typography, utilities, mixins
public/          # fontet, favicon, robots.txt, _headers (Cloudflare)
scripts/         # check-content.ts, postbuild.ts
```

## Komponentët UI

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

Vlera `null` me koment `// TODO:` = e dhënë që mungon. Në development shfaqet si placeholder i
dukshëm; në prodhim elementi fshihet. `npm run build` liston të gjitha TODO-t; para publikimit
final ekzekuto `node scripts/check-content.ts --strict` (dështon nëse ka TODO).

Pas ndryshimit: commit → push → deploy automatik.

## Gjuhët e tjera

Tekstet e ndërfaqes janë në `src/app/i18n/ui-text.sq.ts` (tipi `UiText`). Për anglisht ose
italisht: krijo `ui-text.en.ts` me të njëjtin tip dhe një konfigurim build-i me `fileReplacements`
dhe `baseHref: /en/`. Të dhënat në `src/app/data/` ndahen në të njëjtën mënyrë sipas gjuhës.

## Hostimi dhe deploy-i (Cloudflare Pages)

Build-i nxjerr vetëm skedarë statikë në `dist/kondicionim/browser`. `scripts/postbuild.ts` krijon
`404.html` (pa të, Pages kthen kryefaqen për çdo URL të panjohur). Header-at e sigurisë dhe të
cache-it janë në `public/_headers`.

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
- Ikonat: Tabler Icons, licenca MIT (vetëm path-et e përdorura, në `src/app/shared/ui/icon/icons.ts`)
