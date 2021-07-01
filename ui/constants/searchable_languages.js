import LANGUAGES from './languages';

const SEARCHABLE_LANGUAGES = {
  en: LANGUAGES.en[1],
  hr: LANGUAGES.hr[1],
  nl: LANGUAGES.nl[1],
  fr: LANGUAGES.fr[1],
  de: LANGUAGES.de[1],
  it: LANGUAGES.it[1],
  pl: LANGUAGES.pl[1],
  pt: LANGUAGES.pt[1],
  ru: LANGUAGES.ru[1],
  es: LANGUAGES.es[1],
  tr: LANGUAGES.tr[1],
  cs: LANGUAGES.cs[1],
};

// Properties: language code (e.g. 'ja')
// Values: name of the language in native form (e.g. '日本語')
export default SEARCHABLE_LANGUAGES;
