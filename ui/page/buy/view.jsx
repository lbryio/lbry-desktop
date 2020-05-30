// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import { countries as countryData } from 'country-data';
import { Form, FormField, Submit } from 'component/common/form';
import { SUPPORTED_MOONPAY_COUNTRIES } from 'constants/moonpay';
import { useHistory } from 'react-router';
import Button from 'component/button';
import Nag from 'component/common/nag';

const MOONPAY_KEY = process.env.MOONPAY_SECRET_KEY;
const COUNTRIES = Array.from(
  new Set(
    countryData.all
      .map(country => country.name)
      .sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }

        if (b.name > a.name) {
          return -1;
        }

        return 0;
      })
  )
);

type Props = {
  receiveAddress: ?string,
  gettingNewAddress: boolean,
  email: string,
  doGetNewAddress: () => void,
};

export default function BuyPage(props: Props) {
  const { receiveAddress, gettingNewAddress, doGetNewAddress, email } = props;
  const [url, setUrl] = React.useState();
  const [country, setCountry] = React.useState(SUPPORTED_MOONPAY_COUNTRIES[0]);
  const [validCountry, setValidCountry] = React.useState(false);
  const isValid = SUPPORTED_MOONPAY_COUNTRIES.includes(country);
  const { goBack } = useHistory();

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
      {validCountry ? (
        <Card
          title={__('Purchase LBC')}
          subtitle={__('You can purchase LBC now.')}
          actions={
            url ? (
              <iframe
                allow="accelerometer; autoplay; camera; gyroscope; payment"
                frameBorder="0"
                src={url}
                width="100%"
              >
                <p>{__('Your browser does not support iframes.')}</p>
              </iframe>
            ) : (
              <div className="main--empty">
                <Spinner delayed />
              </div>
            )
          }
        />
      ) : (
        <Card
          title={__('What Country Do You Live In?')}
          subtitle={__('Only people from certain countries are eligible to purchase LBC.')}
          nag={country && !isValid && <Nag relative type="helpful" message={"This country isn't supported yet."} />}
          actions={
            <div>
              <div className="section">
                <FormField
                  label={__('Country')}
                  type="select"
                  name="country-codes"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((country, index) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </FormField>
              </div>
              {country && (
                <div className="section">
                  {isValid ? (
                    <div className="section__actions">
                      <Button button="primary" label={__('Continue')} onClick={() => setValidCountry(true)} />
                    </div>
                  ) : (
                    <div>
                      <div className="section__actions">
                        <Button button="primary" label={__('Go Back')} onClick={() => goBack()} />
                        <Button button="link" label={__('Try Anyway')} onClick={() => setValidCountry(true)} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />
      )}
    </Page>
  );
}
