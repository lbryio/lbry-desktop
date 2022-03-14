// @flow
import { SHOW_ADS } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import classnames from 'classnames';

// prettier-ignore
const AD_CONFIGS = Object.freeze({
  DEFAULT: {
    url: 'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Responsive_Floating_DFP_Rev70_1011.js',
    tag: 'vidcrunchJS537102317',
  },
  MOBILE: {
    url: 'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Mobile_Floating_DFP_Rev70_1611.js',
    tag: 'vidcrunchJS199212779',
  },
  EU: {
    url: 'https://tg1.vidcrunch.com/api/adserver/spt?AV_TAGID=61dff05c599f1e20b01085d4&AV_PUBLISHERID=6182c8993c8ae776bd5635e9',
    tag: 'AV61dff05c599f1e20b01085d4',
  },
});

const IS_IOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    // for iOS 13+ , platform is MacIntel, so use this to test
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;
const IS_ANDROID = /Android/i.test(navigator.userAgent);
// const IS_FIREFOX = /Firefox/i.test(navigator.userAgent);

// const isFirefoxAndroid = IS_ANDROID && IS_FIREFOX;

// Internal use only. One-time update flag.
let ad_blocker_detected;

type Props = {
  type: string,
  tileLayout?: boolean,
  small: boolean,
  claim: Claim,
  isMature: boolean,
  userHasPremiumPlus: boolean,
  className?: string,
  doSetAdBlockerFound: (boolean) => void,
};

function removeIfExists(querySelector) {
  const element = document.querySelector(querySelector);
  if (element) element.remove();
}

function Ads(props: Props) {
  const { type = 'video', tileLayout, small, userHasPremiumPlus, className, doSetAdBlockerFound } = props;

  const [shouldShowAds, setShouldShowAds] = React.useState(resolveAdVisibility());
  const mobileAds = IS_ANDROID || IS_IOS;

  // this is populated from app based on location
  const isInEu = localStorage.getItem('gdprRequired') === 'true';
  const adConfig = isInEu ? AD_CONFIGS.EU : mobileAds ? AD_CONFIGS.MOBILE : AD_CONFIGS.DEFAULT;

  function resolveAdVisibility() {
    // 'ad_blocker_detected' will be undefined at startup. Wait until we are
    // sure it is not blocked (i.e. === false) before showing the component.
    return ad_blocker_detected === false && SHOW_ADS && !userHasPremiumPlus;
  }

  useEffect(() => {
    if (ad_blocker_detected === undefined) {
      let mounted = true;
      const GOOGLE_AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

      fetch(GOOGLE_AD_URL)
        .then((response) => {
          const detected = response.redirected === true;
          window.odysee_ad_blocker_detected = detected;
          ad_blocker_detected = detected;
          doSetAdBlockerFound(detected);
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

  // add script to DOM
  useEffect(() => {
    if (shouldShowAds) {
      let script;
      try {
        script = document.createElement('script');
        script.src = adConfig.url;
        // $FlowFixMe
        document.head.appendChild(script);

        return () => {
          // $FlowFixMe
          document.head.removeChild(script);

          // clear aniview state to allow ad reload
          delete window.aniplayerPos;
          delete window.storageAni;
          delete window.__VIDCRUNCH_CONFIG_618bb4d28aac298191eec411__;
          delete window.__player_618bb4d28aac298191eec411__;

          // clean DOM elements from ad related elements
          removeIfExists('[src^="https://cdn.vidcrunch.com/618bb4d28aac298191eec411.js"]');
          removeIfExists('[src^="https://player.aniview.com/script/6.1/aniview.js"]');
          removeIfExists('[id^="AVLoaderaniplayer_vidcrunch"]');
          removeIfExists('#av_css_id');
        };
      } catch (e) {}
    }
  }, [shouldShowAds]);

  const adsSignInDriver = (
    <I18nMessage
      tokens={{
        sign_up_for_premium: (
          <Button button="link" label={__('Get Odysee Premium+')} navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}`} />
        ),
      }}
    >
      Hate these? %sign_up_for_premium% for an ad free experience.
    </I18nMessage>
  );

  if (shouldShowAds && type === 'video') {
    return (
      <div
        className={classnames('ads ads__claim-item', className, {
          'ads__claim-item--tile': tileLayout,
        })}
      >
        <div className="ad__container">
          <div id={adConfig.tag} />
        </div>
        <div
          className={classnames('ads__claim-text', {
            'ads__claim-text--small': small,
          })}
        >
          <div>Ad</div>
          <p>{adsSignInDriver}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default Ads;
