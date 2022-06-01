// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import useShouldShowAds from 'effects/use-should-show-ads';
import { platform } from 'util/platform';

// ****************************************************************************
// AdsSticky
// ****************************************************************************

const OUTBRAIN_CONTAINER_KEY = 'outbrainSizeDiv';
let gScript;

type Props = {
  isAdBlockerFound: ?boolean,
  userHasPremiumPlus: boolean,
  userCountry: string,
  homepageData: any,
  doSetAdBlockerFound: (boolean) => void,
};

export default function AdsSticky(props: Props) {
  const { isAdBlockerFound, userHasPremiumPlus, userCountry, homepageData, doSetAdBlockerFound } = props;
  const { location } = useHistory();
  const [refresh, setRefresh] = React.useState(0);

  const inAllowedPath = isPathAllowed(location.pathname);
  const shouldShowAds = useShouldShowAds(userHasPremiumPlus, userCountry, isAdBlockerFound, doSetAdBlockerFound);
  const shouldLoadSticky = inAllowedPath && !gScript && !inIFrame() && !platform.isMobile();

  function isPathAllowed(pathname) {
    const categoryValues = Object.values(homepageData);
    // $FlowIssue: mixed type
    const pathIsCategory = categoryValues.some((x) => pathname.startsWith(`/$/${x?.name}`));
    return pathIsCategory;
  }

  // -- Mount script; 1 per session.
  React.useEffect(() => {
    if (shouldShowAds && shouldLoadSticky) {
      gScript = document.createElement('script');
      gScript.src = 'https://adncdnend.azureedge.net/adtags/odysee.adn.js';
      gScript.async = true;
      gScript.addEventListener('load', () => setRefresh(Date.now()));
      // $FlowFixMe
      document.body.appendChild(gScript);
    }
  }, [shouldShowAds, shouldLoadSticky]);

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
