import homepages from 'homepages';
import SUPPORTED_BROWSER_LANGUAGES from 'constants/supported_browser_languages';
const DEFAULT_LANG = 'en';

export const getDefaultLanguage = () => {
  const browserLanguage = window.navigator.language;

  if (SUPPORTED_BROWSER_LANGUAGES[browserLanguage]) {
    return SUPPORTED_BROWSER_LANGUAGES[browserLanguage];
  }

  if (browserLanguage.includes('-')) {
    // Perhaps it is a sub-lang that we are currently not supporting.
    // See if we support the main one.
    const mainLang = browserLanguage.substring(0, browserLanguage.indexOf('-'));
    if (SUPPORTED_BROWSER_LANGUAGES[mainLang]) {
      return SUPPORTED_BROWSER_LANGUAGES[mainLang];
    }
  }

  return DEFAULT_LANG;
};

// If homepages has a key "zh-Hant" return that, otherwise return "zh", otherwise "en"
export const getDefaultHomepageKey = () => {
  const language = getDefaultLanguage();
  return (homepages[language] && language) || (homepages[language.slice(0, 2)] && language.slice(0, 2)) || DEFAULT_LANG;
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
