// @flow
import React from 'react';
import * as PAGES from 'constants/pages';

function inIFrame() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const EXCLUDED_PATHS = Object.freeze([`/$/${PAGES.AUTH}`, `/$/${PAGES.AUTH_SIGNIN}`, `/$/${PAGES.AUTH_VERIFY}`]);

const LOAD_AD_DELAY_MS = 3000; // Wait past boot-up and core-vitals period.
const OUTBRAIN_CONTAINER_KEY = 'outbrainSizeDiv';
let script;

/**
 * @param hasPremiumPlus
 * @param isAuthenticated
 * @param pathname Reminder: the component using this effect must be listening
 *                 to path changes (e.g. useHistory, etc.). This value must not
 *                 come from window.location.pathname, which doesn't spark an
 *                 update.
 */
export default function useAdOutbrain(hasPremiumPlus: boolean, isAuthenticated: boolean, pathname: string) {
  // Only look at authentication for now. Eventually, we'll only use 'hasPremiumPlus'.
  // Authenticated will return undefined if not yet populated, so wait and only show
  // when returned as false
  const isNotAuthenticated = isAuthenticated === false;

  const propRef = React.useRef({ isAuthenticated, pathname });
  propRef.current = { isAuthenticated, pathname };

  function resolveVisibility() {
    if (window[OUTBRAIN_CONTAINER_KEY]) {
      if (propRef.current.isAuthenticated) {
        window[OUTBRAIN_CONTAINER_KEY].style.display = 'none';
      } else {
        window[OUTBRAIN_CONTAINER_KEY].style.display = EXCLUDED_PATHS.includes(propRef.current.pathname) ? 'none' : '';
      }
    }
  }

  React.useEffect(() => {
    if (!inIFrame() && isNotAuthenticated && !script) {
      const loadTimer = setTimeout(() => {
        script = document.createElement('script');
        script.src = 'https://adncdnend.azureedge.net/adtags/odysee.adn.js';
        script.async = true;
        script.addEventListener('load', resolveVisibility);

        // $FlowFixMe
        document.body.appendChild(script);
      }, LOAD_AD_DELAY_MS);

      return () => clearTimeout(loadTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNotAuthenticated]);

  React.useEffect(() => {
    resolveVisibility();
  }, [isAuthenticated, pathname]);
}
