// @flow

import React, { useState } from 'react';
import { FormField } from 'component/common/form';
import Spinner from 'component/spinner';
import { SETTINGS } from 'lbry-redux';

type Props = {
  language: string,
  showToast: ({}) => void,
  setClientSetting: (string, boolean) => void,
};

function SettingLanguage(props: Props) {
  const [isFetching, setIsFetching] = useState(false);

  // this should be fetched from lbry.com/transifex
  const languages = { en: 'English', pl: 'Polski', id: 'Bahasa Indonesia', de: 'Deutsche' };

  const { language, showToast, setClientSetting } = props;

  function onLanguageChange(e) {
    const { value } = e.target;
    setIsFetching(true);

    // this should match the behavior/logic in the static index-XXX.html files
    fetch('https://lbry.com/i18n/get/lbry-desktop/app-strings/' + value + '.json')
      .then(r => r.json())
      .then(j => {
        window.i18n_messages[value] = j;
      })
      .then(() => {
        setIsFetching(false);
        window.localStorage.setItem(SETTINGS.LANGUAGE, value);
        setClientSetting(SETTINGS.LANGUAGE, value);
      })
      .catch(e => {
        showToast({
          message: __('Failed to load translations.'),
          error: true,
        });
        setIsFetching(false);
      });
  }

  return (
    <React.Fragment>
      <FormField
        name="language_select"
        type="select"
        label={__('Language')}
        onChange={onLanguageChange}
        value={language}
        helper={__(
          'Multi-language support is brand new and incomplete. Switching your language may have unintended consequences, like glossolalia.'
        )}
      >
        {Object.keys(languages).map(language => (
          <option key={language} value={language}>
            {languages[language]}
          </option>
        ))}
      </FormField>
      {isFetching && <Spinner type="small" />}
    </React.Fragment>
  );
}

export default SettingLanguage;
