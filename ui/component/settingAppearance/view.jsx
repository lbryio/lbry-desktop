// @flow
import React from 'react';
import { SETTINGS } from 'lbry-redux';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import HomepageSelector from 'component/homepageSelector';
import SettingLanguage from 'component/settingLanguage';
import ThemeSelector from 'component/themeSelector';
// $FlowFixMe
import homepages from 'homepages';

type Props = {
  clock24h: boolean,
  setClientSetting: (string, boolean | string | number) => void,
};

export default function SettingAppearance(props: Props) {
  const { clock24h, setClientSetting } = props;

  return (
    <Card
      title={__('Appearance')}
      subtitle=""
      isBodyList
      body={
        <>
          {/* --- Homepage --- */}
          {homepages && Object.keys(homepages).length > 1 && (
            <div className="card__main-actions">
              <HomepageSelector />
            </div>
          )}

          {/* --- Language --- */}
          <div className="card__main-actions">
            <SettingLanguage />
          </div>

          SettingsRow title={__('Theme')}>
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
