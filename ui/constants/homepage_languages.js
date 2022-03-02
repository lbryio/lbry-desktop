import { getLanguageEngName } from 'constants/languages';

const HOMEPAGE_LANGUAGES = {
  en: getLanguageEngName('en'),
  fr: getLanguageEngName('fr'),
  es: getLanguageEngName('es'),
  de: getLanguageEngName('de'),
  zh: getLanguageEngName('zh'),
  ru: getLanguageEngName('ru'),
  'pt-BR': getLanguageEngName('pt-BR'),
};

export function getHomepageLanguage(code) {
  // -----override-----
  if (code === 'zh-Hans' || code === 'zh-Hant') return HOMEPAGE_LANGUAGES.zh;
  // ------------------

  return HOMEPAGE_LANGUAGES[code] || null;
}

export default HOMEPAGE_LANGUAGES;
