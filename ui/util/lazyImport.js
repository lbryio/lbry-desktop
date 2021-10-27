import React from 'react';
import * as ACTIONS from 'constants/action_types';

const RETRY_DELAY_MS = 2000;
const RETRY_ATTEMPTS = 2;

function componentLoader(lazyComponent, attemptsLeft) {
  return new Promise((resolve, reject) => {
    lazyComponent()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (attemptsLeft === 1) {
            window.store.dispatch({ type: ACTIONS.RELOAD_REQUIRED });
            console.error(error.message); // Spew the error so users can report to us if reloading doesn't help.
          } else {
            componentLoader(lazyComponent, attemptsLeft - 1).then(resolve, reject);
          }
        }, RETRY_DELAY_MS);
      });
  });
}

export function lazyImport(componentImport) {
  return React.lazy(() => componentLoader(componentImport, RETRY_ATTEMPTS));
}
