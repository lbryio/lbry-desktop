// @flow
import React from 'react';

function inIFrame() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const LOAD_AD_DELAY_MS = 3000; // Wait past boot-up and core-vitals period.
const OUTBRAIN_CONTAINER_KEY = 'outbrainSizeDiv';

let script;

export default function useAdOutbrain(hasPremiumPlus: boolean, isAuthenticated: boolean) {
  // Only look at authentication for now. Eventually, we'll only use 'hasPremiumPlus'.
  // Authenticated will return undefined if not yet populated, so wait and only show
  // when returned as false
  const isNotAuthenticated = isAuthenticated === false;

  React.useEffect(() => {
    if (!inIFrame() && isNotAuthenticated && !script) {
      const loadTimer = setTimeout(() => {
        script = document.createElement('script');
        script.src = 'https://adncdnend.azureedge.net/adtags/odysee.adn.js';
        script.async = true;

        // $FlowFixMe
        document.body.appendChild(script);
      }, LOAD_AD_DELAY_MS);

      return () => clearTimeout(loadTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps, (on mount only)
  }, [isNotAuthenticated]);

  React.useEffect(() => {
    if (isAuthenticated && window[OUTBRAIN_CONTAINER_KEY]) {
      window[OUTBRAIN_CONTAINER_KEY].style.display = 'none';
    }
  }, [isAuthenticated]);
}
