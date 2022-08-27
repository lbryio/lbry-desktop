// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Page from 'component/page';
import BusyIndicator from 'component/common/busy-indicator';

type Props = {
  // -- redux --
  accountStatus: StripeAccountStatus,
  unpaidBalance: number,
  chargesEnabled: boolean,
  accountRequiresVerification: boolean,
  accountLinkResponse: StripeAccountLink,
  doTipAccountStatus: () => Promise<StripeAccountStatus>,
  doGetAndSetAccountLink: () => Promise<StripeAccountLink>,
};

const StripeAccountConnection = (props: Props) => {
  const {
    accountStatus,
    unpaidBalance,
    chargesEnabled,
    accountRequiresVerification,
    accountLinkResponse,
    doTipAccountStatus,
    doGetAndSetAccountLink,
  } = props;

  React.useEffect(() => {
    if (accountStatus === undefined) {
      doTipAccountStatus();
    }
  }, [accountStatus, doTipAccountStatus]);

  React.useEffect(() => {
    if (accountRequiresVerification || accountStatus === undefined) {
      doGetAndSetAccountLink();
    }
  }, [accountStatus, accountRequiresVerification, doGetAndSetAccountLink]);

  const accountNotConfirmedButReceivedTips = !chargesEnabled && unpaidBalance > 0;
  const stripeConnectionUrl = accountLinkResponse?.url;
  const accountPendingConfirmation = Boolean(doGetAndSetAccountLink);

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      className="card-stack"
      backout={{
        title: !accountStatus ? __('Add Payout Method') : __('Your Payout Method'),
        backLabel: __('Back'),
      }}
    >
      <Card
        title={<div className="table__header-text">{__('Connect a bank account')}</div>}
        isBodyList
        body={
          <>
            {/* show while waiting for account status */}
            {!chargesEnabled && !accountPendingConfirmation && !accountNotConfirmedButReceivedTips && (
              <div className="card__body-actions">
                <h3>
                  <BusyIndicator message={__('Getting your bank account connection status...')} />
                </h3>
              </div>
            )}

            {/* user has yet to complete their integration */}
            {!chargesEnabled && accountPendingConfirmation && (
              <div className="card__body-actions">
                <h3>{__('Connect your bank account to Odysee to receive donations directly from users')}</h3>

                <div className="section__actions">
                  <a href={stripeConnectionUrl}>
                    <Button button="primary" label={__('Connect your bank account')} icon={ICONS.FINANCE} />
                  </a>
                </div>
              </div>
            )}

            {/* user has completed their integration */}
            {chargesEnabled && (
              <div className="card__body-actions">
                <h3>{__('Congratulations! Your account has been connected with Odysee.')}</h3>
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
            )}

            {/* TODO: hopefully we won't be using this anymore and can remove it */}
            {accountNotConfirmedButReceivedTips && (
              <div className="card__body-actions">
                <h3>{__('Congratulations, you have already begun receiving tips on Odysee!')}</h3>
                <div>
                  <br />
                  <h3>{__('Your pending account balance is $%balance% USD.', { balance: unpaidBalance / 100 })}</h3>
                </div>
                <br />
                <div>
                  <h3>
                    {__('Connect your bank account to be able to cash your pending balance out to your account.')}
                  </h3>
                </div>
                <div className="section__actions">
                  <a href={stripeConnectionUrl}>
                    <Button button="primary" label={__('Connect your bank account')} icon={ICONS.FINANCE} />
                  </a>
                </div>
              </div>
            )}
          </>
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
            <Button
              button="secondary"
              label={__('View Transactions')}
              icon={ICONS.SETTINGS}
              navigate={`/$/${PAGES.WALLET}?fiatType=incoming&tab=fiat-payment-history&currency=fiat`}
            />
          ) : undefined
        }
      />
    </Page>
  );
};

export default StripeAccountConnection;
