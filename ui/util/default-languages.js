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
  const homepages = window.homepages || {};
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
 * Resolves the claim_search 'any_language' parameter based on various language settings.
 *
 * @param languageSetting The user (redux) language setting.
 * @param searchInLanguageSetting By default, the user (redux) setting, but some components may override to false (e.g. 'ignoreSearchInLanguage' prop).
 * @param searchLanguages Per-instance default language list (e.g. different Categories having different filters).
 * @param languageUrlParams Language override via URLSearchParams.
 * @returns {string|null} Comma-separated string of language codes, or null.
 */
export function resolveLangForClaimSearch(
  languageSetting, // : string,
  searchInLanguageSetting, // : boolean,
  searchLanguages, // : ?Array<string>,
  languageUrlParams = null // : ?string
) {
  const langParam = languageUrlParams;

  let lang;
  if (searchInLanguageSetting) {
    lang = languageSetting;
  } else if (searchLanguages) {
    lang = searchLanguages.join(',');
  }

  if (lang) {
    if (langParam === null) {
      return lang === 'en' ? 'en,none' : lang;
    } else if (langParam === 'any') {
      return null;
    } else {
      return langParam === 'en' ? 'en,none' : langParam;
    }
  } else if (langParam === null) {
    return null;
  } else if (langParam === 'any') {
    return null;
  } else {
    return langParam === 'en' ? 'en,none' : langParam;
  }
}
