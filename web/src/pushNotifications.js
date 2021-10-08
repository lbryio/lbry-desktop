// @flow

import { Lbryio } from 'lbryinc';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken, isSupported } from 'firebase/messaging';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_VAPID_KEY,
} from 'config';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const vapidKey = FIREBASE_VAPID_KEY;

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const pushSupported: boolean = isSupported();

export const pushSubscribe = async (): Promise<boolean> => {
  try {
    // $FlowIssue[incompatible-type]
    const swRegistration = await navigator.serviceWorker.ready;
    const fcmToken = await getToken(messaging, { serviceWorkerRegistration: swRegistration, vapidKey });
    // @TODO: remove after testing is complete.
    console.info('created token: ', fcmToken);
    await Lbryio.call('cfm', 'add', {
      token: fcmToken,
      type: 'web',
      name: navigator.userAgent,
    });
    return true;
  } catch (err) {
    return false;
  }
};

export const pushUnsubscribe = async (): Promise<boolean> => {
  // $FlowIssue[incompatible-type]
  const swRegistration = await navigator.serviceWorker.ready;
  const fcmToken = await getToken(messaging, { serviceWorkerRegistration: swRegistration, vapidKey });
  if (!fcmToken) return true;

  try {
    await deleteToken(messaging);
    await Lbryio.call('cfm', 'remove', { token: fcmToken });
    return true;
  } catch (err) {
    return false;
  }
};

export const pushIsSubscribed = async (): Promise<boolean> => {
  // $FlowIssue[incompatible-type]
  const swRegistration = await navigator.serviceWorker.ready;
  return (await swRegistration.pushManager.getSubscription()) !== null;
};

export const pushCreateNotification = async (data: Object) => {
  // $FlowIssue[incompatible-type]
  navigator.serviceWorker.controller.postMessage({ type: 'BROWSER_NOTIFICATION', data });
};
