import LANGUAGES from './languages';

const SUPPORTED_BROWSER_LANGUAGES = {
  en: LANGUAGES.en[1],
  da: LANGUAGES.da[1],
  'zh-CN': LANGUAGES['zh-Hans'][1],
  'zh-TW': LANGUAGES['zh-Hant'][1],
  'zh-Hans': LANGUAGES['zh-Hans'][1],
  'zh-Hant': LANGUAGES['zh-Hant'][1],
  hr: LANGUAGES.hr[1],
  nl: LANGUAGES.nl[1],
  fr: LANGUAGES.fr[1],
  de: LANGUAGES.de[1],
  gu: LANGUAGES.gu[1],
  hi: LANGUAGES.hi[1],
  id: LANGUAGES.id[1],
  jv: LANGUAGES.jv[1],
  it: LANGUAGES.it[1],
  ms: LANGUAGES.ms[1],
  ml: LANGUAGES.ml[1],
  mr: LANGUAGES.mr[1],
  pa: LANGUAGES.pa[1],
  pl: LANGUAGES.pl[1],
  pt: LANGUAGES.pt[1],
  ro: LANGUAGES.ro[1],
  ru: LANGUAGES.ru[1],
  sr: LANGUAGES.sr[1],
  sk: LANGUAGES.sk[1],
  ur: LANGUAGES.ur[1],
  ca: LANGUAGES.ca[1],
  es: LANGUAGES.es[1],
  sv: LANGUAGES.sv[1],
  tr: LANGUAGES.tr[1],
  cs: LANGUAGES.cs[1],
  kn: LANGUAGES.kn[1],
  uk: LANGUAGES.uk[1],
};

// Properties: language code (e.g. 'ja')
// Values: name of the language in native form (e.g. '日本語')
export default SUPPORTED_BROWSER_LANGUAGES;
