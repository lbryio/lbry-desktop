// Can't use aliases here because we're doing exports/require

const PAGES = require("../constants/pages");
const { parseURI, buildURI } = require("../util/lbryURI");
const COLLECTIONS_CONSTS = require("../constants/collections");

function encodeWithSpecialCharEncode(string: string): string {
  // encodeURIComponent doesn't encode `'` and others
  // which other services may not like
  return encodeURIComponent(string).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
}

export const formatLbryUrlForWeb = (uri: string): string => {
  let newUrl = uri.replace("lbry://", "/").replace(/#/g, ":");
  if (newUrl.startsWith("/?")) {
    // This is a lbry link to an internal page ex: lbry://?rewards
    newUrl = newUrl.replace("/?", "/$/");
  }

  return newUrl;
};

export const formatFileSystemPath = (path: string | null | undefined): string | undefined => {
  if (!path) {
    return;
  }

  let webUrl = path.replace(/\\/g, "/");

  if (webUrl[0] !== "/") {
    webUrl = `/${webUrl}`;
  }

  return encodeURI(`file://${webUrl}`).replace(/[?#]/g, encodeURIComponent);
};

/*
  Function that handles page redirects
  ex: lbry://?rewards
  ex: open.lbry.com/?rewards
*/
export const formatInAppUrl = (path: string): string => {
  // Determine if we need to add a leading "/$/" for app pages
  const APP_PAGE_REGEX = /(\?)([a-z]*)(.*)/;
  const appPageMatches = APP_PAGE_REGEX.exec(path);

  if (appPageMatches && appPageMatches.length) {
    // Definitely an app page (or it's formatted like one)
    const [, , page, queryString] = appPageMatches;

    if (Object.values(PAGES).includes(page)) {
      let actualUrl = "/$/" + page;

      if (queryString) {
        actualUrl += `?${queryString.slice(1)}`;
      }

      return actualUrl;
    }
  }

  // Regular claim url
  return path;
};

export const formatWebUrlIntoLbryUrl = (pathname: string, search: string): string => {
  // If there is no uri, the user is on an internal page
  // pathname will either be "/" or "/$/{page}"
  const path = pathname.startsWith("/$/") ? pathname.slice(3) : pathname.slice(1);
  let appLink = `lbry://?${path || PAGES.DISCOVER}`;

  if (search) {
    // We already have a leading "?" for the query param on internal pages
    appLink += search.replace("?", "&");
  }

  return appLink;
};

export const generateInitialUrl = (hash: string): string => {
  let url = "/";
  if (hash) {
    hash = hash.replace("#", "");
    url = hash.startsWith("/") ? hash : "/" + hash;
  }
  return url;
};

export const generateLbryContentUrl = (canonicalUrl: string | null | undefined, permanentUrl: string): string => {
  return canonicalUrl ? canonicalUrl.split("lbry://")[1] : permanentUrl.split("lbry://")[1];
};

export const generateLbryWebUrl = (lbryUrl: string): string => {
  return lbryUrl.replace(/#/g, ":");
};

export const generateEncodedLbryURL = (
  domain: string,
  lbryWebUrl: string,
  includeStartTime: boolean,
  startTime: number,
  listId: string | number | null | undefined
): string => {
  const urlParams = new URLSearchParams();

  if (includeStartTime) {
    urlParams.append("t", startTime.toString());
  }

  if (listId) {
    urlParams.append(COLLECTIONS_CONSTS.COLLECTION_ID, String(listId));
  }
  const urlParamsString = urlParams.toString();
  const encodedPart = encodeWithSpecialCharEncode(`${lbryWebUrl}?${urlParamsString}`);
  return `${domain}/${encodedPart}`;
};

export const generateShareUrl = (
  domain: string,
  lbryUrl: string,
  referralCode: string | null | undefined,
  rewardsApproved: boolean,
  includeStartTime: boolean,
  startTime: number,
  listId: string | number | null | undefined
): string => {
  const urlParams = new URLSearchParams();
  if (referralCode && rewardsApproved) {
    urlParams.append("r", referralCode);
  }

  if (listId) {
    urlParams.append(COLLECTIONS_CONSTS.COLLECTION_ID, String(listId));
  }

  if (includeStartTime) {
    urlParams.append("t", startTime.toString());
  }

  const urlParamsString = urlParams.toString();

  const { streamName, streamClaimId, channelName, channelClaimId } = parseURI(lbryUrl);

  const uriParts = {
    ...(streamName ? { streamName: encodeWithSpecialCharEncode(streamName) } : {}),
    ...(streamClaimId ? { streamClaimId } : {}),
    ...(channelName ? { channelName: encodeWithSpecialCharEncode(channelName) } : {}),
    ...(channelClaimId ? { channelClaimId } : {}),
  };

  const encodedUrl = buildURI(uriParts, false);
  const lbryWebUrl = encodedUrl.replace(/#/g, ":");

  const url = `${domain}/${lbryWebUrl}` + (urlParamsString === "" ? "" : `?${urlParamsString}`);
  return url;
};

export const generateRssUrl = (
  domain: string,
  channelClaim: { value_type?: string; canonical_url?: string } | null | undefined
): string => {
  if (!channelClaim || channelClaim.value_type !== "channel" || !channelClaim.canonical_url) {
    return "";
  }

  const url = `${domain}/$/rss/${channelClaim.canonical_url.replace("lbry://", "").replace("#", ":")}`;
  return url;
};

export const generateListSearchUrlParams = (collectionId: string): string => {
  const urlParams = new URLSearchParams();
  urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, collectionId);
  return `?` + urlParams.toString();
};
