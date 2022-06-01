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
  const inAllowedPath = isPathAllowed(pathname);
  const [refresh, setRefresh] = React.useState(0);

  function isPathAllowed(pathname) {
    for (const x of PATH_BLACKLIST) {
      if ((x.exact && pathname === x.path) || (!x.exact && pathname.startsWith(x.path))) {
        return false;
      }
    }
    return true;
  }

  // -- Mount script; 1 per session.
  React.useEffect(() => {
    // NOTE: there is a bug where AdsSticky cannot be loaded on a page where
    // AdsBanner exists. As long as AdsSticky is loaded in a page without
    // AdsBanner, they both can still be visible together later, says from
    // navigating around.
    //
    // Adding inAllowedPath to the logic is a band-aid that relies on AdsBanner
    // only being used in Homepage for now, which we currently happen to not
    // place AdsSticky.

    if (shouldShowAds && inAllowedPath && !gScript && !inIFrame()) {
      gScript = document.createElement('script');
      gScript.src = 'https://adncdnend.azureedge.net/adtags/odysee.adn.js';
      gScript.async = true;
      gScript.addEventListener('load', () => setRefresh(Date.now()));
      // $FlowFixMe
      document.body.appendChild(gScript);
    }
  }, [shouldShowAds, inAllowedPath]);

  // -- Update visibility per pathname
  React.useEffect(() => {
    const container = window[OUTBRAIN_CONTAINER_KEY];
    if (container) {
      container.style.display = inAllowedPath ? '' : 'none';
    }
  }, [inAllowedPath, refresh]);

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
