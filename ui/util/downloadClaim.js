export function webDownloadClaim(streamingUrl, fileName, isSecure) {
  let element = document.createElement('a');
  element.href = streamingUrl;
  if (!isSecure) element.href += '?download=true';
  element.setAttribute('download', fileName);
  element.click();
  element.remove();
}
