// @flow
import React, { useEffect, useState, useMemo } from 'react';
import pushNotifications from '$web/src/push-notifications';
import { BrowserNotificationErrorModal } from '$web/component/browserNotificationHints';

// @todo: Once we are on Redux 7 we should have proper hooks we can use here for store access.
import { store } from '$ui/store';
import { selectUser } from 'redux/selectors/user';
import analytics, { GA_DIMENSIONS } from 'analytics';

export default () => {
  const [pushPermission, setPushPermission] = useState(window.Notification?.permission);
  const [subscribed, setSubscribed] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(true);
  const [encounteredError, setEncounteredError] = useState(false);
  const [pushInitialized, setPushInitialized] = useState(false);

  const [user] = useState(selectUser(store.getState()));

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setPushSupported(pushNotifications.supported);
    if (pushNotifications.supported) {
      pushNotifications.subscribed(user.id).then((isSubscribed: boolean) => {
        if (mounted) {
          setSubscribed(isSubscribed);
          setPushInitialized(true);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  useMemo(() => setPushEnabled(pushPermission === 'granted' && subscribed), [pushPermission, subscribed]);

  const subscribe = async () => {
    if (!user) return;
    setEncounteredError(false);
    try {
      const subscribed = await pushNotifications.subscribe(user.id);
      if (subscribed) {
        setSubscribed(true);
        setPushPermission(window.Notification?.permission);
      }
    } catch {
      setEncounteredError(true);
      analytics.reportEvent('browser_notification', { [GA_DIMENSIONS.ACTION]: 'subscribe_failed' });
    }
    analytics.reportEvent('browser_notification', { [GA_DIMENSIONS.ACTION]: 'subscribed' });
  };

  const unsubscribe = async () => {
    if (!user) return;
    if (await pushNotifications.unsubscribe(user.id)) {
      setSubscribed(false);
      analytics.reportEvent('browser_notification', { [GA_DIMENSIONS.ACTION]: 'unsubscribed' });
    }
  };

  const pushToggle = async () => {
    return !pushEnabled ? subscribe() : unsubscribe();
  };

  const pushRequest = async () => {
    return window.Notification?.permission !== 'granted' ? subscribe() : null;
  };

  const pushErrorModal = () => {
    return <>{encounteredError && <BrowserNotificationErrorModal doHideModal={() => setEncounteredError(false)} />}</>;
  };

  return {
    pushInitialized,
    pushSupported,
    pushEnabled,
    pushPermission,
    pushToggle,
    pushRequest,
    pushErrorModal,
  };
};
