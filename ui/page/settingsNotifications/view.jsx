// @flow
import * as SETTINGS from 'constants/settings';
import * as React from 'react';

import Page from 'component/page';
import { FormField } from 'component/common/form';
import Card from 'component/common/card';
import SettingsRow from 'component/settingsRow';

type Props = {
  osNotificationsEnabled: boolean,
  setClientSetting: (string, boolean) => void,
};

export default function NotificationSettingsPage(props: Props) {
  const { osNotificationsEnabled, setClientSetting } = props;

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      className="card-stack"
      backout={{ title: __('Manage notifications'), backLabel: __('Back') }}
    >
      <div className="card-stack">
        <div>
          <h2 className="card__title">{__('App notifications')}</h2>
          <div className="card__subtitle">{__('Notification settings for the desktop app.')}</div>
        </div>
        <Card
          isBodyList
          body={
            <SettingsRow
              title={__('Show Desktop Notifications')}
              subtitle={__('Get notified when an upload or channel is confirmed.')}
            >
              <FormField
                type="checkbox"
                name="desktopNotification"
                onChange={() => setClientSetting(SETTINGS.OS_NOTIFICATIONS_ENABLED, !osNotificationsEnabled)}
                checked={osNotificationsEnabled}
              />
            </SettingsRow>
          }
        />
      </div>
    </Page>
  );
}
