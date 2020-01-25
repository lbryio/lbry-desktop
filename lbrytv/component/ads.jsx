// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';

const ADS_URL = '//assets.revcontent.com/master/delivery.js';

type Props = {
  location: { pathname: string },
};

function Ads(props: Props) {
  const {
    location: { pathname },
  } = props;

  useEffect(() => {
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
  }, []);

  return (
    <div className="ads-wrapper">
      <p>Ads</p>
      <p>
        <I18nMessage
          tokens={{
            sign_in_to_lbrytv: (
              <Button
                button="link"
                label={__('Sign in to lbry.tv')}
                navigate={`/$/${PAGES.AUTH}?redirect=${pathname}`}
              />
            ),
            download_the_app: <Button button="link" label={__('download the app')} href="https://lbry.com/get" />,
          }}
        >
          Hate these? %sign_in_to_lbrytv% or %download_the_app% for an ad free experience.
        </I18nMessage>
      </p>
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
