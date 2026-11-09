// Odysee's image upload service, used for thumbnails and other images when publishing.
// The app used spee.ch before, but spee.ch now redirects every request to Odysee's image CDN.
export const IMG_CDN_PUBLISH_URL = 'https://thumbs.odycdn.com/upload';

// The service's limit, as Odysee's own frontend enforces it.
export const IMG_CDN_SIZE_LIMIT_BYTES = 5 * 1024 * 1024;

// Form fields the service expects. It answers with JSON like:
//   { "type": "success", "message": "https://thumbs.odycdn.com/<hash>.png", "timestamp": 1648731440 }
// and with plain text (e.g. "http: no such file") when it rejects a request.
export const IMG_CDN_UPLOAD_FIELDS = Object.freeze({
  FILE: 'file-input',
  ACTION: 'upload',
  ACTION_VALUE: 'Upload',
});
