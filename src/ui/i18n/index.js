// @if TARGET='app'
import y18n from 'y18n';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const i18n = y18n({
  directory: path.join(isProduction ? __dirname : __static, `locales`),
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
