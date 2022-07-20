// @flow
import React from 'react';
import { SHOW_ADS } from 'config';

const NO_COUNTRY_CHECK = true;
const GOOGLE_AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

let fetch_locked = false;

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
    if (isAdBlockerFound === undefined && !fetch_locked) {
      fetch_locked = true;

      fetch(GOOGLE_AD_URL)
        .then((response) => {
          const detected = response.redirected === true;
          doSetAdBlockerFound(detected);
        })
        .catch(() => {
          doSetAdBlockerFound(true);
        })
        .finally(() => {
          fetch_locked = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- On mount only
  }, []);

  React.useEffect(() => {
    setShouldShowAds(resolveAdVisibility());
  }, [hasPremiumPlus, isAdBlockerFound, userCountry]);

  return shouldShowAds;
}
