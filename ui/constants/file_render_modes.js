export const VIDEO = 'video';
export const AUDIO = 'audio';

export const FLOATING_MODES = [VIDEO, AUDIO]; // these types will show in floating player

export const PDF = 'pdf';
export const DOCX = 'docx';
export const HTML = 'html';
export const MARKDOWN = 'md';
export const DOCUMENT = 'document';
export const PLAIN_TEXT = 'plain_text';

export const TEXT_MODES = [PDF, DOCUMENT, PLAIN_TEXT, DOCX, HTML, MARKDOWN]; // these types will use text/document layout

export const IMAGE = 'image';
export const CAD = 'cad';
export const COMIC = 'comic';

// These types can only be render if download completed
export const NON_STREAM_MODES = IS_WEB ? [CAD, COMIC] : [CAD, COMIC, ...TEXT_MODES];

export const AUTO_RENDER_MODES = [IMAGE].concat(TEXT_MODES);
export const WEB_SHAREABLE_MODES = FLOATING_MODES;

export const DOWNLOAD = 'download';
export const APPLICATION = 'application';
export const UNSUPPORTED = 'unsupported';

export const UNSUPPORTED_IN_THIS_APP = IS_WEB ? [CAD, COMIC, APPLICATION] : [APPLICATION];

export const UNRENDERABLE_MODES = Array.from(
  new Set(UNSUPPORTED_IN_THIS_APP.concat([DOWNLOAD, APPLICATION, UNSUPPORTED]))
);
