// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

type Props = {
  receiveAddress: ?string,
  gettingNewAddress: boolean,
  email: string,
  doGetNewAddress: () => void,
};

const MOONPAY_KEY = process.env.MOONPAY_SECRET_KEY;

export default function BuyPage(props: Props) {
  const { receiveAddress, gettingNewAddress, doGetNewAddress, email } = props;
  const [url, setUrl] = React.useState();

  React.useEffect(() => {
    if (!receiveAddress && !gettingNewAddress) {
      doGetNewAddress();
    }
  }, [receiveAddress, gettingNewAddress]);

  React.useEffect(() => {
    if (MOONPAY_KEY && !url && receiveAddress) {
      let url = `https://buy.moonpay.io?apiKey=pk_live_xNFffrN5NWKy6fu0ggbV8VQIwRieRzy&colorCode=%23257761&currencyCode=lbc&showWalletAddressForm=true&walletAddress=${receiveAddress}`;
      if (email) {
        url += `&email=${encodeURIComponent(email)}`;
      }

      const query = new URL(url).search;
      const signature = Base64.stringify(hmacSHA256(query, MOONPAY_KEY));

      setUrl(`${url}&signature=${encodeURIComponent(signature)}`);
    }
  }, [url, setUrl, receiveAddress, email]);

  return (
    <Page noSideNavigation className="main--buy">
      <Card
        title={__('Purchase LBC')}
        subtitle={__('You can purchase LBC now.')}
        actions={
          url ? (
            <iframe allow="accelerometer; autoplay; camera; gyroscope; payment" frameBorder="0" src={url} width="100%">
              <p>{__('Your browser does not support iframes.')}</p>
            </iframe>
          ) : (
            <div className="main--empty">
              <Spinner delayed />
            </div>
          )
        }
      />
    </Page>
  );
}
