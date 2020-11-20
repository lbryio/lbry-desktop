import homepages from 'homepages';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
const DEFAULT_LANG = 'en';

export const getDefaultHomepage = () => {
  return homepages[window.navigator.language.slice(0, 2)] ? window.navigator.language.slice(0, 2) : DEFAULT_LANG;
};

export const getDefaultLanguage = () => {
  return SUPPORTED_LANGUAGES[window.navigator.language.slice(0, 2)]
    ? window.navigator.language.slice(0, 2)
    : DEFAULT_LANG;
};
