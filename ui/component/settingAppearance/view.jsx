// @flow
import { useHistory } from 'react-router-dom';
import { SEARCH_IN_LANGUAGE } from 'constants/hashes';
import { SETTINGS_GRP } from 'constants/settings';
import React from 'react';
import * as SETTINGS from 'constants/settings';
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
  isAuthenticated: boolean,
  hideBalance: boolean,
  setClientSetting: (string, boolean | string | number) => void,
  setSearchInLanguage: (boolean) => void,
};

export default function SettingAppearance(props: Props) {
  const { clock24h, searchInLanguage, isAuthenticated, hideBalance, setClientSetting, setSearchInLanguage } = props;
  const {
    location: { hash },
  } = useHistory();
  const highlightSearchInLanguage = hash === `#${SEARCH_IN_LANGUAGE}`;

  return (
    <>
      <div className="card__title-section">
        <h2 className="card__title">{__('Appearance')}</h2>
      </div>
      <Card
        id={SETTINGS_GRP.APPEARANCE}
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

            <SettingsRow
              title={__('Search only in the selected language by default')}
              highlighted={highlightSearchInLanguage}
            >
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

            {(isAuthenticated || !IS_WEB) && (
              <SettingsRow title={__('Hide wallet balance in header')}>
                <FormField
                  type="checkbox"
                  name="hide_balance"
                  onChange={() => setClientSetting(SETTINGS.HIDE_BALANCE, !hideBalance)}
                  checked={hideBalance}
                />
              </SettingsRow>
            )}
          </>
        }
      />
    </>
  );
}

// prettier-ignore
const HELP = {
  LANGUAGE: 'Multi-language support is brand new and incomplete. Switching your language may have unintended consequences, like glossolalia.',
};
