import homepages from 'homepages';
import SUPPORTED_BROWSER_LANGUAGES from 'constants/supported_browser_languages';
const DEFAULT_LANG = 'en';

export const getDefaultLanguage = () => {
  const browserLanguage = window.navigator.language;
  return SUPPORTED_BROWSER_LANGUAGES[browserLanguage] || DEFAULT_LANG;
};

// If homepages has a key "zh-Hant" return that, otherwise return "zh", otherwise "en"
export const getDefaultHomepageKey = () => {
  const language = getDefaultLanguage();
  const keys = Object.keys(homepages);
  if (keys.includes(language)) {
    return language;
  } else if (keys.include(language.slice(0, 2))) {
    return language.slice(0, 2);
  } else {
    return DEFAULT_LANG;
  }
};

/**
 * Sorts the language map by their native representation (not by language code).
 *
 * @param languages The language map to sort, e.g. "{ 'ja': '日本語', ... }"
 * @returns {[string, string][]}
 */
export function sortLanguageMap(languages) {
  return Object.entries(languages).sort((a, b) => {
    const lhs = String(a[1]);
    const rhs = String(b[1]);
    if (lhs < rhs) return -1;
    if (lhs > rhs) return 1;
    return 0;
  });
}
