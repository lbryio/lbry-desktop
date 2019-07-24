// @if TARGET='app'
import y18n from 'y18n';
import path from 'path';

const i18n = y18n({
  directory: path.join(__dirname, `locales`),
  updateFiles: true,
  locale: 'en',
});
// @endif
// @if TARGET='web'
const i18n = {
  setLocale: () => {},
  getLocale: () => null,
  __: x => x,
  __n: x => x,
};
// @endif

export default i18n;
