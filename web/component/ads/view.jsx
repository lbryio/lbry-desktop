// @flow
import { DOMAIN, SHOW_ADS } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import classnames from 'classnames';
// $FlowFixMe

const IS_MOBILE = typeof window.orientation !== 'undefined';

const ADS_URL = 'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Responsive_Floating_DFP_Rev70_1011.js';
const ADS_TAG = 'vidcrunchJS537102317';

const IOS_ADS_URL = 'https://cdn.vidcrunch.com/integrations/618bb4d28aac298191eec411/Lbry_Odysee.com_Mobile_Floating_DFP_Rev70_1611.js';
const IOS_ADS_TAG = 'vidcrunchJS199212779';

const IS_IOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    // for iOS 13+ , platform is MacIntel, so use this to test
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;

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

  let scriptUrlToUse;
  let tagNameToUse;
  if (IS_IOS) {
    tagNameToUse = IOS_ADS_TAG;
    scriptUrlToUse = IOS_ADS_URL;
  } else {
    tagNameToUse = ADS_TAG;
    scriptUrlToUse = ADS_URL;
  }

  useEffect(() => {
    if (SHOW_ADS && type === 'video') {
      let script;
      try {
        let fjs = document.getElementsByTagName('script')[0];
        script = document.createElement('script');
        script.src = scriptUrlToUse;
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
      <div id={tagNameToUse} className="ads__injected-video" style={{display: 'none'}} />
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

  if (!SHOW_ADS) {
    return false;
  }
  if (type === 'video') {
    return videoAd;
  }
}

export default withRouter(Ads);
