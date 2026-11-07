import type { ProcessStep } from './types';

export const PROCESS: ProcessStep[] = [
  {
    title: 'Kontakti',
    text: 'Na shkruani në WhatsApp ose telefononi. Mund të dërgoni edhe foto të ambientit ose të aparatit.',
    icon: 'message-circle',
  },
  {
    title: 'Inspektimi dhe oferta',
    text: 'Shohim ambientin, bëjmë matjet dhe ju japim një ofertë me shkrim: çfarë përfshihet dhe sa zgjat puna.',
    icon: 'clipboard-check',
  },
  {
    title: 'Montimi dhe testimi',
    text: 'Punojmë sipas standardeve tona dhe para dorëzimit bëjmë matjet, pastaj ju tregojmë si ta përdorni.',
    icon: 'tool',
  },
  {
    title: 'Mirëmbajtja e mëvonshme',
    text: 'Pastrim dhe kontroll periodik, që aparati të punojë me efikasitet për vite.',
    icon: 'calendar-check',
  },
];
