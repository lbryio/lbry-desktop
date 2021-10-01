// @flow
export function formatBytes(bytes: number, decimals?: number = 2) {
  if (bytes === 0) return __('0 Bytes');

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [__('Bytes'), __('KB'), __('MB'), __('GB'), __('TB'), __('PB'), __('EB'), __('ZB'), __('YB')];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
