import { AUTO_FOLLOW_CHANNELS } from 'config';

const PT_BR_CHANNELS =
  'lbry://@odyseebr#152e0ea25fb58b8f0719714a1b9ffe7344429e62' +
  ' ' +
  'lbry://@ajuda#d3a0afbe782c5ad13c944bdf12c1387302868c73';

const DE_CHANNELS =
  'lbry://@OdyseeDE#1c44ca079e0e3a824881184fdffcf1864cb2649e' +
  ' ' +
  'lbry://@OdyseeHilfe#14dd52c6105698159df73eb1fac89da477f895ea';

const COMMUNITY_CHANNELS = {
  en: AUTO_FOLLOW_CHANNELS,
  'pt-BR': PT_BR_CHANNELS,
  es: 'lbry://@ayuda#7385d06a753744996461f5aa30daa570b85bd8d2',
  de: DE_CHANNELS,
};

export default COMMUNITY_CHANNELS;
