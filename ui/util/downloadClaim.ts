//@ts-nocheck
export function webDownloadClaim(streamingUrl: unknown, fileName: unknown) {
  // @if TARGET='web'
  let element = document.createElement('a');
  element.setAttribute('href', `${streamingUrl}?download=true`);
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  // @endif
}
