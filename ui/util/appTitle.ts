// The window title: the page title, then the app name and version, so a screenshot or a bug report shows
// which build it came from. A page that is just "LBRY" becomes "LBRY 1.0.3".
export function titleWithVersion(pageTitle: string, version: string): string {
  const app = version ? `LBRY ${version}` : "LBRY";
  const title = (pageTitle || "").trim();
  if (!title || title === "LBRY") return app;
  return `${title} - ${app}`;
}
