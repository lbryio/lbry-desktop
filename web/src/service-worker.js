import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
import { firebaseConfig } from '$web/src/firebase-config';

const app = initializeApp(firebaseConfig);
getMessaging(app);

const NOTIFICATION_ICON = '/public/pwa/icon-512.png';
const NOTIFICATION_BADGE = '/public/pwa/icon-96-alpha.png';

// used to fetch the manifest file.
self.addEventListener('fetch', () => {});

self.addEventListener('install', (event) => {
  // Activate worker immediately.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  // Become available to all pages.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      const { data } = event.data.json();

      if (!data.title || !data.body || !data.link) return;

      return self.registration.showNotification(data.title, {
        body: data.body,
        data: { url: data.link },
        badge: NOTIFICATION_BADGE,
        icon: NOTIFICATION_ICON,
      });
    })()
  );
});

self.addEventListener('notificationclick', async (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      if (!event.notification.data || !event.notification.data.url) return;
      await self.clients.claim();
      let client = await getWindowClient();

      if (!client) {
        return await self.clients.openWindow(event.notification.data.url);
      } else {
        client = await client.focus();
        return client.navigate(event.notification.data.url);
      }
    })()
  );
});

const getWindowClient = async () => {
  const clientList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  return Array.isArray(clientList) && clientList.length > 0 ? clientList[0] : null;
};
