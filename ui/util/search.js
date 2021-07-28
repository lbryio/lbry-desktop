// @flow

import { isNameValid, isURIValid, normalizeURI, parseURI } from 'lbry-redux';
import { URL as SITE_URL, URL_LOCAL, URL_DEV } from 'config';

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
 * Returns the "livestream only" version of the given 'options'.
 *
 * Currently, the 'has_source' attribute is being used to identify livestreams.
 *
 * @param options
 * @returns {*}
 */
export function getLivestreamOnlyOptions(options: any) {
  const newOptions = Object.assign({}, options);
  delete newOptions.has_source;
  delete newOptions.stream_types;
  newOptions.has_no_source = true;
  return newOptions;
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
