// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import classnames from 'classnames';

const ADS_URL = '//assets.revcontent.com/master/delivery.js';
const IS_MOBILE = typeof window.orientation !== 'undefined';

type Props = {
  location: { pathname: string },
  type: string,
  small: boolean,
};

function Ads(props: Props) {
  const {
    location: { pathname },
    type = 'sidebar',
    small,
  } = props;

  useEffect(() => {
    if (type === 'video') {
      try {
        const d = document;
        const s = 'script';
        const n = 'playbuzz-stream';

        let js;
        let fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s);
        js.className = n;
        js.src = 'https://stream.playbuzz.com/player/62d1eb10-e362-4873-99ed-c64a4052b43b';
        // $FlowFixMe
        fjs.parentNode.insertBefore(js, fjs);
      } catch (e) {}
    }
  }, [type]);

  useEffect(() => {
    if (!IS_MOBILE && type === 'sidebar') {
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

  const adsSignInDriver = (
    <I18nMessage
      tokens={{
        sign_in_to_lbrytv: (
          <Button button="link" label={__('Sign in to lbry.tv')} navigate={`/$/${PAGES.AUTH}?redirect=${pathname}`} />
        ),
        download_the_app: <Button button="link" label={__('download the app')} href="https://lbry.com/get" />,
      }}
    >
      Hate these? %sign_in_to_lbrytv% or %download_the_app% for an ad free experience.
    </I18nMessage>
  );

  return type === 'video' ? (
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
  ) : (
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
}

export default withRouter(Ads);
