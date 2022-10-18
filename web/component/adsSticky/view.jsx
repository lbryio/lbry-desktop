// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import analytics from 'analytics';

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
  shouldShowAds: boolean,
  homepageData: any,
  locale: ?LocaleInfo,
  nagsShown: boolean,
};

export default function AdsSticky(props: Props) {
  const {
    isContentClaim,
    isChannelClaim,
    authenticated,
    shouldShowAds, // Global condition on whether ads should be activated
    homepageData,
    locale,
    nagsShown,
  } = props;

  const { location } = useHistory();
  const [refresh, setRefresh] = React.useState(0);

  // Global conditions aside, should the Sticky be shown for this path:
  const inAllowedPath = shouldShowAdsForPath(location.pathname, isContentClaim, isChannelClaim, authenticated);
  // Final answer:
  const shouldLoadSticky = shouldShowAds && !gScript && inAllowedPath && !inIFrame();

  function shouldShowAdsForPath(pathname, isContentClaim, isChannelClaim, authenticated) {
    // $FlowIssue: mixed type
    const pathIsCategory = Object.values(homepageData).some((x) => pathname.startsWith(`/$/${x?.name}`));
    return pathIsCategory || isChannelClaim || isContentClaim || pathname === '/';
  }

  React.useEffect(() => {
    if (shouldLoadSticky) {
      window.googletag = window.googletag || { cmd: [] };

      gScript = document.createElement('script');
      gScript.src = 'https://adncdnend.azureedge.net/adtags/odyseeKp.js';
      gScript.async = true;
      gScript.addEventListener('load', () => setRefresh(Date.now()));

      try {
        const head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(gScript); // Vendor's desired location, although I don't think location matters.
      } catch (e) {
        analytics.log(e, { fingerprint: ['adsSticky::scriptAppendFailed'] }, 'adsSticky::scriptAppendFailed');
      }
    }
  }, [shouldLoadSticky]);

  React.useEffect(() => {
    const container = window[OUTBRAIN_CONTAINER_KEY];
    if (container) {
      container.style.display = inAllowedPath ? '' : 'none';
    }
    const ad = document.getElementsByClassName('OUTBRAIN')[0];
    if (ad && locale && !locale.gdpr_required && !nagsShown) ad.classList.add('VISIBLE');
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
