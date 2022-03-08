// @flow
import { DOMAIN, SHOW_ADS } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
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

type Props = {
  location: { pathname: string },
  type: string,
  tileLayout?: boolean,
  small: boolean,
  claim: Claim,
  isMature: boolean,
  authenticated: boolean,
  className?: string,
};

function removeIfExists(querySelector) {
  const element = document.querySelector(querySelector);
  if (element) element.remove();
}

function Ads(props: Props) {
  const {
    location: { pathname },
    type = 'video',
    tileLayout,
    small,
    authenticated,
    className,
  } = props;

  const shouldShowAds = SHOW_ADS && !authenticated;
  const mobileAds = IS_ANDROID || IS_IOS;

  // this is populated from app based on location
  const isInEu = localStorage.getItem('gdprRequired') === 'true';

  // const adConfig = isInEu ? AD_CONFIGS.EU : mobileAds ? AD_CONFIGS.MOBILE : AD_CONFIGS.DEFAULT;
  // -- The logic above is what we are asked to do, but the EU script breaks our
  // -- app's CSS when ran on mobile.
  const adConfig = mobileAds ? AD_CONFIGS.MOBILE : isInEu ? AD_CONFIGS.EU : AD_CONFIGS.DEFAULT;

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
          removeIfExists('#customAniviewStyling');
        };
      } catch (e) {}
    }
  }, []);

  const adsSignInDriver = (
    <I18nMessage
      tokens={{
        log_in_to_domain: (
          <Button
            button="link"
            label={__('Log in to %domain%', { domain: DOMAIN })}
            navigate={`/$/${PAGES.AUTH}?redirect=${pathname}`}
          />
        ),
      }}
    >
      Hate these? %log_in_to_domain% for an ad free experience.
    </I18nMessage>
  );

  if (shouldShowAds && type === 'video') {
    return (
      <div
        className={classnames('ads ads__claim-item', className, {
          'ads__claim-item--tile': tileLayout, // with no tileLayout it indicates sidebar ad
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

export default withRouter(Ads);
