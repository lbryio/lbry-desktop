// @flow
import React from 'react';
import { SHOW_ADS } from 'config';

const NO_COUNTRY_CHECK = true;

export default function useShouldShowAds(hasPremiumPlus: boolean, userCountry: string, isAdBlockerFound: ?boolean) {
  const [shouldShowAds, setShouldShowAds] = React.useState(resolveAdVisibility());

  function resolveAdVisibility() {
    // 'isAdBlockerFound' and 'hasPremiumPlus' will be undefined until
    // fetched. Only show when it is exactly 'false'.
    return (
      SHOW_ADS && (NO_COUNTRY_CHECK || userCountry === 'US') && isAdBlockerFound === false && hasPremiumPlus === false
    );
  }

  React.useEffect(() => {
    setShouldShowAds(resolveAdVisibility());
  }, [hasPremiumPlus, isAdBlockerFound, userCountry]);

  return shouldShowAds;
}
