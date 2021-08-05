// @flow
import React from 'react';
import { SETTINGS } from 'lbry-redux';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import HomepageSelector from 'component/homepageSelector';
import SettingLanguage from 'component/settingLanguage';
import SettingsRow from 'component/settingsRow';
import ThemeSelector from 'component/themeSelector';
// $FlowFixMe
import homepages from 'homepages';

type Props = {
  clock24h: boolean,
  searchInLanguage: boolean,
  setClientSetting: (string, boolean | string | number) => void,
  setSearchInLanguage: (boolean) => void,
};

export default function SettingAppearance(props: Props) {
  const { clock24h, searchInLanguage, setClientSetting, setSearchInLanguage } = props;

  return (
    <Card
      title={__('Appearance')}
      subtitle=""
      isBodyList
      body={
        <>
          {homepages && Object.keys(homepages).length > 1 && (
            <SettingsRow title={__('Homepage')} subtitle={__('Tailor your experience.')}>
              <HomepageSelector />
            </SettingsRow>
          )}

          <SettingsRow title={__('Language')} subtitle={__(HELP.LANGUAGE)}>
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

          <SettingsRow title={__('Theme')}>
            <ThemeSelector />
          </SettingsRow>

          <SettingsRow title={__('24-hour clock')}>
            <FormField
              type="checkbox"
              name="clock24h"
              onChange={() => setClientSetting(SETTINGS.CLOCK_24H, !clock24h)}
              checked={clock24h}
            />
          </SettingsRow>
        </>
      }
    />
  );
}

// prettier-disable
const HELP = {
  LANGUAGE: 'Multi-language support is brand new and incomplete. Switching your language may have unintended consequences, like glossolalia.',
};
