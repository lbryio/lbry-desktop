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
  uri: ?string,
  // --- redux ---
  isContentClaim: boolean,
  isChannelClaim: boolean,
  authenticated: ?boolean,
  isAdBlockerFound: ?boolean,
  userHasPremiumPlus: boolean,
  userCountry: string,
  homepageData: any,
  doSetAdBlockerFound: (boolean) => void,
};

export default function AdsSticky(props: Props) {
  const {
    isContentClaim,
    isChannelClaim,
    authenticated,
    isAdBlockerFound,
    userHasPremiumPlus,
    userCountry,
    homepageData,
    doSetAdBlockerFound,
  } = props;

  const { location } = useHistory();
  const [refresh, setRefresh] = React.useState(0);

  // Global condition on whether ads should be activated:
  const shouldShowAds = useShouldShowAds(userHasPremiumPlus, userCountry, isAdBlockerFound, doSetAdBlockerFound);
  // Global conditions aside, should the Sticky be shown for this path:
  const inAllowedPath = shouldShowAdsForPath(location.pathname, isContentClaim, isChannelClaim, authenticated);
  // Final answer:
  const shouldLoadSticky = shouldShowAds && !gScript && !inIFrame() && !platform.isMobile();

  function shouldShowAdsForPath(pathname, isContentClaim, isChannelClaim, authenticated) {
    // $FlowIssue: mixed type
    const pathIsCategory = Object.values(homepageData).some((x) => pathname.startsWith(`/$/${x?.name}`));
    return pathIsCategory || isChannelClaim || (isContentClaim && !authenticated);
  }

  React.useEffect(() => {
    if (shouldLoadSticky) {
      gScript = document.createElement('script');
      gScript.src = 'https://adncdnend.azureedge.net/adtags/odysee.adn.js';
      gScript.async = true;
      gScript.addEventListener('load', () => setRefresh(Date.now()));
      // $FlowFixMe
      document.body.appendChild(gScript);
    }
  }, [shouldLoadSticky]);

  React.useEffect(() => {
    const container = window[OUTBRAIN_CONTAINER_KEY];
    if (container) {
      container.style.display = inAllowedPath ? '' : 'none';
    }
  }, [inAllowedPath, refresh]);

  return null; // Nothing for us to mount; the ad script will handle everything.
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
