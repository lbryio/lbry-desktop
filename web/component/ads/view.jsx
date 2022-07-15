// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import PremiumPlusTile from 'component/premiumPlusTile';
import classnames from 'classnames';
import useShouldShowAds from 'effects/use-should-show-ads';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

// prettier-ignore
const AD_CONFIGS = Object.freeze({
  ADNIMATION: {
    // url: 'https://tg1.aniview.com/api/adserver/spt?AV_TAGID=6252bb6f28951333ec10a7a6&AV_PUBLISHERID=601d9a7f2e688a79e17c1265',
    // tag: 'AV6252bb6f28951333ec10a7a6',
    url: 'https://tg1.aniview.com/api/adserver/spt?AV_TAGID=62558336037e0f3df07ff0a8&AV_PUBLISHERID=601d9a7f2e688a79e17c1265',
    tag: 'AV6252bb6f28951333ec10a7a6',
  },
  ADNIMATION_FILEPAGE: {
    url: 'https://tg1.aniview.com/api/adserver/spt?AV_TAGID=62558336037e0f3df07ff0a8&AV_PUBLISHERID=601d9a7f2e688a79e17c1265',
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

// ****************************************************************************
// Ads
// ****************************************************************************

type Props = {
  type: string,
  filePage?: boolean,
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
    filePage = false,
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
  const adConfig = filePage ? AD_CONFIGS.ADNIMATION_FILEPAGE : AD_CONFIGS.ADNIMATION;

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
  }, [shouldShowAds, adConfig]);

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
            {/* <div id={adConfig.tag} /> */}
            <div id="AV6252bb6f28951333ec10a7a6" />
            <div id="AV62558336037e0f3df07ff0a8" />
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
