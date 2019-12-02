const LBRY_INC_DOMAINS = ['lbry.io', 'lbry.com', 'lbry.tv', 'lbry.tech', 'lbry.fund', 'spee.ch'];

exports.formatLbryUrlForWeb = uri => {
  return uri.replace('lbry://', '/').replace(/#/g, ':');
};

exports.formatFileSystemPath = path => {
  if (!path) {
    return;
  }

  let webUrl = path.replace(/\\/g, '/');

  if (webUrl[0] !== '/') {
    webUrl = `/${webUrl}`;
  }

  return encodeURI(`file://${webUrl}`).replace(/[?#]/g, encodeURIComponent);
};

exports.isLBRYDomain = uri => {
  if (!uri) {
    return;
  }

  const myURL = new URL(uri);
  const hostname = myURL.hostname;

  for (let domain of LBRY_INC_DOMAINS) {
    if (hostname.endsWith(domain)) {
      return true;
    }
  }

  return false;
};

/*
  Function that handles page redirects
  ex: lbry://?rewards
  ex: open.lbry.com/?rewards
*/
exports.formatCustomUrl = path => {
  // Determine if we need to add a leading "/$/" for app pages
  const APP_PAGE_REGEX = /(\?)([a-z]*)(.*)/;
  const appPageMatches = APP_PAGE_REGEX.exec(path);

  if (appPageMatches && appPageMatches.length) {
    // Definitely an app page (or it's formatted like one)
    const [, , page, queryString] = appPageMatches;
    let actualUrl = '/$/' + page;

    if (queryString) {
      if (queryString.startsWith('?')) {
        actualUrl += queryString;
      } else if (queryString.startsWith('&')) {
        // Replace the leading "&" with a "?" because we must have lost the "?" from the page name
        // /?rewards&a=b => /$/rewards?a=b
        actualUrl += `?${queryString.slice(1)}`;
      }

      return actualUrl;
    }
  }

  // Regular claim url
  return path;
};
