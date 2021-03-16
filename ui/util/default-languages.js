import homepages from 'homepages';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
const DEFAULT_LANG = 'en';

/**
 * Checks if the given language is an alias of a language that we support, and
 * returns the version that the rest of the application (lbry-sdk, Transifex)
 * expects. If the given language is not an expected alias, the original value
 * is returned.
 *
 * @param lang
 * @returns {*}
 */
export function resolveLanguageAlias(lang) {
  const KNOWN_LANG_ALIASES = {
    'zh-CN': 'zh-Hans',
    'zh-TW': 'zh-Hant',
  };
  return KNOWN_LANG_ALIASES[lang] ? KNOWN_LANG_ALIASES[lang] : lang;
}

/**
 * Returns the native language of the system, filtered/resolved
 * to the language code format that the application expects.
 *
 * @returns {string|*}
 */
export const getDefaultLanguage = () => {
  const browserLanguage = resolveLanguageAlias(window.navigator.language);

  if (SUPPORTED_LANGUAGES[browserLanguage]) {
    return browserLanguage;
  } else {
    if (browserLanguage.includes('-')) {
      // Perhaps it is a sub-lang that we are currently not supporting.
      // See if we support the main one.
      const mainLang = browserLanguage.substring(0, browserLanguage.indexOf('-'));
      if (SUPPORTED_LANGUAGES[mainLang]) {
        return mainLang;
      } else {
        return DEFAULT_LANG;
      }
    } else {
      return DEFAULT_LANG;
    }
  }
};

// If homepages has a key "zh-Hant" return that, otherwise return "zh", otherwise "en"
export const getDefaultHomepageKey = () => {
  const language = getDefaultLanguage();
  return (homepages[language] && language) || (homepages[language.slice(0, 2)] && language.slice(0, 2)) || DEFAULT_LANG;
};
