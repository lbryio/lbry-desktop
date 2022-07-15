// @flow
import React from 'react';
import { SHOW_ADS } from 'config';

const NO_COUNTRY_CHECK = true;
const GOOGLE_AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

export default function useShouldShowAds(
  hasPremiumPlus: boolean,
  userCountry: string,
  isAdBlockerFound: ?boolean,
  doSetAdBlockerFound: (boolean) => void
) {
  const [shouldShowAds, setShouldShowAds] = React.useState(resolveAdVisibility());

  function resolveAdVisibility() {
    // 'ad_blocker_detected' and 'hasPremiumPlus' will be undefined until
    // fetched. Only show when it is exactly 'false'.
    return (
      SHOW_ADS && (NO_COUNTRY_CHECK || userCountry === 'US') && isAdBlockerFound === false && hasPremiumPlus === false
    );
  }

  React.useEffect(() => {
    if (isAdBlockerFound === undefined) {
      fetch(GOOGLE_AD_URL)
        .then((response) => {
          const detected = response.redirected === true;
          doSetAdBlockerFound(detected);
        })
        .catch(() => {
          doSetAdBlockerFound(true);
        });
    }
  }, []);

  React.useEffect(() => {
    setShouldShowAds(resolveAdVisibility());
  }, [hasPremiumPlus, isAdBlockerFound]);

  return shouldShowAds;
}
