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
