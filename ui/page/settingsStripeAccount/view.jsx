// @flow
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Page from 'component/page';
import I18nMessage from 'component/i18nMessage';
import BusyIndicator from 'component/common/busy-indicator';

import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as STRIPE from 'constants/stripe';

import './style.scss';

type Props = {
  // -- redux --
  accountInfo: ?StripeAccountInfo,
  accountLinkResponse: StripeAccountLink,
  accountRequiresVerification: ?boolean,
  chargesEnabled: ?boolean,
  doGetAndSetAccountLink: () => Promise<StripeAccountLink>,
  doTipAccountStatus: () => Promise<StripeAccountStatus>,
  unpaidBalance: number,
};

const StripeAccountConnection = (props: Props) => {
  const {
    accountInfo,
    accountLinkResponse,
    accountRequiresVerification,
    chargesEnabled,
    doGetAndSetAccountLink,
    doTipAccountStatus,
    unpaidBalance,
  } = props;

  const { email, id: accountId } = accountInfo || {};
  const bankAccountNotFetched = chargesEnabled === undefined;
  const noBankAccount = !chargesEnabled && !bankAccountNotFetched;
  const stripeConnectionUrl = accountLinkResponse?.url;
  const shouldFetchLink = noBankAccount || accountRequiresVerification;
  const linkNotFetched = shouldFetchLink && accountLinkResponse === undefined;

  React.useEffect(() => {
    if (bankAccountNotFetched) {
      doTipAccountStatus();
    }
  }, [bankAccountNotFetched, doTipAccountStatus]);

  React.useEffect(() => {
    if (linkNotFetched) {
      doGetAndSetAccountLink();
    }
  }, [doGetAndSetAccountLink, linkNotFetched]);

  if (bankAccountNotFetched || linkNotFetched) {
    return (
      <Page
        noFooter
        noSideNavigation
        settingsPage
        className="card-stack"
        backout={{ title: __('Your Payout Method'), backLabel: __('Back') }}
      >
        <BusyIndicator message={__('Getting your bank account connection status...')} />
      </Page>
    );
  }

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      className="card-stack"
      backout={{
        title: !chargesEnabled ? __('Add Payout Method') : __('Your Payout Method'),
        backLabel: __('Back'),
      }}
    >
      <Card
        title={
          <div className="table__header-text">
            {chargesEnabled ? __('Bank account connected') : __('Connect a bank account')}
          </div>
        }
        isBodyList
        body={
          chargesEnabled ? (
            <div className="card__body-actions connected-account-information">
              <h3>{__('Congratulations! Your account has been connected with Odysee.')}</h3>
              <h3>
                <I18nMessage tokens={{ email: <span className="bolded-email">{email}</span> }}>
                  The email you registered with Stripe is %email%
                </I18nMessage>
              </h3>

              {accountRequiresVerification && (
                <>
                  <h3 style={{ marginTop: '10px' }}>
                    {__('Although your account is connected it still requires verification to begin receiving tips.')}
                  </h3>
                  <h3 style={{ marginTop: '10px' }}>
                    {__(
                      'Please use the button below to complete your verification process and enable tipping for ' +
                        'your account.'
                    )}
                  </h3>
                </>
              )}
            </div>
          ) : unpaidBalance > 0 ? (
            // TODO: hopefully we won't be using this anymore and can remove it
            <div className="card__body-actions">
              <h3>{__('Congratulations, you have already begun receiving tips on Odysee!')}</h3>
              <div>
                <br />
                <h3>{__('Your pending account balance is $%balance% USD.', { balance: unpaidBalance / 100 })}</h3>
              </div>
              <br />
              <div>
                <h3>{__('Connect your bank account to be able to cash your pending balance out to your account.')}</h3>
              </div>
            </div>
          ) : (
            <div className="card__body-actions">
              <h3>{__('Connect your bank account to Odysee to receive donations directly from users')}</h3>
            </div>
          )
        }
        actions={
          accountRequiresVerification ? (
            <Button
              button="primary"
              label={__('Complete Verification')}
              icon={ICONS.SETTINGS}
              navigate={stripeConnectionUrl}
              className="stripe__complete-verification-button"
            />
          ) : chargesEnabled ? (
            <>
              <Button
                button="secondary"
                label={__('View Transactions')}
                icon={ICONS.SETTINGS}
                navigate={`/$/${PAGES.WALLET}?fiatType=incoming&tab=fiat-payment-history&currency=fiat`}
              />
              {accountId && (
                <Button
                  button="secondary"
                  icon={ICONS.SETTINGS}
                  label={__('View Account On Stripe')}
                  navigate={`${STRIPE.STRIPE_ACCOUNT_DASHBOARD_URL}/${accountId}`}
                  className="stripe__view-account-button"
                />
              )}
            </>
          ) : (
            <Button
              button="primary"
              label={__('Connect your bank account')}
              icon={ICONS.FINANCE}
              navigate={stripeConnectionUrl}
            />
          )
        }
      />
    </Page>
  );
};

export default StripeAccountConnection;
