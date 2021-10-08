// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import SettingsRow from 'component/settingsRow';
import { FormField } from 'component/common/form';
import useBrowserNotifications from '$web/component/browserNotificationSettings/use-browser-notifications';
import 'scss/component/notifications-blocked.scss';
import Icon from 'component/common/icon';

const BrowserNotificationsBlocked = () => {
  return (
    <div className="notificationsBlocked">
      <Icon className="notificationsBlocked__icon" color="#E50054" icon={ICONS.ALERT} size={58} />
      <div>
        <span>{__('Heads up: browser notifications are currently blocked in this browser.')}</span>
        <span className={'notificationsBlocked__subText'}>
          {__('To enable push notifications please configure your browser to allow notifications on odysee.com.')}
        </span>
      </div>
    </div>
  );
};

const BrowserNotificationSettings = () => {
  const { pushSupported, pushEnabled, pushPermission, pushToggle } = useBrowserNotifications();

  if (!pushSupported) return null;
  if (pushPermission === 'denied') return <BrowserNotificationsBlocked />;

  return (
    <SettingsRow
      title={__('Browser Notifications')}
      subtitle={__("Receive push notifications in this browser, even when you're not on odysee.com")}
    >
      <FormField type="checkbox" name="browserNotification" onChange={pushToggle} checked={pushEnabled} />
    </SettingsRow>
  );
};

export default BrowserNotificationSettings;
