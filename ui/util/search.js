// @flow

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
