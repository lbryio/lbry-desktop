import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
import { firebaseConfig } from '$web/src/firebase-config';

const app = initializeApp(firebaseConfig);
getMessaging(app);

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
