// @flow
import React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import * as PAGES from 'constants/pages';
import useShouldShowAds from 'effects/use-should-show-ads';

const AD_SCRIPT_URL = 'https://widgets.outbrain.com/outbrain.js';

const AD_CONFIG = {
  AR_18: 'AR_18', // 5 tiles.
  AR_60: 'AR_60', // 6 tiles. Doesn't work well on mobile (6 tiles compresses to 1, text only).
  AR_3: 'AR_3', // 4 tiles on desktop, dynamic count on mobile.
};

// ****************************************************************************
// ****************************************************************************

const adsSignInDriver = (
  <I18nMessage
    tokens={{
      sign_up_for_premium: (
        <Button button="link" label={__('Get Odysee Premium+')} navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}`} />
      ),
    }}
  >
    %sign_up_for_premium% for an ad free experience.
  </I18nMessage>
);

// ****************************************************************************
// AdsBanner
// ****************************************************************************

let gReferenceCounter = 0;

type Props = {
  userHasPremiumPlus: boolean,
  userCountry: string,
  currentTheme: string,
  doSetAdBlockerFound: (boolean) => void,
};

export default function AdsBanner(props: Props) {
  const { userHasPremiumPlus, userCountry, currentTheme, doSetAdBlockerFound } = props;
  const shouldShowAds = useShouldShowAds(userHasPremiumPlus, userCountry, doSetAdBlockerFound);

  React.useEffect(() => {
    if (shouldShowAds) {
      try {
        const script = document.createElement('script');
        script.src = AD_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
          ++gReferenceCounter;
        };

        // $FlowFixMe
        document.body.appendChild(script);
        return () => {
          // $FlowFixMe
          document.body.removeChild(script);

          if (--gReferenceCounter <= 0) {
            // Note: This method has the bad requirement of the parent having to
            // mount and dismount all banners in the same cycle.
            delete window.OBR;
            // TODO: clear styles after the team adds an ID or class for us to query.
          }
        };
      } catch (e) {}
    }
  }, [shouldShowAds]);

  if (!shouldShowAds) {
    return null;
  }

  return (
    <div className="banner-ad">
      <div className="banner-ad__driver">
        <div className="banner-ad__driver-label">Ad</div>
        <div className="banner-ad__driver-value">{adsSignInDriver}</div>
      </div>
      <div
        className="banner-ad__container OUTBRAIN"
        data-ob-contenturl="DROP_PERMALINK_HERE"
        data-widget-id={AD_CONFIG.AR_18}
        data-ob-installation-key="ADNIMKAJDGAG4GAO6AGG6H5KP"
        data-dark-mode={currentTheme === 'dark' ? 'true' : 'false'}
      />
    </div>
  );
}
