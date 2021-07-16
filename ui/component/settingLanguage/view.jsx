// @flow

import React, { useState } from 'react';
import { FormField } from 'component/common/form';
import Spinner from 'component/spinner';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import LANGUAGES from 'constants/languages';
import { getDefaultLanguage, sortLanguageMap } from 'util/default-languages';

type Props = {
  language: string,
  setLanguage: (string) => void,
  searchInLanguage: boolean,
  setSearchInLanguage: (boolean) => void,
};

function SettingLanguage(props: Props) {
  const { language, setLanguage, searchInLanguage, setSearchInLanguage } = props;
  const [previousLanguage, setPreviousLanguage] = useState(null);

  if (previousLanguage && language !== previousLanguage) {
    setPreviousLanguage(null);
  }

  function onLanguageChange(e) {
    const { value } = e.target;
    setPreviousLanguage(language || getDefaultLanguage());
    setLanguage(value);
    if (document && document.documentElement) {
      if (LANGUAGES[value].length >= 3) {
        document.documentElement.dir = LANGUAGES[value][2];
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
  }

  return (
    <React.Fragment>
      <FormField
        name="language_select"
        type="select"
        label={__('Language')}
        onChange={onLanguageChange}
        value={language || getDefaultLanguage()}
        helper={__(
          'Multi-language support is brand new and incomplete. Switching your language may have unintended consequences, like glossolalia.'
        )}
      >
        {sortLanguageMap(SUPPORTED_LANGUAGES).map(([langKey, langName]) => (
          <option key={langKey} value={langKey}>
            {langName}
          </option>
        ))}
      </FormField>
      {previousLanguage && <Spinner type="small" />}
      <FormField
        name="search-in-language"
        type="checkbox"
        label={__('Search only in this language by default')}
        checked={searchInLanguage}
        onChange={() => setSearchInLanguage(!searchInLanguage)}
      />
    </React.Fragment>
  );
}

export default SettingLanguage;
