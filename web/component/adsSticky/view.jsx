// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as PAGES from 'constants/pages';
import useShouldShowAds from 'effects/use-should-show-ads';

// ****************************************************************************
// AdsSticky
// ****************************************************************************

const PATH_BLACKLIST = [
  // Don't show sticky in these paths:
  { path: `/`, exact: true },
  { path: `/$/${PAGES.AUTH}`, exact: false },
  { path: `/$/${PAGES.AUTH_SIGNIN}`, exact: false },
  { path: `/$/${PAGES.AUTH_VERIFY}`, exact: false },
  { path: `/$/${PAGES.SETTINGS}`, exact: false },
];

const OUTBRAIN_CONTAINER_KEY = 'outbrainSizeDiv';
let gScript;

type Props = {
  isAdBlockerFound: ?boolean,
  userHasPremiumPlus: boolean,
  userCountry: string,
  currentTheme: string,
  doSetAdBlockerFound: (boolean) => void,
};

export default function AdsSticky(props: Props) {
  const { isAdBlockerFound, userHasPremiumPlus, userCountry, doSetAdBlockerFound } = props;
  const shouldShowAds = useShouldShowAds(userHasPremiumPlus, userCountry, isAdBlockerFound, doSetAdBlockerFound);
  const {
    location: { pathname },
  } = useHistory();

  // -- Mount script; 1 per session.
  React.useEffect(() => {
    if (shouldShowAds && !gScript && !inIFrame()) {
      gScript = document.createElement('script');
      gScript.src = 'https://adncdnend.azureedge.net/adtags/odysee.adn.js';
      gScript.async = true;

      // $FlowFixMe
      document.body.appendChild(gScript);
    }
  }, [shouldShowAds]);

  // -- Update visibility per pathname
  React.useEffect(() => {
    const container = window[OUTBRAIN_CONTAINER_KEY];
    if (container) {
      for (const x of PATH_BLACKLIST) {
        const found = (x.exact && pathname === x.path) || (!x.exact && pathname.startsWith(x.path));
        if (found) {
          container.style.display = 'none';
          return;
        }
      }

      container.style.display = '';
    }
  }, [pathname]);

  // Nothing for us to mount; the ad script will handle everything.
  return null;
}

// ****************************************************************************
// Helpers
// ****************************************************************************

function inIFrame() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
