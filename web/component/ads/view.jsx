// @flow
import { DOMAIN, SHOW_ADS } from 'config';
import { LIGHT_THEME } from 'constants/themes';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import classnames from 'classnames';
// $FlowFixMe
import { NO_ADS_CHANNEL_IDS } from 'homepages';

const ADS_URL = '//assets.revcontent.com/master/delivery.js';
const IS_MOBILE = typeof window.orientation !== 'undefined';
const G_AD_ID = 'ca-pub-7102138296475003';
// const G_AD_ONE_LAYOUT = '-gv+p-3a-8r+sd';
// const G_AD_ONE_SLOT = '6052061397';

// const G_AD_LIGHT_LAYOUT = '-h9-o+3s-6c+33'; // old layout
const G_AD_LIGHT_LAYOUT = '-gr-p+3s-5w+2d'; // light mode, related
const G_AD_LIGHT_SLOT = '1498002046';
const G_AD_DARK_LAYOUT = '-gr-p+3s-5w+2d'; // dark mode, related
const G_AD_DARK_SLOT = '7266878639';

type Props = {
  location: { pathname: string },
  type: string,
  small: boolean,
  theme: string,
  claim: GenericClaim,
  isMature: boolean,
};

function Ads(props: Props) {
  const {
    location: { pathname },
    type = 'sidebar',
    small,
    theme,
    claim,
    isMature,
  } = props;
  let googleInit;

  const channelId = claim && claim.signing_channel && claim.signing_channel.claim_id;

  const isBlocked = isMature || (NO_ADS_CHANNEL_IDS && NO_ADS_CHANNEL_IDS.includes(channelId));
  useEffect(() => {
    if (SHOW_ADS && type === 'video') {
      let script;
      try {
        const d = document;
        const s = 'script';
        const n = 'playbuzz-stream';
        let fjs = d.getElementsByTagName(s)[0];
        script = d.createElement(s);
        script.className = n;
        script.src = 'https://stream.playbuzz.com/player/62d1eb10-e362-4873-99ed-c64a4052b43b';
        // $FlowFixMe
        fjs.parentNode.insertBefore(script, fjs);
      } catch (e) {}
    }
  }, [type]);

  useEffect(() => {
    if (SHOW_ADS && !IS_MOBILE && type === 'sidebar') {
      const script = document.createElement('script');
      script.src = ADS_URL;
      script.async = true;
      // $FlowFixMe
      document.body.appendChild(script);
      return () => {
        // $FlowFixMe
        document.body.removeChild(script);
        // if user navigates too rapidly, <style> tags can build up
        // $FlowFixMe
        if (document.body.getElementsByTagName('style').length) {
          // $FlowFixMe
          document.body.getElementsByTagName('style')[0].remove();
        }
      };
    }
  }, [type]);

  useEffect(() => {
    let script;

    if (SHOW_ADS && type === 'google' && !isBlocked) {
      const d = document;
      if (!d.getElementById('googleadscriptid')) {
        try {
          const s = 'script';
          let fjs = d.getElementsByTagName(s)[0];
          script = d.createElement(s);
          script.id = 'googleadscriptid';
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          script.setAttribute('async', 'async');
          script.setAttribute('data-ad-client', 'ca-pub-7102138296475003');
          // $FlowFixMe
          fjs.parentNode.insertBefore(script, fjs);
        } catch (e) {}
      }
      googleInit = setTimeout(() => {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }, 1000);
    }
    return () => {
      if (googleInit) {
        clearTimeout(googleInit);
      }
    };
  }, [type, isBlocked]);

  const googleAd = (
    <div className="ads__related--google">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key={theme === LIGHT_THEME ? G_AD_LIGHT_LAYOUT : G_AD_DARK_LAYOUT}
        data-ad-client={G_AD_ID}
        data-ad-slot={theme === LIGHT_THEME ? G_AD_LIGHT_SLOT : G_AD_DARK_SLOT}
      />
    </div>
  );

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
        download_the_app: <Button button="link" label={__('download the app')} href="https://lbry.com/get" />,
      }}
    >
      Hate these? %log_in_to_domain% or %download_the_app% for an ad free experience.
    </I18nMessage>
  );

  const videoAd = (
    <div className="ads__claim-item">
      <div id="62d1eb10-e362-4873-99ed-c64a4052b43b" />
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

  const sidebarAd = (
    <div className="ads-wrapper">
      <p>Ads</p>
      <p>{adsSignInDriver}</p>
      <div
        id="rc-widget-0a74cf"
        data-rc-widget
        data-widget-host="habitat"
        data-endpoint="//trends.revcontent.com"
        data-widget-id="117427"
      />
    </div>
  );

  if (!SHOW_ADS || (type === 'google' && isBlocked)) {
    return false;
  }
  if (type === 'video') {
    return videoAd;
  }

  if (type === 'google') {
    return googleAd;
  }

  if (type === 'sidebar') {
    return sidebarAd;
  }
}

export default withRouter(Ads);
