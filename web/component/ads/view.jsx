// @flow
import { DOMAIN, SHOW_ADS } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import classnames from 'classnames';
// $FlowFixMe

const ADS_URL =
  'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Responsive_Floating_DFP_Rev70_1011.js';
const IS_MOBILE = typeof window.orientation !== 'undefined';

type Props = {
  location: { pathname: string },
  type: string,
  small: boolean,
  claim: Claim,
  isMature: boolean,
};

function Ads(props: Props) {
  const {
    location: { pathname },
    type = 'sidebar',
    small,
  } = props;

  useEffect(() => {
    if (SHOW_ADS && type === 'video') {
      let script;
      try {
        const d = document;
        const s = 'script';
        const n = 'vidcrunch';
        let fjs = d.getElementsByTagName(s)[0];
        script = d.createElement(s);
        script.className = n;
        script.src =
          'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Responsive_Floating_DFP_Rev70_1011.js';
        // $FlowFixMe
        fjs.parentNode.insertBefore(script, fjs);
      } catch (e) {}
    }
  }, [type]);

  useEffect(() => {
    if (SHOW_ADS && !IS_MOBILE && type === 'sidebar') {
      const script = document.createElement('script');
      script.src = ADS_URL;
      script.defer = true;
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

  const videoAd = (
    <div className="ads__claim-item">
      <div id="vidcrunchJS537102317" className="ads__injected-video" style={{display: 'none'}} />
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
      <div id="vidcrunchJS537102317" />
    </div>
  );

  if (!SHOW_ADS) {
    return false;
  }
  if (type === 'video') {
    return videoAd;
  }

  if (type === 'sidebar') {
    return sidebarAd;
  }
}

export default withRouter(Ads);
