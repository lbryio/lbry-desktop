// @flow
import { useEffect, useState, useMemo } from 'react';
import { pushSupported, pushSubscribe, pushUnsubscribe, pushIsSubscribed } from '$web/src/pushNotifications';

export default () => {
  const [pushPermission, setPushPermission] = useState(window.Notification.permission);
  const [subscribed, setSubscribed] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    pushIsSubscribed().then((isSubscribed) => {
      setSubscribed(isSubscribed);
    });
  }, []);

  useMemo(() => setPushEnabled(pushPermission === 'granted' && subscribed), [pushPermission, subscribed]);

  const subscribe = async () => {
    if (await pushSubscribe()) {
      setSubscribed(true);
      setPushPermission(window.Notification.permission);
    }
  };

  const unsubscribe = async () => {
    if (await pushUnsubscribe()) {
      setSubscribed(false);
    }
  };

  const pushToggle = async () => {
    return !pushEnabled ? subscribe() : unsubscribe();
  };

  return {
    pushSupported,
    pushEnabled,
    pushPermission,
    pushToggle,
  };
};
