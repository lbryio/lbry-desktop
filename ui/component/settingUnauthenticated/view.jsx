/**
 * Settings that we allow for unauthenticated users.
 */

// @flow
import React from 'react';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import HomepageSelector from 'component/homepageSelector';
import SettingLanguage from 'component/settingLanguage';
import SettingsRow from 'component/settingsRow';
// $FlowFixMe
import homepages from 'homepages';

type Props = {
  searchInLanguage: boolean,
  setSearchInLanguage: (boolean) => void,
};

export default function SettingUnauthenticated(props: Props) {
  const { searchInLanguage, setSearchInLanguage } = props;

  return (
    <Card
      isBodyList
      body={
        <>
          <SettingsRow title={__('Language')} subtitle={__(HELP_LANGUAGE)}>
            <SettingLanguage />
          </SettingsRow>

          <SettingsRow title={__('Search only in the selected language by default')}>
            <FormField
              name="search-in-language"
              type="checkbox"
              checked={searchInLanguage}
              onChange={() => setSearchInLanguage(!searchInLanguage)}
            />
          </SettingsRow>

          {homepages && Object.keys(homepages).length > 1 && (
            <SettingsRow title={__('Homepage')} subtitle={__('Tailor your experience.')}>
              <HomepageSelector />
            </SettingsRow>
          )}
        </>
      }
    />
  );
}

// prettier-ignore
const HELP_LANGUAGE = 'Multi-language support is brand new and incomplete. Switching your language may have unintended consequences, like glossolalia.';
