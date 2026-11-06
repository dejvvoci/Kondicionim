import { BUSINESS } from './business';

export interface PrivacySection {
  title: string;
  paragraphs: string[];
}

export const PRIVACY = {
  title: 'Politika e privatësisë',
  // TODO: data e përditësimit të fundit, pasi pronari të rishikojë tekstin
  updated: null as string | null,
  // TODO: teksti final rishikohet nga pronari i biznesit (dhe, nëse duhet, nga një jurist)
  intro:
    'Kjo faqe shpjegon cilat të dhëna përpunohen kur vizitoni faqen tonë dhe kur na kontaktoni. Shkurt: faqja nuk ruan të dhëna personale në asnjë server.',
  sections: [
    {
      title: 'Kush jemi',
      paragraphs: [
        'Faqja i përket biznesit të paraqitur në fund të faqes (emri dhe kontaktet). Për çdo pyetje mbi të dhënat tuaja mund të na shkruani ose të telefononi në kontaktet e mëposhtme.',
      ],
    },
    {
      title: 'Kontakti përmes WhatsApp',
      paragraphs: [
        'Faqja nuk ka formular kontakti. Kur zgjidhni shërbimin, qytetin, adresën ose shënimet, mesazhi përgatitet vetëm në browser-in tuaj. Asgjë nuk dërgohet derisa ju ta hapni WhatsApp-in dhe ta dërgoni vetë mesazhin.',
        'Pasi e dërgoni, mesazhi përpunohet nga WhatsApp (Meta) sipas kushteve të tij dhe ne e përdorim vetëm për t’ju përgjigjur dhe për të kryer punën që kërkoni.',
      ],
    },
    {
      title: 'Vendndodhja',
      paragraphs: [
        'Butoni "Shto vendndodhjen time" e kërkon vendndodhjen vetëm pasi e klikoni dhe pasi browser-i ju kërkon leje. Koordinatat shtohen në mesazh si lidhje Google Maps dhe nuk ruhen nga faqja.',
        'Mund ta refuzoni lejen: rrjedha vazhdon pa vendndodhje dhe mund ta shkruani adresën me dorë.',
      ],
    },
    {
      title: 'Çfarë ruhet në pajisjen tuaj',
      paragraphs: [
        'Për t’ju kursyer kohë herën tjetër, faqja ruan në localStorage të browser-it vetëm shërbimin dhe qytetin e zgjedhur të fundit. Nuk ruhet asnjë adresë, vendndodhje, emër ose numër telefoni. Mund ta fshini në çdo kohë nga cilësimet e browser-it.',
      ],
    },
    {
      title: 'Analitika',
      paragraphs: [
        // TODO: emri i shërbimit të analitikës pa cookies (Plausible, Umami ose Cloudflare Web Analytics)
        'Për të kuptuar si përdoret faqja, matim vizitat në mënyrë anonime me një shërbim analitike pa cookies. Matim, për shembull, sa herë hapet WhatsApp-i ose klikohet numri i telefonit, së bashku me shërbimin dhe qytetin e zgjedhur, por asnjë të dhënë që ju identifikon.',
        'Për shkak se nuk përdoren cookies, faqja nuk ju kërkon pëlqim për to.',
      ],
    },
    {
      title: 'Lidhjet me shërbime të tjera',
      paragraphs: [
        'Lidhjet drejt WhatsApp, Google Maps, Facebook, Instagram, TikTok ose YouTube ju çojnë te shërbime që kanë politikat e veta të privatësisë. Videot e YouTube ngarkohen vetëm pasi klikoni mbi to, nga domeni youtube-nocookie.com.',
      ],
    },
    {
      title: 'Të drejtat tuaja',
      paragraphs: [
        'Sipas ligjit shqiptar për mbrojtjen e të dhënave personale keni të drejtë të kërkoni informacion, korrigjim ose fshirje të të dhënave që na keni dërguar (p.sh. mesazhet në WhatsApp). Na kontaktoni dhe ju përgjigjemi pa vonesë.',
        'Mund të ankoheni edhe te Komisioneri për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale.',
      ],
    },
  ] satisfies PrivacySection[],
  contactTitle: 'Kontakti për privatësinë',
  business: BUSINESS,
};
