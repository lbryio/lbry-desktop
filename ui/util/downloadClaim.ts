export function webDownloadClaim(streamingUrl: string, fileName: string): void {
  // @if TARGET='web'
  const element = document.createElement("a");
  element.setAttribute("href", `${streamingUrl}?download=true`);
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  // @endif
}
