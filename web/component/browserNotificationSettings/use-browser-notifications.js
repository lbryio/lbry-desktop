// @flow
import React, { useEffect, useState, useMemo } from 'react';
import pushNotifications from '$web/src/push-notifications';
import { BrowserNotificationErrorModal } from '$web/component/browserNotificationHints';

// @todo: Once we are on Redux 7 we should have proper hooks we can use here for store access.
import { store } from '$ui/store';
import { selectUser } from 'redux/selectors/user';

export default () => {
  const [pushPermission, setPushPermission] = useState(window.Notification?.permission);
  const [subscribed, setSubscribed] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(true);
  const [encounteredError, setEncounteredError] = useState(false);
  const [pushInitialized, setPushInitialized] = useState(false);

  const [user] = useState(selectUser(store.getState()));

  useEffect(() => {
    setPushSupported(pushNotifications.supported);
    if (pushNotifications.supported) {
      pushNotifications.subscribed(user.id).then((isSubscribed: boolean) => {
        setSubscribed(isSubscribed);
        setPushInitialized(true);
      });
    }
  }, [user]);

  useMemo(() => setPushEnabled(pushPermission === 'granted' && subscribed), [pushPermission, subscribed]);

  const subscribe = async () => {
    setEncounteredError(false);
    try {
      if (await pushNotifications.subscribe(user.id)) {
        setSubscribed(true);
        setPushPermission(window.Notification?.permission);
        return true;
      } else {
        setEncounteredError(true);
      }
    } catch {
      setEncounteredError(true);
    }
  };

  const unsubscribe = async () => {
    if (await pushNotifications.unsubscribe(user.id)) {
      setSubscribed(false);
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
