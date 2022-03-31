export const IMG_CDN_PUBLISH_URL = 'https://thumbs.odycdn.com/upload.php';
export const IMG_CDN_STATUS_URL = 'https://thumbs.odycdn.com/status.php';

export const JSON_RESPONSE_KEYS = Object.freeze({
  STATUS: 'type',
  UPLOADED_URL: 'message',
  TIMESTAMP: 'timestamp',
  // --- Sample response ---
  // {
  //   "type": "success",
  //   "message": "https://thumbs.odycdn.com/90c08452a2e2ebb347c8c95f749a84c5.png",
  //   "timestamp": 1648731440
  // }
});

export const UPLOAD_CONFIG = Object.freeze({
  BLOB_KEY: 'file-input',
  ACTION_KEY: 'upload',
  ACTION_VAL: 'Upload',
});
