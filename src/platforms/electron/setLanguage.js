import SUPPORTED_LANGUAGES from '../../ui/constants/supported_languages';

export default async function setLanguage(window) {
  const storedLanguage = await window.webContents.executeJavaScript("localStorage.getItem('language')");
  const lang = storedLanguage || app.getLocale().slice(0, 2) || 'en';
  const supportedNonEnglish = Object.keys(SUPPORTED_LANGUAGES).filter(language => language !== 'en');

  if (supportedNonEnglish.includes(lang)) {
    fetch('https://lbry.com/i18n/get/lbry-desktop/app-strings/' + lang + '.json')
      .then(response => response.json())
      .then(json => {
        const messages = {};
        messages[lang] = json;
        window.webContents.send('language-set', messages, lang);
      })
      .catch(error => {
        window.webContents.send('language-set', {}, lang, error);
      });
  } else {
    window.webContents.send('language-set', {}, lang);
  }
}
