if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./public/pwa/sw.js').then(function(reg) {
    console.log('Successfully registered service worker', reg);
  }).catch(function(err) {
    console.warn('Error whilst registering service worker', err);
  });
}
