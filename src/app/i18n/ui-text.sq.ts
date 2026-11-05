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
    sheetIntro:
      'Zgjidhni shërbimin dhe qytetin: mesazhi përgatitet vetë dhe e dërgoni ju nga WhatsApp.',
    service: 'Shërbimi',
    serviceOffer: 'Ofertë / vlerësim',
    serviceOther: 'Tjetër',
    city: 'Qyteti ku do të bëhet puna',
    cityOther: 'Tjetër qytet',
    cityOtherName: 'Emri i qytetit',
    address: 'Zona, lagjja ose adresa',
    optional: '(opsionale)',
    location: 'Shto vendndodhjen time',
    locationHelp: 'Vendndodhja përdoret vetëm për t’ia dërguar ustait në WhatsApp.',
    locationLoading: 'Duke marrë vendndodhjen…',
    locationAdded: 'Vendndodhja u shtua',
    locationView: 'Shiko në hartë',
    locationRemove: 'Hiq',
    locationDenied:
      'Leja për vendndodhjen u refuzua. Nuk ka problem: shkruani zonën ose adresën më sipër.',
    locationUnavailable:
      'Vendndodhja nuk u gjet. Shkruani zonën ose adresën më sipër, ose provoni sërish.',
    notes: 'Shënime',
    notesPlaceholder: 'P.sh. aparati pikon ujë',
    send: 'Vazhdo në WhatsApp',
    skip: 'Hap WhatsApp pa plotësuar',
    photoHint: 'Pasi të hapet chati, mund të dërgoni edhe foto të aparatit.',
    missingNumber: 'TODO: numri i WhatsApp mungon në business.ts',
    microcopy: 'Kontakto për të marrë një ofertë ose një vlerësim',
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
  map: {
    seeProjects: 'Shiko projektet në',
    projects: 'projekte',
    oneProject: '1 projekt',
  },
  breadcrumbs: {
    label: 'Shtegu i faqes',
    home: 'Kryefaqja',
    services: 'Shërbimet',
  },
  services: {
    eyebrow: 'Shërbimet',
    title: 'Shërbimet e kondicionimit',
    lead: 'Nga zgjedhja e sistemit te mirëmbajtja: çdo shërbim kryhet me matje dhe sipas standardeve tona të montimit.',
    serviceEyebrow: 'Shërbimi',
    includes: 'Çfarë përfshin',
    audience: 'Kujt i shërben',
    duration: 'Sa zgjat',
    photos: 'Nga punët tona',
    photoLabel: 'Foto nga një punë reale',
    price: 'Çmimi orientues',
    priceFrom: 'duke filluar nga',
    pricesLink: 'Çmimet dhe garancia',
    faq: 'Pyetje për këtë shërbim',
    others: 'Shërbime të tjera',
    allServices: 'Të gjitha shërbimet',
    ctaTitle: 'Keni nevojë për këtë shërbim?',
    ctaLead:
      'Na shkruani në WhatsApp: shërbimi është i zgjedhur, ju shtoni qytetin dhe, nëse doni, një foto.',
  },
} as const;

export type UiText = typeof UI_TEXT;
