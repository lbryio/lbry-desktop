// @flow
export const MINIMUM_PUBLISH_BID = 0.0001;
export const ESTIMATED_FEE = 0.0015;

export const MY_CLAIMS_PAGE_SIZE = 10;
export const PAGE_PARAM = 'page';
export const PAGE_SIZE_PARAM = 'page_size';
export const CHANNEL_ANONYMOUS = 'anonymous';
export const CHANNEL_NEW = 'new';
export const PAGE_SIZE = 20;

export const LEVEL_1_STAKED_AMOUNT = 0;
export const LEVEL_2_STAKED_AMOUNT = 1;
export const LEVEL_3_STAKED_AMOUNT = 50;
export const LEVEL_4_STAKED_AMOUNT = 250;
export const LEVEL_5_STAKED_AMOUNT = 1000;
export const INVALID_NAME_ERROR =
  __('names cannot contain spaces or reserved symbols') + ' ' + '(?$#@;:/\\="<>%{}|^~[]`)';

export const FORCE_CONTENT_TYPE_PLAYER = [
  'video/quicktime',
  'application/x-ext-mkv',
  'video/x-matroska',
  'video/x-ms-wmv',
  'video/x-msvideo',
  'video/mpeg',
  'video/m4v',
  'audio/ogg',
  'application/x-ext-ogg',
  'application/x-ext-m4a',
];

export const FORCE_CONTENT_TYPE_COMIC = [
  'application/vnd.comicbook+zip',
  'application/vnd.comicbook-rar',
  'application/x-cbr',
  'application/x-cbt',
  'application/x-cbz',
  'application/x-cb7',
];
