import React from 'react';

let localStorageAvailable;
try {
  localStorageAvailable = Boolean(window.localStorage);
} catch (e) {
  localStorageAvailable = false;
}

export const lazyImport = (componentImport) =>
  React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = localStorageAvailable
      ? JSON.parse(window.localStorage.getItem('page-has-been-force-refreshed') || 'false')
      : false;

    try {
      const component = await componentImport();
      if (localStorageAvailable) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'false');
      }
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // It's highly likely that the user's session is old. Try reloading once.
        if (localStorageAvailable) {
          window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        }
        return window.location.reload();
      }

      // If it still didn't work, then relay the error.
      throw error;
    }
  });
