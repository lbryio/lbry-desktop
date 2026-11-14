// @flow
/*
  Where a download should be saved, from the "organize downloads" settings (#602).

  Returns only the `get` params to override. An empty object keeps the daemon's
  defaults: the download directory and the uploader's original file name.

  The daemon handles name clashes itself (it appends "_1", "_2", ...) but won't
  create a missing download_directory, so callers must create it first.
*/
import path from 'path';

export const DOWNLOAD_NAMING = {
  ORIGINAL: 'original',
  TITLE: 'title',
  DATE_TITLE: 'date_title',
};

export type DownloadNaming = 'original' | 'title' | 'date_title';

export const ANONYMOUS_FOLDER = 'Anonymous';

export type DownloadTargetOptions = {
  baseDir: ?string, // the daemon's download_dir
  byChannel: boolean,
  naming: DownloadNaming,
};

export type DownloadTarget = {
  download_directory?: string,
  file_name?: string,
};

// Most filesystems cap a name at 255 bytes. Leave room for the extension and
// the daemon's "_N" clash suffix, and keep full paths short for Windows (260).
const MAX_NAME_CHARS = 150;
const MAX_NAME_BYTES = 200;
const MAX_FOLDER_CHARS = 64;
const MAX_FOLDER_BYTES = 128;

const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

// Only used when the uploaded file name has no usable extension.
const MEDIA_TYPE_EXTENSIONS: { [string]: string } = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-matroska': 'mkv',
  'video/x-msvideo': 'avi',
  'video/ogg': 'ogv',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/flac': 'flac',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'application/epub+zip': 'epub',
  'application/zip': 'zip',
  'text/plain': 'txt',
  'text/markdown': 'md',
  'text/html': 'html',
};

function utf8Length(value: string): number {
  return new TextEncoder().encode(value).length;
}

// Trim by code points (never splitting an emoji) until it fits both limits.
function truncate(value: string, maxChars: number, maxBytes: number): string {
  let chars = Array.from(value);
  if (chars.length > maxChars) chars = chars.slice(0, maxChars);
  while (chars.length && utf8Length(chars.join('')) > maxBytes) chars.pop();
  return chars.join('');
}

/**
 * Make `value` safe to use as a single file or folder name on Windows, macOS
 * and Linux. Returns "" when nothing usable is left.
 */
export function sanitizePathSegment(value: string, maxChars: number, maxBytes: number): string {
  let clean = value
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[/\\:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+/, ''); // no hidden files, "." or ".."

  clean = truncate(clean, maxChars, maxBytes).replace(/[. ]+$/, ''); // Windows drops trailing dots/spaces

  if (WINDOWS_RESERVED.test(clean)) clean = `_${clean}`;
  return clean;
}

function getExtension(source: any): string {
  if (!source) return '';

  const fromName = source.name ? path.extname(source.name) : '';
  if (/^\.[A-Za-z0-9]{1,8}$/.test(fromName)) return fromName.toLowerCase();

  const mapped = source.media_type && MEDIA_TYPE_EXTENSIONS[source.media_type.toLowerCase()];
  return mapped ? `.${mapped}` : '';
}

// Local calendar date of the release (or, failing that, the claim's last
// transaction), as YYYY-MM-DD.
function getReleaseDate(claim: StreamClaim): ?string {
  const seconds = (claim.value && claim.value.release_time) || claim.timestamp;
  if (!seconds) return null;

  const date = new Date(Number(seconds) * 1000);
  if (isNaN(date.getTime())) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getFileName(claim: StreamClaim, naming: DownloadNaming): ?string {
  if (naming !== DOWNLOAD_NAMING.TITLE && naming !== DOWNLOAD_NAMING.DATE_TITLE) return null;

  const value: any = claim.value || {};
  const extension = getExtension(value.source);

  let label = (value.title || '').trim() || claim.name || '';
  if (naming === DOWNLOAD_NAMING.DATE_TITLE) {
    const date = getReleaseDate(claim);
    if (date) label = `${date} - ${label}`;
  }

  const base = sanitizePathSegment(label, MAX_NAME_CHARS, MAX_NAME_BYTES);
  return base ? `${base}${extension}` : null;
}

function getChannelFolder(claim: StreamClaim): string {
  const channelName = claim.signing_channel && claim.signing_channel.name;
  const folder = channelName ? sanitizePathSegment(channelName, MAX_FOLDER_CHARS, MAX_FOLDER_BYTES) : '';
  return folder || ANONYMOUS_FOLDER;
}

export function getDownloadTarget(claim: ?StreamClaim, options: DownloadTargetOptions): DownloadTarget {
  const target: DownloadTarget = {};
  if (!claim) return target;

  if (options.byChannel && options.baseDir) {
    target.download_directory = path.join(options.baseDir, getChannelFolder(claim));
  }

  const fileName = getFileName(claim, options.naming);
  if (fileName) target.file_name = fileName;

  return target;
}
