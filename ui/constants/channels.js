import { AUTO_FOLLOW_CHANNELS } from 'config';

const PT_BR_CHANNELS =
  'lbry://@odyseebr#152e0ea25fb58b8f0719714a1b9ffe7344429e62' +
  ' ' +
  'lbry://@ajuda#d3a0afbe782c5ad13c944bdf12c1387302868c73';

const ES_CHANNELS =
  'lbry://@odysee.es#a8d7dfef9937c18a32f4ddf962ceb94b6293c675' +
  ' ' +
  'lbry://@ayuda#7385d06a753744996461f5aa30daa570b85bd8d2';

const DE_CHANNELS =
  'lbry://@OdyseeDE#1c44ca079e0e3a824881184fdffcf1864cb2649e' +
  ' ' +
  'lbry://@OdyseeHilfe#14dd52c6105698159df73eb1fac89da477f895ea';

export const COMMUNITY_CHANNELS = Object.freeze({
  en: AUTO_FOLLOW_CHANNELS,
  'pt-BR': PT_BR_CHANNELS,
  es: ES_CHANNELS,
  de: DE_CHANNELS,
});

// ****************************************************************************
// ****************************************************************************

export const ODYSEE_CHANNEL = Object.freeze({
  ID: '80d2590ad04e36fb1d077a9b9e3a8bba76defdf8',
  NAME: '@odysee',
});
