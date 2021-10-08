// @flow

import { useEffect, useState, useMemo } from 'react';
import { pushSupported, pushSubscribe, pushUnsubscribe, pushIsSubscribed } from 'web/src/pushNotifications';

export default () => {
  const [permission, setPermission] = useState(window.Notification.permission);
  const [subscribed, setSubscribed] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    pushIsSubscribed().then((isSubscribed) => {
      setSubscribed(isSubscribed);
    });
  }, []);

  useMemo(() => setIsEnabled(permission === 'granted' && subscribed), [permission, subscribed]);

  const subscribe = async () => {
    if (await pushSubscribe()) {
      setSubscribed(true);
      setPermission(window.Notification.permission);
    }
  };

  const unsubscribe = async () => {
    if (await pushUnsubscribe()) {
      setSubscribed(false);
    }
  };

  const handleToggle = async () => {
    return !isEnabled ? subscribe() : unsubscribe();
  };

  return {
    pushSupported,
    isEnabled,
    permission,
    handleToggle,
  };
};
