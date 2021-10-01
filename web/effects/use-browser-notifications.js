// @flow

import { useEffect, useState, useMemo } from 'react';
import { pushSupported, pushSubscribe, pushUnsubscribe, pushIsSubscribed } from '../src/pushNotifications';

export default () => {
  const [granted, setGranted] = useState(window.Notification.permission === 'granted');
  const [subscribed, setSubscribed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    pushIsSubscribed().then((isSubscribed) => {
      setSubscribed(isSubscribed);
    });
  }, []);

  useMemo(() => setEnabled(granted && subscribed), [granted, subscribed]);

  const requestPermission = async (): Promise<boolean> => {
    const permission = await window.Notification.requestPermission();
    const permissionGranted = permission === 'granted';
    setGranted(permissionGranted);
    return permissionGranted;
  };

  const subscribe = async () => {
    if (await pushSubscribe()) {
      setSubscribed(true);
    }
  };

  const unsubscribe = async () => {
    if (await pushUnsubscribe()) {
      setSubscribed(false);
    }
  };

  const toggleEnabled = async () => {
    if (!enabled) {
      if (await requestPermission()) {
        subscribe();
      }
    } else {
      unsubscribe();
    }
  };

  return {
    supported: pushSupported,
    enabled,
    toggleEnabled,
  };
};
