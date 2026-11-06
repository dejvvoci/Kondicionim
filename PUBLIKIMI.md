# Publikimi në domenin final

Hapat për ta nxjerrë faqen nga `kondicionim.pages.dev` në domenin e biznesit. Shumica bëhen
një herë, në llogaritë e pronarit (Cloudflare, Google, regjistruesi i domenit). Në kod ndryshon
vetëm një rresht (hapi 4).

Faqja publikohet vetëm pasi të jenë mbledhur materialet reale (seksioni 9 i specifikimit) dhe
`node scripts/check-content.ts --strict` të mos gjejë asnjë `TODO`.

## 1. Domeni

- Zgjidh `.al` (nga një regjistrues i akredituar në Shqipëri) ose `.com`, me emrin e biznesit.
- Regjistrohet **në emër të pronarit të biznesit**, jo të zhvilluesit, me **rinovim automatik**.

## 2. DNS në Cloudflare

1. Cloudflare → **Add a site** → shkruaj domenin → plani Free.
2. Te regjistruesi i domenit, zëvendëso nameserver-at me dy nameserver-at që jep Cloudflare.
   Ndryshimi mund të zgjasë deri në 24 orë.
3. **SSL/TLS → Overview**: modaliteti **Full**. **SSL/TLS → Edge Certificates**: aktivizo
   **Always Use HTTPS** dhe **Minimum TLS Version 1.2**.
   (HSTS dërgohet tashmë nga `public/_headers`, ndaj nuk aktivizohet edhe këtu.)

## 3. Domeni te Cloudflare Pages

1. **Workers & Pages → kondicionim → Custom domains → Set up a custom domain**: shto `domeni.al`
   dhe pastaj `www.domeni.al`. Cloudflare krijon vetë rekordet DNS dhe certifikatën.
2. **www → domeni kryesor me 301**: **Rules → Redirect Rules → Create rule**, shablloni
   "Redirect from WWW to root": kur `Hostname` është `www.domeni.al`, ridrejto te
   `https://domeni.al` me të njëjtin path, status **301**, ruaj query string-un.
3. **pages.dev → domeni**: **Bulk Redirects** me burim `kondicionim.pages.dev` dhe destinacion
   `https://domeni.al`, status 301, me "Preserve path suffix" dhe "Subpath matching", që Google të
   mos indeksojë dy kopje. Preview-t e PR-ve (`*.kondicionim.pages.dev`) mbeten; Cloudflare u
   shton vetë `X-Robots-Tag: noindex`.
4. Kontrollo që **Production branch** i projektit të jetë `main`.

## 4. Ndryshimi në kod

Në `src/app/data/business.ts`:

```ts
siteUrl: 'https://domeni.al',
```

Pastaj commit → PR → merge. Canonical-et, Open Graph, JSON-LD, `sitemap.xml` dhe `robots.txt`
marrin vetë domenin e ri. Nëse ndryshon edhe emri i biznesit: `npm run build:og` dhe
`npm run build:icons`.

## 5. Email profesional (opsionale)

P.sh. `info@domeni.al` te një ofrues email-i (Google Workspace, Zoho, etj.). Ofruesi jep rekordet
**MX**, **SPF** (TXT), **DKIM** (TXT/CNAME) dhe shto edhe **DMARC**, p.sh.
`_dmarc` TXT `v=DMARC1; p=quarantine; rua=mailto:info@domeni.al`. Të gjitha shtohen te Cloudflare
→ DNS. Pastaj vendos email-in te `business.ts`.

## 6. Lista e kontrollit për publikim

- [ ] Asnjë TODO ose placeholder: `node scripts/check-content.ts --strict` kalon
- [ ] Telefoni dhe WhatsApp-i testuar në një Android dhe një iPhone real (butonat, shiriti,
      forma WhatsApp me vendndodhje)
- [ ] Pamja e linkut kur ndahet në WhatsApp dhe Facebook (imazhi OG, titulli, përshkrimi).
      Facebook: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Google Search Console: property e tipit **Domain**, verifikuar me rekord TXT në
      Cloudflare; `https://domeni.al/sitemap.xml` i dërguar
- [ ] Bing Webmaster Tools: importuar nga Search Console
- [ ] Google Business Profile: krijuar ose përditësuar, me linkun e faqes dhe **i njëjti emër,
      adresë/zonë dhe telefon** si në faqe
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) pa gabime për kryefaqen,
      një shërbim, FAQ-në dhe një artikull
- [ ] Analitika e zgjedhur (pa cookies) regjistron `whatsapp_open` dhe `phone_click`; domeni i saj
      shtuar në CSP te `public/_headers`
- [ ] Ridrejtimet: `http://` → `https://`, `www` → domeni kryesor, `pages.dev` → domeni, dhe një
      URL e panjohur kthen faqen 404 me status 404
- [ ] Header-at e sigurisë në domenin final (p.sh. me [securityheaders.com](https://securityheaders.com))
- [ ] Favicon, `manifest.webmanifest` dhe ikona Apple touch shfaqen saktë
- [ ] Monitorim uptime (p.sh. UptimeRobot): monitor HTTPS për `https://domeni.al/` çdo 5 minuta,
      me njoftim me email te pronari

## 7. Pas publikimit

Shih "Përditësimi i përmbajtjes" te [README.md](README.md). Synimi: 1–2 projekte të reja dhe 1
artikull në muaj.
