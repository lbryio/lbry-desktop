// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./serviceWorker.js')
    .then(function (reg) {
      // reg.scope must be '/' to allow '/' as start url
    })
    .catch(function (err) {
      // console.warn('Error whilst registering service worker', err);
    });
}

// used to fetch the manifest file
self.addEventListener('fetch', () => {});
