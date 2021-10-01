// @flow

import { urlBase64ToUint8Array } from '../src/util';

export const pushSupported: boolean =
  'serviceWorker' in navigator && 'Notification' in window && 'PushManager' in window;

let sw;
// $FlowIssue[incompatible-type]
navigator.serviceWorker.ready.then((registration) => {
  sw = registration;
});

export const pushSubscribe = async (): Promise<PushSubscription> => {
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    ),
  });
  return subscription;
};

export const pushUnsubscribe = async (): Promise<boolean> => {
  const currentSubscription = await sw.pushManager.getSubscription();
  if (!currentSubscription) return true;
  const unsubscribe = await currentSubscription.unsubscribe();
  return unsubscribe;
};

export const pushIsSubscribed = async (): Promise<boolean> => {
  const currentSubscription = await sw.pushManager.getSubscription();
  return currentSubscription !== null;
};

export const pushCreateNotification = async (data: Object) => {
  // $FlowIssue[incompatible-type]
  navigator.serviceWorker.controller.postMessage({ type: 'BROWSER_NOTIFICATION', data });
};
