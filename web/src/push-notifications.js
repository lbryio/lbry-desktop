// @flow
/*
 * This module is responsible for managing browser push notification
 * subscriptions via the firebase SDK.
 */

import { Lbryio } from 'lbryinc';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from '$web/src/firebase-config';
import { addRegistration, removeRegistration, hasRegistration } from '$web/src/fcm-management';
import { browserData } from '$web/src/ua';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

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

export const pushSubscribe = async (userId: number, permanent: boolean = true): Promise<boolean> => {
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

export const pushUnsubscribe = async (userId: number, permanent: boolean = true): Promise<boolean> => {
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

export const pushIsSubscribed = async (userId: number): Promise<boolean> => {
  const swRegistration = await navigator.serviceWorker?.ready;
  if (!swRegistration || !swRegistration.pushManager) return false;
  const browserSubscriptionExists = (await swRegistration.pushManager.getSubscription()) !== null;
  const userRecordExists = hasRegistration(userId);
  return browserSubscriptionExists && userRecordExists;
};

export const pushReconnect = async (userId: number): Promise<boolean> => {
  if (hasRegistration(userId)) return pushSubscribe(userId, false);
  return false;
};

export const pushDisconnect = async (userId: number): Promise<boolean> => {
  if (hasRegistration(userId)) return pushUnsubscribe(userId, false);
  return false;
};

export const pushValidate = async (userId: number) => {
  if (!hasRegistration(userId)) return;
  window.requestIdleCallback(async () => {
    const serverTokens = await Lbryio.call('cfm', 'list');
    const fcmToken = await getFcmToken();
    if (!fcmToken) return;
    const exists = serverTokens.find((item) => item.value === fcmToken);
    if (!exists) {
      await pushSubscribe(userId, false);
    }
  });
};
