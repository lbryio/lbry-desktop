// @flow
import { SEARCH_OPTIONS } from 'constants/search';
import { SIMPLE_SITE } from 'config';

const DEFAULT_SEARCH_RESULT_FROM = 0;
const DEFAULT_SEARCH_SIZE = 20;

export function parseQueryParams(queryString: string) {
  if (queryString === '') return {};
  const parts = queryString
    .split('?')
    .pop()
    .split('&')
    .map((p) => p.split('='));

  const params = {};
  parts.forEach((array) => {
    const [first, second] = array;
    params[first] = second;
  });
  return params;
}

// https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
export function updateQueryParam(uri: string, key: string, value: string) {
  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  const separator = uri.includes('?') ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2');
  } else {
    return uri + separator + key + '=' + value;
  }
}

export const getSearchQueryString = (query: string, options: any = {}) => {
  const FORCE_FREE_ONLY = SIMPLE_SITE;
  const isSurroundedByQuotes = (str) => str[0] === '"' && str[str.length - 1] === '"';
  const encodedQuery = encodeURIComponent(query);
  const queryParams = [
    options.exact && !isSurroundedByQuotes(encodedQuery) ? `s="${encodedQuery}"` : `s=${encodedQuery}`,
    `free_only=true`,
    `size=${options.size || DEFAULT_SEARCH_SIZE}`,
    `from=${options.from || DEFAULT_SEARCH_RESULT_FROM}`,
    // `mediaType=${SEARCH_OPTIONS.MEDIA_VIDEO}`,
    // `claimType=${SEARCH_OPTIONS.INCLUDE_FILES}`,
  ];

  const { isBackgroundSearch } = options;
  const includeUserOptions = typeof isBackgroundSearch === 'undefined' ? false : !isBackgroundSearch;

  if (includeUserOptions) {
    const claimType = options[SEARCH_OPTIONS.CLAIM_TYPE];
    if (claimType) {
      queryParams.push(`claimType=${claimType}`);

      /*
       * Due to limitations in lighthouse, we can't pass the mediaType parameter
       * when searching for channels or "everything".
       */
      if (!claimType.includes(SEARCH_OPTIONS.INCLUDE_CHANNELS)) {
        queryParams.push(
          `mediaType=${[
            SEARCH_OPTIONS.MEDIA_FILE,
            SEARCH_OPTIONS.MEDIA_AUDIO,
            SEARCH_OPTIONS.MEDIA_VIDEO,
            SEARCH_OPTIONS.MEDIA_TEXT,
            SEARCH_OPTIONS.MEDIA_IMAGE,
            SEARCH_OPTIONS.MEDIA_APPLICATION,
          ].reduce((acc, currentOption) => (options[currentOption] ? `${acc}${currentOption},` : acc), '')}`
        );
      }
    }

    const sortBy = options[SEARCH_OPTIONS.SORT];
    if (sortBy) {
      queryParams.push(`${SEARCH_OPTIONS.SORT}=${sortBy}`);
    }

    const timeFilter = options[SEARCH_OPTIONS.TIME_FILTER];
    if (timeFilter) {
      queryParams.push(`${SEARCH_OPTIONS.TIME_FILTER}=${timeFilter}`);
    }
  }

  const additionalOptions = {};
  const { related_to } = options;
  const { nsfw } = options;

  if (related_to) additionalOptions['related_to'] = related_to;
  if (nsfw === false) additionalOptions['nsfw'] = false;

  if (additionalOptions) {
    Object.keys(additionalOptions).forEach((key) => {
      const option = additionalOptions[key];
      queryParams.push(`${key}=${option}`);
    });
  }

  if (FORCE_FREE_ONLY) {
    const index = queryParams.findIndex((q) => q.startsWith('free_only'));
    if (index > -1) {
      queryParams.splice(index, 1);
    }
    queryParams.push(`free_only=true`);
  }

  return queryParams.join('&');
};
