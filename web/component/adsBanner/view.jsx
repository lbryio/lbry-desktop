// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import * as PAGES from 'constants/pages';
import useShouldShowAds from 'effects/use-should-show-ads';
import { useIsMobile } from 'effects/use-screensize';

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

let gScript;

type Props = {
  isAdBlockerFound: ?boolean,
  userHasPremiumPlus: boolean,
  userCountry: string,
  currentTheme: string,
  doSetAdBlockerFound: (boolean) => void,
};

export default function AdsBanner(props: Props) {
  const { isAdBlockerFound, userHasPremiumPlus, userCountry, currentTheme, doSetAdBlockerFound } = props;
  const { location } = useHistory();

  const shouldShowAds = useShouldShowAds(userHasPremiumPlus, userCountry, isAdBlockerFound, doSetAdBlockerFound);
  const shouldLoadScript = shouldShowAds && !gScript;
  const isMobile = useIsMobile();

  React.useEffect(() => {
    // Must check `!gScript` again here since we have multiple instances of the
    // component. The first one will load the script.
    if (shouldLoadScript && !gScript) {
      try {
        gScript = document.createElement('script');
        gScript.src = AD_SCRIPT_URL;
        gScript.async = true;
        // $FlowFixMe
        document.body.appendChild(gScript);
      } catch (e) {}
    }
  }, [shouldLoadScript]);

  React.useEffect(() => {
    if (window?.OBR?.extern) {
      window.OBR.extern.reloadWidget();
      window.OBR.extern.refreshWidget();
    }
  }, [location.pathname]);

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
        data-widget-id={!isMobile ? AD_CONFIG.AR_60 : AD_CONFIG.AR_18}
        data-ob-installation-key="ADNIMKAJDGAG4GAO6AGG6H5KP"
        data-dark-mode={currentTheme === 'dark' ? 'true' : 'false'}
      />
    </div>
  );
}
