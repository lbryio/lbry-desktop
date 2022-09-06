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
};

function SettingLanguage(props: Props) {
  const { language, setLanguage } = props;
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
      {!previousLanguage && (
        <FormField
          name="language_select"
          type="select"
          onChange={onLanguageChange}
          value={language || getDefaultLanguage()}
        >
          {sortLanguageMap(SUPPORTED_LANGUAGES).map(([langKey, langName]) => (
            <option key={langKey} value={langKey}>
              {langName}
            </option>
          ))}
        </FormField>
      )}

      {previousLanguage && <Spinner type="small" />}
    </React.Fragment>
  );
}

export default SettingLanguage;
