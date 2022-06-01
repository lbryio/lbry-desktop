// @flow

import { isNameValid, isURIValid, normalizeURI, parseURI } from 'util/lbryURI';
import { URL as SITE_URL, URL_LOCAL, URL_DEV, SIMPLE_SITE } from 'config';
import { SEARCH_OPTIONS } from 'constants/search';
import { getSearchQueryString } from 'util/query-params';

export function createNormalizedSearchKey(query: string) {
  const removeParam = (query: string, param: string) => {
    // TODO: find a standard way to do this.
    if (query.includes(param)) {
      const a = query.indexOf(param);
      const b = query.indexOf('&', a + param.length);
      if (b > a) {
        query = query.substring(0, a) + query.substring(b);
      } else {
        query = query.substring(0, a);
      }
    }
    return query;
  };

  let normalizedQuery = query;

  // Ignore the "page" (`from`) because we don't care what the last page searched was, we want everything:
  normalizedQuery = removeParam(normalizedQuery, '&from=');
  // Remove FYP additional info:
  normalizedQuery = removeParam(normalizedQuery, '&gid=');
  normalizedQuery = removeParam(normalizedQuery, '&uuid=');

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

/**
 * The 'Recommended' search query is used as the key to store the results. This
 * function ensures all clients derive the same key by making this the only
 * place to make tweaks.
 *
 * @param matureEnabled
 * @param claimIsMature
 * @param claimId
 * @returns {{size: number, nsfw: boolean, isBackgroundSearch: boolean}}
 */
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

export function getRecommendationSearchKey(title: string, options: {}) {
  const searchQuery = getSearchQueryString(title.replace(/\//, ' '), options);
  return createNormalizedSearchKey(searchQuery);
}
