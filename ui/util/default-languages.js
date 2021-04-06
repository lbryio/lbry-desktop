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
  return (homepages[language] && language) || (homepages[language.slice(0, 2)] && language.slice(0, 2)) || DEFAULT_LANG;
};
