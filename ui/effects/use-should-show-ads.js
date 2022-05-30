// @flow
import React from 'react';
import { SHOW_ADS } from 'config';

const NO_COUNTRY_CHECK = true;

const GOOGLE_AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
let ad_blocker_detected;

export default function useShouldShowAds(
  hasPremiumPlus: boolean,
  userCountry: string,
  doSetAdBlockerFound: (boolean) => void
) {
  const [shouldShowAds, setShouldShowAds] = React.useState(resolveAdVisibility());

  function resolveAdVisibility() {
    // 'ad_blocker_detected' and 'hasPremiumPlus' will be undefined until
    // fetched. Only show when it is exactly 'false'.
    return (
      SHOW_ADS &&
      (NO_COUNTRY_CHECK || userCountry === 'US') &&
      ad_blocker_detected === false &&
      hasPremiumPlus === false
    );
  }

  // -- Check for ad-blockers
  React.useEffect(() => {
    if (ad_blocker_detected === undefined) {
      let mounted = true;

      fetch(GOOGLE_AD_URL)
        .then((response) => {
          const detected = response.redirected === true;
          ad_blocker_detected = detected;
          doSetAdBlockerFound(detected); // Also stash in redux for components to listen to.
        })
        .catch(() => {
          ad_blocker_detected = true;
          doSetAdBlockerFound(true);
        })
        .finally(() => {
          if (mounted) {
            setShouldShowAds(resolveAdVisibility());
          }
        });

      return () => {
        mounted = false;
      };
    }
  }, []);

  // --- Check for Premium+
  React.useEffect(() => {
    setShouldShowAds(resolveAdVisibility());
  }, [hasPremiumPlus]);

  return shouldShowAds;
}
