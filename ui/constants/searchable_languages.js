import { getLanguageName } from './languages';

const SEARCHABLE_LANGUAGES = {
  en: getLanguageName('en'),
  hr: getLanguageName('hr'),
  nl: getLanguageName('nl'),
  fr: getLanguageName('fr'),
  de: getLanguageName('de'),
  it: getLanguageName('it'),
  pl: getLanguageName('pl'),
  pt: getLanguageName('pt'),
  ru: getLanguageName('ru'),
  es: getLanguageName('es'),
  tr: getLanguageName('tr'),
  cs: getLanguageName('cs'),
};

// Properties: language code (e.g. 'ja')
// Values: name of the language in native form (e.g. '日本語')
export default SEARCHABLE_LANGUAGES;
