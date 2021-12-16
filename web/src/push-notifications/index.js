// @flow
/*
 * This module is responsible for managing browser push notification
 * subscriptions via the firebase SDK.
 */

import { Lbryio } from 'lbryinc';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from '$web/src/firebase-config';
import { addRegistration, removeRegistration, hasRegistration } from '$web/src/push-notifications/fcm-management';
import { browserData } from '$web/src/ua';
import { isPushSupported } from '$web/src/push-notifications/push-supported';

let messaging = null;
let pushSystem = null;

(async () => {
  const supported = await isPushSupported();
  if (supported) {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    pushSystem = {
      supported: true,
      subscribe,
      unsubscribe,
      subscribed,
      reconnect,
      disconnect,
      validate,
    };
  }
})();

// Proxy will forward to push system if it's supported.
// $FlowIssue[incompatible-type]
export default new Proxy(
  {},
  {
    get(target, prop) {
      if (pushSystem) {
        return pushSystem[prop];
      } else {
        if (prop === 'supported') return false;
        throw new Error('Push notifications are not supported in this browser environment.');
      }
    },
  }
);

const subscriptionMetaData = () => {
  const isMobile = window.navigator.userAgentData?.mobile || false;
  const browserName = browserData.browser?.name || 'unknown';
  const osName = browserData.os?.name || 'unknown';
  return { type: `web-${isMobile ? 'mobile' : 'desktop'}`, name: `${browserName}-${osName}` };
};

const getFcmToken = async (): Promise<string | void> => {
  const swRegistration = await navigator.serviceWorker?.ready;
  if (!swRegistration) return;
  return getToken(messaging, { serviceWorkerRegistration: swRegistration, vapidKey });
};

const subscribe = async (userId: number, permanent: boolean = true): Promise<boolean> => {
  try {
    const fcmToken = await getFcmToken();
    if (!fcmToken) return false;
    await Lbryio.call('cfm', 'add', { token: fcmToken, ...subscriptionMetaData() });
    if (permanent) addRegistration(userId);
    return true;
  } catch {
    return false;
  }
};

const unsubscribe = async (userId: number, permanent: boolean = true): Promise<boolean> => {
  try {
    const fcmToken = await getFcmToken();
    if (!fcmToken) return false;
    await deleteToken(messaging);
    await Lbryio.call('cfm', 'remove', { token: fcmToken });
    if (permanent) removeRegistration(userId);
    return true;
  } catch {
    return false;
  }
};

const subscribed = async (userId: number): Promise<boolean> => {
  const swRegistration = await navigator.serviceWorker?.ready;
  if (!swRegistration || !swRegistration.pushManager) return false;
  const browserSubscriptionExists = (await swRegistration.pushManager.getSubscription()) !== null;
  const userRecordExists = hasRegistration(userId);
  return browserSubscriptionExists && userRecordExists;
};

const reconnect = async (userId: number): Promise<boolean> => {
  if (hasRegistration(userId)) return subscribe(userId, false);
  return false;
};

const disconnect = async (userId: number): Promise<boolean> => {
  if (hasRegistration(userId)) return unsubscribe(userId, false);
  return false;
};

const validate = async (userId: number) => {
  if (!hasRegistration(userId)) return;
  window.requestIdleCallback(async () => {
    const serverTokens = await Lbryio.call('cfm', 'list');
    const fcmToken = await getFcmToken();
    if (!fcmToken) return;
    const exists = serverTokens.find((item) => item.value === fcmToken);
    if (!exists) {
      await subscribe(userId, false);
    }
  });
};
