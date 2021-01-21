// @flow
import { SHOW_ADS } from 'config';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';

type Props = {
  type: string,
  timeout: number,
};

function Ads(props: Props) {
  let googleInit;

  useEffect(() => {
    if (SHOW_ADS && type === 'google') {
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
  }, [type]);

  const googleAd = (
    <div className="ads__claim-item">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-e5+6n-34-bt+x0"
        data-ad-client={googleAdId}
        data-ad-slot="6052061397"
      />
    </div>
  );

  if (!SHOW_ADS) {
    return false;
  }

  return googleAd;
}

export default withRouter(Ads);
