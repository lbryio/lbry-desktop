// Can't use aliases here because we're doing exports/require
const PAGES = require('../constants/pages');

exports.formatLbryUrlForWeb = uri => {
  let newUrl = uri.replace('lbry://', '/').replace(/#/g, ':');
  if (newUrl.startsWith('/?')) {
    // This is a lbry link to an internal page ex: lbry://?rewards
    newUrl = newUrl.replace('/?', '/$/');
  }

  return newUrl;
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

/*
  Function that handles page redirects
  ex: lbry://?rewards
  ex: open.lbry.com/?rewards
*/
exports.formatInAppUrl = path => {
  // Determine if we need to add a leading "/$/" for app pages
  const APP_PAGE_REGEX = /(\?)([a-z]*)(.*)/;
  const appPageMatches = APP_PAGE_REGEX.exec(path);

  if (appPageMatches && appPageMatches.length) {
    // Definitely an app page (or it's formatted like one)
    const [, , page, queryString] = appPageMatches;

    if (Object.values(PAGES).includes(page)) {
      let actualUrl = '/$/' + page;

      if (queryString) {
        actualUrl += `?${queryString.slice(1)}`;
      }

      return actualUrl;
    }
  }

  // Regular claim url
  return path;
};

exports.formatWebUrlIntoLbryUrl = (pathname, search) => {
  // If there is no uri, the user is on an internal page
  // pathname will either be "/" or "/$/{page}"
  const path = pathname.startsWith('/$/') ? pathname.slice(3) : pathname.slice(1);
  let appLink = `lbry://?${path || PAGES.DISCOVER}`;

  if (search) {
    // We already have a leading "?" for the query param on internal pages
    appLink += search.replace('?', '&');
  }

  return appLink;
};

exports.generateInitialUrl = hash => {
  let url = '/';
  if (hash) {
    hash = hash.replace('#', '');
    url = hash.startsWith('/') ? hash : '/' + hash;
  }
  return url;
};

exports.generateLbryContentUrl = (canonicalUrl, permanentUrl) => {
  return canonicalUrl ? canonicalUrl.split('lbry://')[1] : permanentUrl.split('lbry://')[1];
};

exports.generateLbryWebUrl = lbryUrl => {
  return lbryUrl.replace(/#/g, ':');
};

exports.generateEncodedLbryURL = (openUrl, lbryWebUrl, includeStartTime, startTime) => {
  const queryParam = includeStartTime ? `?t=${startTime}` : '';
  const encodedPart = encodeURIComponent(`${lbryWebUrl}${queryParam}`);
  return `${openUrl}${encodedPart}`;
};

exports.generateOpenDotLbryDotComUrl = (
  openUrl,
  lbryWebUrl,
  canonicalUrl,
  permanentUrl,
  referralCode,
  rewardsApproved,
  includeStartTime,
  startTime
) => {
  let urlParams = new URLSearchParams();
  if (referralCode && rewardsApproved) {
    urlParams.append('r', referralCode);
  }

  if (includeStartTime) {
    urlParams.append('t', startTime.toString());
  }

  const urlParamsString = urlParams.toString();
  const url = `${openUrl}${lbryWebUrl}` + (urlParamsString === '' ? '' : `?${urlParamsString}`);
  return url;
};
