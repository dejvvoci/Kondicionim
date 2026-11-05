/**
 * Tekstet e ndërfaqes (jo përmbajtja). Për një gjuhë të re: krijo ui-text.en.ts me të njëjtin
 * tip `UiText` dhe zëvendësoje me fileReplacements në konfigurimin e build-it për atë gjuhë.
 */
export const UI_TEXT = {
  lang: 'sq',
  skipToContent: 'Kalo te përmbajtja',
  common: {
    more: 'Më shumë',
    close: 'Mbyll',
  },
  nav: {
    label: 'Navigimi kryesor',
    openMenu: 'Hap menunë',
    closeMenu: 'Mbyll menunë',
    home: 'Kryefaqja',
  },
  contact: {
    call: 'Telefono',
    whatsapp: 'WhatsApp',
    offer: 'Ofertë',
    barLabel: 'Kontakt i shpejtë',
    sheetTitle: 'Na shkruani në WhatsApp',
    sheetPending: 'Formulari i shkurtër për shërbimin dhe qytetin shtohet këtu.',
    openWhatsapp: 'Hap WhatsApp',
  },
  footer: {
    contact: 'Kontakti',
    hours: 'Orari',
    cities: 'Zonat ku punojmë',
    links: 'Faqet',
    nipt: 'NIPT',
    privacy: 'Politika e privatësisë',
    rights: 'Të gjitha të drejtat e rezervuara.',
  },
  notFound: {
    title: 'Faqja nuk u gjet',
    text: 'Faqja që kërkuat nuk ekziston ose është zhvendosur. Mund të shikoni shërbimet tona ose të ktheheni te kryefaqja.',
    services: 'Shiko shërbimet',
    home: 'Kryefaqja',
  },
  placeholder: {
    wip: 'Kjo faqe është në ndërtim e sipër.',
  },
} as const;

export type UiText = typeof UI_TEXT;
