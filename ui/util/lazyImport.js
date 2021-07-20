import React from 'react';

export const lazyImport = (componentImport) =>
  React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.localStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // It's highly likely that the user's session is old. Try reloading once.
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }

      // If it still didn't work, then relay the error.
      throw error;
    }
  });
