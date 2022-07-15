// @flow
// import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import { countries as countryData } from 'country-data';
import { FormField } from 'component/common/form';
import { SUPPORTED_MOONPAY_COUNTRIES } from 'constants/moonpay';
import { useHistory } from 'react-router';
import Button from 'component/button';
import Nag from 'component/common/nag';
import LbcSymbol from 'component/common/lbc-symbol';
import { SIMPLE_SITE } from 'config';
// import classnames from 'classnames';
// import WalletSwap from 'component/walletSwap';

const MOONPAY_DOWN = true;

const MOONPAY_KEY = process.env.MOONPAY_SECRET_KEY;
const COUNTRIES = Array.from(
  new Set(
    countryData.all
      .filter((country) => country.status !== 'deleted')
      .map((country) => country.name)
      .sort((a, b) => {
        if (a > b) {
          return 1;
        }

        if (b > a) {
          return -1;
        }

        return 0;
      })
  )
);

/* const TAB = {
  BUY: 'BUY',
  SWAP: 'SWAP',
}; */

type Props = {
  receiveAddress: ?string,
  gettingNewAddress: boolean,
  email: string,
  user: ?User,
  doGetNewAddress: () => void,
  doUserSetCountry: (string) => void,
};

export default function BuyPage(props: Props) {
  const { receiveAddress, gettingNewAddress, doGetNewAddress, email, user, doUserSetCountry } = props;
  const initialCountry = (user && user.country) || '';
  // const [tab, setTab] = React.useState(TAB.BUY);
  const [url, setUrl] = React.useState();
  const [country, setCountry] = React.useState(initialCountry);
  const [showPurchaseScreen, setShowPurchaseScreen] = React.useState(false);
  const isValid = SUPPORTED_MOONPAY_COUNTRIES.includes(country);
  const { goBack } = useHistory();

  React.useEffect(() => {
    if (country) {
      doUserSetCountry(country);
    }
  }, [country, doUserSetCountry, isValid, setShowPurchaseScreen]);

  React.useEffect(() => {
    if (!receiveAddress && !gettingNewAddress) {
      doGetNewAddress();
    }
  }, [doGetNewAddress, receiveAddress, gettingNewAddress]);

  React.useEffect(() => {
    if (MOONPAY_KEY && !url && receiveAddress) {
      let url = SIMPLE_SITE
        ? `https://buy.moonpay.io?apiKey=pk_live_xNFffrN5NWKy6fu0ggbV8VQIwRieRzy&colorCode=%23fa6165&currencyCode=lbc&showWalletAddressForm=true&walletAddress=${receiveAddress}`
        : `https://buy.moonpay.io?apiKey=pk_live_xNFffrN5NWKy6fu0ggbV8VQIwRieRzy&colorCode=%23257761&currencyCode=lbc&showWalletAddressForm=true&walletAddress=${receiveAddress}`;

      if (email) {
        url += `&email=${encodeURIComponent(email)}`;
      }

      url += `&enabledPaymentMethods=${encodeURIComponent('credit_debit_card,sepa_bank_transfer,gbp_bank_transfer')}`;

      const query = new URL(url).search;
      const signature = Base64.stringify(hmacSHA256(query, MOONPAY_KEY));

      setUrl(`${url}&signature=${encodeURIComponent(signature)}`);
    }
  }, [url, setUrl, receiveAddress, email]);

  const title = __('Buy Credits');
  const subtitle = (
    <Button button="link" label={__('Learn more')} href="https://odysee.com/@OdyseeHelp:b/BuyingSellingLBRYCredits:b" />
  );

  if (MOONPAY_DOWN) {
    return (
      <Page
        noSideNavigation
        className="main--swap"
        backout={{ backoutLabel: __('Done'), title: <LbcSymbol prefix={__('Buy')} size={28} /> }}
      >
        <Card
          title={title}
          subtitle={subtitle}
          nag={<Nag relative type="helpful" message={__('Sorry, the service is currently unavailable.')} />}
        />
      </Page>
    );
  }

  return (
    <Page
      noSideNavigation
      className="main--swap"
      backout={{
        backoutLabel: __('Done'),
        title: <LbcSymbol prefix={__('Buy') /* or Swap') */} size={28} />,
      }}
    >
      {/* <div className="section">
        <Button
          key="tip"
          icon={ICONS.BUY}
          label={__('Buy')}
          button="alt"
          onClick={() => setTab(TAB.BUY)}
          className={classnames('button-toggle', { 'button-toggle--active': tab === TAB.BUY })}
        />
        <Button
          key="boost"
          icon={ICONS.COIN_SWAP}
          label={__('Swap')}
          button="alt"
          onClick={() => setTab(TAB.SWAP)}
          className={classnames('button-toggle', { 'button-toggle--active': tab === TAB.SWAP })}
        />
      </div> */}
      <div className="section">
        {/* tab === TAB.SWAP && <WalletSwap /> */}
        {
          /* tab === TAB.BUY && */ <>
            {!user && (
              <div className="main--empty">
                <Spinner delayed />
              </div>
            )}

            {user && (
              <>
                {showPurchaseScreen ? (
                  <Card
                    title={title}
                    subtitle={subtitle}
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
                    title={title}
                    subtitle={subtitle}
                    nag={
                      country &&
                      !isValid && <Nag relative type="helpful" message={"This country isn't supported yet."} />
                    }
                    actions={
                      <div>
                        <div className="section">
                          <FormField
                            label={__('Country')}
                            type="select"
                            name="country-codes"
                            helper={__(
                              'Only some countries are eligible at this time. We are working to make this available to everyone.'
                            )}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            <option value="" disabled defaultValue>
                              {__('Select your country')}
                            </option>
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
                                <Button
                                  button="primary"
                                  label={__('Continue')}
                                  onClick={() => setShowPurchaseScreen(true)}
                                />
                              </div>
                            ) : (
                              <div className="section__actions">
                                <Button button="alt" label={__('Go Back')} onClick={() => goBack()} />
                                <Button
                                  button="link"
                                  label={__('Try Anyway')}
                                  onClick={() => setShowPurchaseScreen(true)}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    }
                  />
                )}
              </>
            )}
          </>
        }
      </div>
    </Page>
  );
}
