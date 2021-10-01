// @flow

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

self.addEventListener('message', (event) => {
  if (event.data.type === 'BROWSER_NOTIFICATION') {
    showNotification(event.data.data);
  }
});

// @Note: Most basic payload will be something like:
// { "title": "New Video on Odysee!", "opts": { "body": "Click here to check out the video.", "data": { "url" : "https://odysee.com" } } }
self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    showNotification(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error parsing notification data: ', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  if (!event.notification.data || !event.notification.data.url) return;
  event.notification.close();
  self.clients.openWindow(event.notification.data.url);
});

const defaultNotificationOptions = { badge: '/public/pwa/icon-512.png', icon: '/public/pwa/icon-512.png' };

const canShowNotification = () => self.Notification && self.Notification.permission === 'granted';

const validNotificationData = (data) => 'title' in data;

const constructNotification = (data): Object => {
  if (!canShowNotification()) throw new Error('Notification permission not granted.');
  if (!validNotificationData(data)) throw new Error('Invalid notification data.');

  const title = data.title;
  const opts = Object.assign({}, defaultNotificationOptions, data.opts);

  return { title, opts };
};

const showNotification = (data) => {
  const { title, opts } = constructNotification(data);
  self.registration.showNotification(title, opts);
};
