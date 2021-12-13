// @flow
import { DOMAIN, SHOW_ADS } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import classnames from 'classnames';

const ADS_URL =
  'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Responsive_Floating_DFP_Rev70_1011.js';
const ADS_TAG = 'vidcrunchJS537102317';
const IOS_ADS_URL =
  'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Mobile_Floating_DFP_Rev70_1611.js';
const IOS_ADS_TAG = 'vidcrunchJS199212779';
const HOMEPAGE_ADS_URL =
  'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Responsive_Floating_300x169_DFP_Rev70_1211.js';
const HOMEPAGE_ADS_TAG = 'vidcrunchJS330442776';

const IS_IOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    // for iOS 13+ , platform is MacIntel, so use this to test
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;

const IS_ANDROID = /Android/i.test(navigator.userAgent);

const IS_FIREFOX = /Firefox/i.test(navigator.userAgent);

const isFirefoxAndroid = IS_ANDROID && IS_FIREFOX;

type Props = {
  location: { pathname: string },
  type: string,
  small: boolean,
  claim: Claim,
  isMature: boolean,
  authenticated: boolean,
  triggerBlacklist: boolean
};

function removeIfExists(querySelector) {
  const element = document.querySelector(querySelector);
  if (element) element.remove();
}

function Ads(props: Props) {
  const {
    location: { pathname },
    type = 'video',
    small,
    authenticated,
    triggerBlacklist,
  } = props;

  // load ad and tags here
  let scriptUrlToUse;
  let tagNameToUse;
  if (type === 'video') {
    if (IS_IOS) {
      tagNameToUse = IOS_ADS_TAG;
      scriptUrlToUse = IOS_ADS_URL;
    } else {
      tagNameToUse = ADS_TAG;
      scriptUrlToUse = ADS_URL;
    }
  } else if (type === 'homepage') {
    tagNameToUse = HOMEPAGE_ADS_TAG;
    scriptUrlToUse = HOMEPAGE_ADS_URL;
  }

  // add script to DOM
  useEffect(() => {
    if (SHOW_ADS && !authenticated) {
      let script;
      try {
        script = document.createElement('script');
        script.src = scriptUrlToUse;
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

  // display to say "sign up to not see these"
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

  // ad shown in the related videos area
  const videoAd = (
    <div className="ads__claim-item">
      <div id={tagNameToUse} className="ads__injected-video" style={{ display: 'none' }} />
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

  // homepage ad in a card
  const homepageCardAd = (
    <div className="homepageAdContainer media__thumb" style={{ display: 'none' }}>
      <div id={tagNameToUse} className="homepageAdDiv media__thumb" style={{ display: 'none' }} />
    </div>
  );

  if (!SHOW_ADS || triggerBlacklist) {
    return false;
  }
  // sidebar ad
  if (type === 'video') {
    // don't run sidebar ad on Android Firefox because it errors out
    if (isFirefoxAndroid) {
      return false;
    }
    return videoAd;
  }
  if (type === 'homepage') {
    return homepageCardAd;
  }
}

export default withRouter(Ads);
