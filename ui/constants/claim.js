export const MINIMUM_PUBLISH_BID = 0.0001;
export const ESTIMATED_FEE = 0.048; // .001 + .001 | .048 + .048 = .1

export const CHANNEL_ANONYMOUS = 'anonymous';
export const CHANNEL_NEW = 'new';
export const PAGE_SIZE = 20;
export const MY_CLAIMS_PAGE_SIZE = 10;
export const PAGE_PARAM = 'page';
export const PAGE_SIZE_PARAM = 'page_size';

export const INVALID_NAME_ERROR =
  __('LBRY names cannot contain spaces or reserved symbols') + ' ' + '(?$#@;:/\\="<>%{}|^~[]`)';

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
