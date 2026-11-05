import type { ProcessStep } from './types';

export const PROCESS: ProcessStep[] = [
  {
    title: 'Kontakti',
    text: 'Na shkruani në WhatsApp ose telefononi. Mund të dërgoni edhe foto të ambientit ose të aparatit.',
    icon: 'message-circle',
  },
  {
    title: 'Inspektimi dhe konsulenca',
    text: 'Shohim ambientin, bëjmë matjet dhe ju shpjegojmë cili sistem ka kuptim dhe pse.',
    icon: 'clipboard-check',
  },
  {
    title: 'Oferta e qartë',
    text: 'Merrni një ofertë me shkrim: çfarë përfshihet, çfarë paguhet veçmas dhe sa zgjat puna.',
    icon: 'file-description',
  },
  {
    title: 'Montimi',
    text: 'Montim sipas standardeve tona: vakumim, test me azot, tuba dhe kabllo sipas aparatit.',
    icon: 'tool',
  },
  {
    title: 'Testimi dhe dorëzimi',
    text: 'Matim presionet, temperaturat dhe rrymën, pastaj ju tregojmë si ta përdorni dhe mirëmbani.',
    icon: 'gauge',
  },
  {
    title: 'Mirëmbajtja e mëvonshme',
    text: 'Pastrim dhe kontroll periodik, që aparati të punojë me efikasitet për vite.',
    icon: 'calendar-check',
  },
];
