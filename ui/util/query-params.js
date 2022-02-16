// @flow
import { SEARCH_OPTIONS } from 'constants/search';

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
  const isSurroundedByQuotes = (str) => str[0] === '"' && str[str.length - 1] === '"';
  const encodedQuery = encodeURIComponent(query);
  const queryParams = [
    options.exact && !isSurroundedByQuotes(encodedQuery) ? `s="${encodedQuery}"` : `s=${encodedQuery}`,
    `size=${options.size || DEFAULT_SEARCH_SIZE}`,
    `from=${options.from || DEFAULT_SEARCH_RESULT_FROM}`,
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
  const { free_only } = options;
  const { channel_id } = options;

  if (related_to) additionalOptions[SEARCH_OPTIONS.RELATED_TO] = related_to;
  if (free_only) additionalOptions[SEARCH_OPTIONS.PRICE_FILTER_FREE] = true;
  if (nsfw === false) additionalOptions[SEARCH_OPTIONS.INCLUDE_MATURE] = false;
  if (channel_id) additionalOptions[SEARCH_OPTIONS.CHANNEL_ID] = channel_id;

  if (additionalOptions) {
    Object.keys(additionalOptions).forEach((key) => {
      const option = additionalOptions[key];
      queryParams.push(`${key}=${option}`);
    });
  }

  return queryParams.join('&');
};
