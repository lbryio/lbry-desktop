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

/**
 * Resolves the language parameter for a claim_search based on various settings.
 *
 * @param langSetting The user's language setting.
 * @param searchInSelectedLangOnly Return results in the given language only.
 * @param langParam Language override for specific use-cases, typically from urlParam.
 * @returns {string|null} Comma-separated string of language codes, or null.
 */
export function resolveLangForClaimSearch(langSetting, searchInSelectedLangOnly, langParam = null) {
  // TODO: expand ternary for easier maintenance.
  return searchInSelectedLangOnly
    ? langParam === null
      ? langSetting.concat(langSetting === 'en' ? ',none' : '')
      : langParam === 'any'
      ? null
      : langParam.concat(langParam === 'en' ? ',none' : '')
    : langParam === null
    ? null
    : langParam === 'any'
    ? null
    : langParam.concat(langParam === 'en' ? ',none' : '');
}
