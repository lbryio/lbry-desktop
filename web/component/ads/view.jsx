// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import PremiumPlusTile from 'component/premiumPlusTile';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import { useIsMobile } from 'effects/use-screensize';

const DISABLE_VIDEO_AD = false;

// prettier-ignore
const AD_CONFIGS = Object.freeze({
  ADNIMATION: {
    url: 'https://tg1.aniview.com/api/adserver/spt?AV_TAGID=6252bb6f28951333ec10a7a6&AV_PUBLISHERID=601d9a7f2e688a79e17c1265',
    tag: 'AV6252bb6f28951333ec10a7a6',
  },
});

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
  shouldShowAds: boolean,
};

function Ads(props: Props) {
  const { type = 'video', tileLayout, small, shouldShowAds, className, noFallback } = props;
  const isMobile = useIsMobile();
  const adConfig = AD_CONFIGS.ADNIMATION;

  React.useEffect(() => {
    if (shouldShowAds && !DISABLE_VIDEO_AD) {
      let script;
      try {
        script = document.createElement('script');
        script.src = adConfig.url;
        // $FlowIgnore
        document.body.appendChild(script);

        return () => {
          // $FlowIgnore
          document.body.removeChild(script);
        };
      } catch (e) {}
    }
  }, [shouldShowAds, adConfig]);

  const adsSignInDriver = !isMobile ? (
    <I18nMessage
      tokens={{
        sign_up_for_premium: (
          <Button button="link" label={__('Get Odysee Premium+')} navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}`} />
        ),
      }}
    >
      %sign_up_for_premium% for an ad free experience.
    </I18nMessage>
  ) : (
    <Button button="link" label={__('Get Odysee Premium+')} navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}`} />
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
