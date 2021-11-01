// @flow

import { isSupported } from 'firebase/messaging';

export const isPushSupported = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    // Some browsers incognito expose sw but not the registration, while other don't expose sw at all.
    // $FlowIssue[incompatible-type]
    const activeRegistrations: Array<ServiceWorkerRegistration> = await navigator.serviceWorker.getRegistrations();
    const swRegistered = activeRegistrations.length > 0;
    const firebaseSupported = await isSupported();
    const notificationFeature = 'Notification' in window;
    return swRegistered && firebaseSupported && notificationFeature;
  }
  return false;
};
