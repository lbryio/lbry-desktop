//@ts-nocheck
// Can't use aliases here because we're doing exports/require

const PAGES = require('../constants/pages');
const { parseURI, buildURI } = require('../util/lbryURI');
const COLLECTIONS_CONSTS = require('../constants/collections');

function encodeWithSpecialCharEncode(string: unknown) {
  // encodeURIComponent doesn't encode `'` and others
  // which other services may not like
  return encodeURIComponent(string).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

export const formatLbryUrlForWeb = (uri: unknown) => {
  let newUrl = uri.replace('lbry://', '/').replace(/#/g, ':');
  if (newUrl.startsWith('/?')) {
    // This is a lbry link to an internal page ex: lbry://?rewards
    newUrl = newUrl.replace('/?', '/$/');
  }

  return newUrl;
};

export const formatFileSystemPath = (path: unknown) => {
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
export const formatInAppUrl = (path: unknown) => {
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

export const formatWebUrlIntoLbryUrl = (pathname: unknown, search: unknown) => {
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

export const generateInitialUrl = (hash: unknown) => {
  let url = '/';
  if (hash) {
    hash = hash.replace('#', '');
    url = hash.startsWith('/') ? hash : '/' + hash;
  }
  return url;
};

export const generateLbryContentUrl = (canonicalUrl: unknown, permanentUrl: unknown) => {
  return canonicalUrl ? canonicalUrl.split('lbry://')[1] : permanentUrl.split('lbry://')[1];
};

export const generateLbryWebUrl = (lbryUrl: unknown) => {
  return lbryUrl.replace(/#/g, ':');
};

export const generateEncodedLbryURL = (domain: unknown, lbryWebUrl: unknown, includeStartTime: unknown, startTime: unknown, listId: unknown) => {
  let urlParams = new URLSearchParams();

  if (includeStartTime) {
    urlParams.append('t', startTime.toString());
  }

  if (listId) {
    urlParams.append(COLLECTIONS_CONSTS.COLLECTION_ID, listId);
  }
  const urlParamsString = urlParams.toString();
  const encodedPart = encodeWithSpecialCharEncode(`${lbryWebUrl}?${urlParamsString}`);
  return `${domain}/${encodedPart}`;
};

export const generateShareUrl = (
  domain: unknown,
  lbryUrl: unknown,
  referralCode: unknown,
  rewardsApproved: unknown,
  includeStartTime: unknown,
  startTime: unknown,
  listId: unknown
) => {
  let urlParams = new URLSearchParams();
  if (referralCode && rewardsApproved) {
    urlParams.append('r', referralCode);
  }

  if (listId) {
    urlParams.append(COLLECTIONS_CONSTS.COLLECTION_ID, listId);
  }

  if (includeStartTime) {
    urlParams.append('t', startTime.toString());
  }

  const urlParamsString = urlParams.toString();

  const { streamName, streamClaimId, channelName, channelClaimId } = parseURI(lbryUrl);

  let uriParts = {
    ...(streamName ? { streamName: encodeWithSpecialCharEncode(streamName) } : {}),
    ...(streamClaimId ? { streamClaimId } : {}),
    ...(channelName ? { channelName: encodeWithSpecialCharEncode(channelName) } : {}),
    ...(channelClaimId ? { channelClaimId } : {}),
  };

  const encodedUrl = buildURI(uriParts, false);
  const lbryWebUrl = encodedUrl.replace(/#/g, ':');

  const url = `${domain}/${lbryWebUrl}` + (urlParamsString === '' ? '' : `?${urlParamsString}`);
  return url;
};

export const generateRssUrl = (domain: unknown, channelClaim: unknown) => {
  if (!channelClaim || channelClaim.value_type !== 'channel' || !channelClaim.canonical_url) {
    return '';
  }

  const url = `${domain}/$/rss/${channelClaim.canonical_url.replace('lbry://', '').replace('#', ':')}`;
  return url;
};

export const generateListSearchUrlParams = (collectionId: unknown) => {
  const urlParams = new URLSearchParams();
  urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, collectionId);
  return `?` + urlParams.toString();
};
