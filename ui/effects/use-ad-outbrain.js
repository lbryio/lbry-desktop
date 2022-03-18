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
const OUTBRAIN_CONTAINER_KEY = 'outbrainStickyParent';

let script;

export default function useAdOutbrain(hasPremiumPlus: boolean, isAuthenticated: boolean) {
  // Only look at authentication for now. Eventually, we'll only use 'hasPremiumPlus'.
  const isAuthenticatedRef = React.useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;

  function loadListener() {
    const container = window[OUTBRAIN_CONTAINER_KEY];
    if (container) {
      // Hide it immediately while we wait for ads to be filled. This prevents
      // the invisible container from blocking our content.
      container.style.visibility = 'hidden';

      // Restore visibility after confirming the ad is filled. If it is filled
      // after the stipulated time, well, no soup for you.
      setTimeout(() => {
        const filledAd = document.querySelector('.ob-widget-items-container');
        if (filledAd && !isAuthenticatedRef.current) {
          container.style.visibility = 'visible';
        }
      }, 5000); // 3s is sufficient for Chrome, but Firefox seems to take ~5s
    }
  }

  React.useEffect(() => {
    if (!inIFrame() && !isAuthenticated && !script) {
      const loadTimer = setTimeout(() => {
        script = document.createElement('script');
        script.src = 'https://adncdnend.azureedge.net/adtags/odysee.adn.js';
        script.async = true;
        script.addEventListener('load', loadListener); // not using 'script.onload'; seem unreliable with async.

        // $FlowFixMe
        document.body.appendChild(script);
      }, LOAD_AD_DELAY_MS);

      return () => clearTimeout(loadTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps, (on mount only)
  }, []);

  React.useEffect(() => {
    if (isAuthenticated && window[OUTBRAIN_CONTAINER_KEY]) {
      window[OUTBRAIN_CONTAINER_KEY].style.display = 'none';
    }
  }, [isAuthenticated]);
}
