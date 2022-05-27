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
 * @param hasPremiumPlus `undefined` if not yet fetched, boolean otherwise.
 * @param isAuthenticated `undefined` if email is not fetched, boolean
 *   otherwise.
 * @param pathname Reminder: the component using this effect must be listening
 *                 to path changes (e.g. useHistory, etc.). This value must not
 *                 come from window.location.pathname, which doesn't spark an
 *                 update.
 */
export default function useAdOutbrain(hasPremiumPlus: ?boolean, isAuthenticated: ?boolean, pathname: string) {
  // Still need to look at `isAuthenticated` because `hasPremiumPlus` remains
  // in unfetched (`undefined) state in Incognito.
  const loadScript = isAuthenticated === false || hasPremiumPlus === false;

  const propRef = React.useRef({ hasPremiumPlus, pathname });
  propRef.current = { hasPremiumPlus, pathname };

  function resolveVisibility() {
    if (window[OUTBRAIN_CONTAINER_KEY]) {
      if (propRef.current.hasPremiumPlus) {
        window[OUTBRAIN_CONTAINER_KEY].style.display = 'none';
      } else {
        window[OUTBRAIN_CONTAINER_KEY].style.display = EXCLUDED_PATHS.includes(propRef.current.pathname) ? 'none' : '';
      }
    }
  }

  React.useEffect(() => {
    if (!inIFrame() && loadScript && !script) {
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
  }, [loadScript]);

  React.useEffect(() => {
    resolveVisibility();
  }, [hasPremiumPlus, pathname]);
}
