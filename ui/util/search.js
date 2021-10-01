// @flow

import { isNameValid, isURIValid, normalizeURI, parseURI } from 'lbry-redux';
import { URL as SITE_URL, URL_LOCAL, URL_DEV, SIMPLE_SITE } from 'config';
import { SEARCH_OPTIONS } from 'constants/search';

export function createNormalizedSearchKey(query: string) {
  const FROM = '&from=';

  // Ignore the "page" (`from`) because we don't care what the last page
  // searched was, we want everything.
  let normalizedQuery = query;
  if (normalizedQuery.includes(FROM)) {
    const a = normalizedQuery.indexOf(FROM);
    const b = normalizedQuery.indexOf('&', a + FROM.length);
    if (b > a) {
      normalizedQuery = normalizedQuery.substring(0, a) + normalizedQuery.substring(b);
    } else {
      normalizedQuery = normalizedQuery.substring(0, a);
    }
  }
  return normalizedQuery;
}

/**
 * getUriForSearchTerm
 * @param term
 * @returns {string[]|*[]|(string|string)[]}
 */
export function getUriForSearchTerm(term: string) {
  const WEB_DEV_PREFIX = `${URL_DEV}/`;
  const WEB_LOCAL_PREFIX = `${URL_LOCAL}/`;
  const WEB_PROD_PREFIX = `${SITE_URL}/`;
  const ODYSEE_PREFIX = `https://odysee.com/`;
  const includesLbryTvProd = term.includes(WEB_PROD_PREFIX);
  const includesOdysee = term.includes(ODYSEE_PREFIX);
  const includesLbryTvLocal = term.includes(WEB_LOCAL_PREFIX);
  const includesLbryTvDev = term.includes(WEB_DEV_PREFIX);
  const wasCopiedFromWeb = includesLbryTvDev || includesLbryTvLocal || includesLbryTvProd || includesOdysee;
  const isLbryUrl = term.startsWith('lbry://') && term !== 'lbry://';
  const error = '';

  const addLbryIfNot = (term) => {
    return term.startsWith('lbry://') ? term : `lbry://${term}`;
  };

  if (wasCopiedFromWeb) {
    let prefix = WEB_PROD_PREFIX;
    if (includesLbryTvLocal) prefix = WEB_LOCAL_PREFIX;
    if (includesLbryTvDev) prefix = WEB_DEV_PREFIX;
    if (includesOdysee) prefix = ODYSEE_PREFIX;

    let query = (term && term.slice(prefix.length).replace(/:/g, '#')) || '';
    try {
      const lbryUrl = `lbry://${query}`;
      parseURI(lbryUrl);
      return [lbryUrl, null];
    } catch (e) {
      return [query, 'error'];
    }
  }

  if (!isLbryUrl) {
    if (term.startsWith('@')) {
      if (isNameValid(term.slice(1))) {
        return [term, null];
      } else {
        return [term, error];
      }
    }
    return [addLbryIfNot(term), null];
  } else {
    try {
      const isValid = isURIValid(term);
      if (isValid) {
        let uri;
        try {
          uri = normalizeURI(term);
        } catch (e) {
          return [term, null];
        }
        return [uri, null];
      } else {
        return [term, null];
      }
    } catch (e) {
      return [term, 'error'];
    }
  }
}

export function getRecommendationSearchOptions(matureEnabled: boolean, claimIsMature: boolean, claimId: string) {
  const options = { size: 20, nsfw: matureEnabled, isBackgroundSearch: true };

  if (SIMPLE_SITE) {
    options[SEARCH_OPTIONS.CLAIM_TYPE] = SEARCH_OPTIONS.INCLUDE_FILES;
    options[SEARCH_OPTIONS.MEDIA_VIDEO] = true;
    options[SEARCH_OPTIONS.PRICE_FILTER_FREE] = true;
  }

  if (matureEnabled || !claimIsMature) {
    options[SEARCH_OPTIONS.RELATED_TO] = claimId;
  }

  return options;
}
