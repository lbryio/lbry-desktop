import y18n from 'y18n';

const i18n = y18n({
  directory: `static/locales`.replace(/\\/g, '\\\\'),
  updateFiles: false,
  locale: 'en',
});

export default i18n;
