// @flow
import * as React from 'react';
import SettingsRow from 'component/settingsRow';
import { FormField } from 'component/common/form';
import useBrowserNotifications from '$web/component/browserNotificationSettings/use-browser-notifications';
import { BrowserNotificationHints, BrowserNotificationsBlocked } from '$web/component/browserNotificationHints';

const BrowserNotificationSettings = () => {
  const { pushSupported, pushEnabled, pushPermission, pushToggle, pushErrorModal } = useBrowserNotifications();

  const pushBlocked = pushPermission === 'denied';

  const renderHints = () => (!pushSupported ? <BrowserNotificationHints /> : null);
  const renderBlocked = () => (pushBlocked ? <BrowserNotificationsBlocked /> : null);

  return (
    <>
      <SettingsRow
        title={__('Browser Notifications')}
        subtitle={__("Receive push notifications in this browser, even when you're not on odysee.com")}
        disabled={!pushSupported || pushBlocked}
      >
        <FormField
          type="checkbox"
          name="browserNotification"
          disabled={!pushSupported || pushBlocked}
          onChange={pushToggle}
          checked={pushEnabled}
        />
      </SettingsRow>
      {renderHints()}
      {renderBlocked()}
      {pushErrorModal()}
    </>
  );
};

export default BrowserNotificationSettings;
