// @flow
const formatterCache = {};

// Creating multiple Intl.NumberFormat instances can
// be expensive, that's why we perform a very simple
// cache.
// See https://github.com/formatjs/formatjs/issues/27#issuecomment-61148808
export function getFormatter(language?: string, options: any) {
  const key = `${language || ''}:${JSON.stringify(options || {})}`;
  if (!formatterCache[key]) {
    formatterCache[key] = new Intl.NumberFormat(language, options);
  }
  return formatterCache[key];
}
