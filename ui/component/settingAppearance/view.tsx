import {SETTINGS_GRP} from 'constants/settings';
import React from 'react';
import * as SETTINGS from 'constants/settings';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import HomepageSelector from 'component/homepageSelector';
import SettingFullScreen from 'component/settingFullScreen';
import SettingLanguage from 'component/settingLanguage';
import SettingsRow from 'component/settingsRow';
import ThemeSelector from 'component/themeSelector';
import homepages from 'homepages';

type Props = {
  disableBackground: boolean,
  clock24h: boolean,
  searchInLanguage: boolean,
  hideBalance: boolean,
  setClientSetting: (arg1: string, arg2: boolean | string | number) => void,
  setSearchInLanguage: (arg1: boolean) => void
};

export default function SettingAppearance(props: Props) {
  const { clock24h, disableBackground, searchInLanguage, hideBalance, setClientSetting, setSearchInLanguage } = props;

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

            <SettingsRow title={__('Search only in the selected language by default')}>
              <FormField
                name="search-in-language"
                type="checkbox"
// @ts-expect-error - TS2322 - Type '{ name: string; type: string; checked: boolean; onChange: () => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                checked={searchInLanguage}
                onChange={() => setSearchInLanguage(!searchInLanguage)}
              />
            </SettingsRow>

            <SettingsRow title={__('Theme')}>
              <ThemeSelector />
            </SettingsRow>

            <SettingsRow
              title={__('Full screen')}
              subtitle={__('You can also press %shortcut%.', {
                shortcut: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
              })}
            >
              <SettingFullScreen />
            </SettingsRow>

            <SettingsRow title={__('24-hour clock')}>
              <FormField
                type="checkbox"
                name="clock24h"
                onChange={() => setClientSetting(SETTINGS.CLOCK_24H, !clock24h)}
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: () => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                checked={clock24h}
              />
            </SettingsRow>
            <SettingsRow title={__('Disable background')}>
              <FormField
                type="checkbox"
                name="background"
                onChange={() => setClientSetting(SETTINGS.DISABLE_BACKGROUND, !disableBackground)}
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: () => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                checked={disableBackground}
              />
            </SettingsRow>
            <SettingsRow title={__('Hide wallet balance in header')}>
              <FormField
                type="checkbox"
                name="hide_balance"
                onChange={() => setClientSetting(SETTINGS.HIDE_BALANCE, !hideBalance)}
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: () => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                checked={hideBalance}
              />
            </SettingsRow>
          </>
        }
      />
    </>
  );
}

// prettier-ignore
const HELP = {
  LANGUAGE: 'Multi-language support is brand new and incomplete. Switching your language may have unintended consequences, like glossolalia.',
} as const;
