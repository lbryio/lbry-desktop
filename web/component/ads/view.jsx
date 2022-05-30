// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import PremiumPlusTile from 'component/premiumPlusTile';
import classnames from 'classnames';
import useShouldShowAds from 'effects/use-should-show-ads';
import { platform } from 'util/platform';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import { LocalStorage, LS } from 'util/storage';

const USE_ADNIMATION = true;

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
  ADNIMATION: {
    url: 'https://tg1.aniview.com/api/adserver/spt?AV_TAGID=6252bb6f28951333ec10a7a6&AV_PUBLISHERID=601d9a7f2e688a79e17c1265',
    tag: 'AV6252bb6f28951333ec10a7a6',
  },
});

// ****************************************************************************
// Helpers
// ****************************************************************************

function removeIfExists(querySelector) {
  const element = document.querySelector(querySelector);
  if (element) element.remove();
}

function resolveVidcrunchConfig() {
  const mobileAds = platform.isAndroid() || platform.isIOS();
  const isInEu = LocalStorage.getItem(LS.GDPR_REQUIRED) === 'true';
  return isInEu ? AD_CONFIGS.EU : mobileAds ? AD_CONFIGS.MOBILE : AD_CONFIGS.DEFAULT;
}

// ****************************************************************************
// Ads
// ****************************************************************************

type Props = {
  type: string,
  tileLayout?: boolean,
  small?: boolean,
  className?: string,
  noFallback?: boolean,
  // --- redux ---
  isAdBlockerFound: ?boolean,
  userHasPremiumPlus: boolean,
  userCountry: string,
  doSetAdBlockerFound: (boolean) => void,
};

function Ads(props: Props) {
  const {
    type = 'video',
    tileLayout,
    small,
    isAdBlockerFound,
    userHasPremiumPlus,
    userCountry,
    className,
    noFallback,
    doSetAdBlockerFound,
  } = props;

  const shouldShowAds = useShouldShowAds(userHasPremiumPlus, userCountry, isAdBlockerFound, doSetAdBlockerFound);
  const adConfig = USE_ADNIMATION ? AD_CONFIGS.ADNIMATION : resolveVidcrunchConfig();

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

          const styles = document.querySelectorAll('body > style');
          styles.forEach((s) => {
            // We are asking Adnimation to supply us with a specific ID or
            // pattern so that our query wouldn't break when they change their
            // script. For now, this is the "best effort".
            if (s.innerText && s.innerText.startsWith('#outbrain')) {
              s.remove();
            }
          });

          // clean DOM elements from ad related elements
          removeIfExists('[src^="https://player.avplayer.com"]');
          removeIfExists('[src^="https://gum.criteo.com"]');
          removeIfExists('[id^="AVLoaderaniview_slot"]');
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
      %sign_up_for_premium% for an ad free experience.
    </I18nMessage>
  );

  if (type === 'video') {
    if (shouldShowAds) {
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
            <div className="ads__title">
              {__('Ad')}
              <br />
              {__('Hate these?')}
              {/* __('No ads, a custom badge and access to exclusive features, try Odysee Premium!') */}
            </div>
            <div className="ads__subtitle">
              <Icon icon={ICONS.UPGRADE} />
              {adsSignInDriver}
            </div>
          </div>
        </div>
      );
    } else if (!noFallback) {
      return <PremiumPlusTile tileLayout={tileLayout} />;
    }
  }

  return null;
}

export default Ads;
