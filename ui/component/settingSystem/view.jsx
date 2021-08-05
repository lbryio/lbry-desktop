// @flow
import { ALERT } from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import SettingAutoLaunch from 'component/settingAutoLaunch';
import SettingClosingBehavior from 'component/settingClosingBehavior';
import SettingsRow from 'component/settingsRow';

// @if TARGET='app'
const IS_MAC = process.platform === 'darwin';
// @endif

type Props = {
  clearCache: () => Promise<any>,
};

export default function SettingSystem(props: Props) {
  const { clearCache } = props;
  const [clearingCache, setClearingCache] = React.useState(false);

  return (
    <Card
      title={__('System')}
      subtitle=""
      isBodyList
      body={
        <>
          {/* @if TARGET='app' */}
          {/* Auto launch in a hidden state doesn't work on mac https://github.com/Teamwork/node-auto-launch/issues/81 */}
          {!IS_MAC && (
            <SettingsRow title={__('Start minimized')} subtitle={__(HELP_START_MINIMIZED)}>
              <SettingAutoLaunch noLabels />
            </SettingsRow>
          )}
          {/* @endif */}

          {/* @if TARGET='app' */}
          <SettingsRow title={__('Leave app running in notification area when the window is closed')}>
            <SettingClosingBehavior noLabels />
          </SettingsRow>
          {/* @endif */}

          <SettingsRow title={__('Clear application cache')} subtitle={__(HELP_CLEAR_CACHE)}>
            <Button
              button="secondary"
              icon={ALERT}
              label={clearingCache ? __('Clearing') : __('Clear Cache')}
              onClick={() => {
                setClearingCache(true);
                clearCache();
              }}
              disabled={clearingCache}
            />
          </SettingsRow>
        </>
      }
    />
  );
}

const HELP_START_MINIMIZED =
  'Improve view speed and help the LBRY network by allowing the app to cuddle up in your system tray.';
const HELP_CLEAR_CACHE = 'This might fix issues that you are having. Your wallet will not be affected.';
