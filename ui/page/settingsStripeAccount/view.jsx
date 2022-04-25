// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Page from 'component/page';

import { Lbryio } from 'lbryinc';
import { URL, WEBPACK_WEB_PORT } from 'config';
import { getStripeEnvironment } from 'util/stripe';

const isDev = process.env.NODE_ENV !== 'production';

let stripeEnvironment = getStripeEnvironment();
let successStripeRedirectUrl, failureStripeRedirectUrl;
let successEndpoint = '/$/settings/tip_account';
let failureEndpoint = '/$/settings/tip_account';
if (isDev) {
  successStripeRedirectUrl = 'http://localhost:' + WEBPACK_WEB_PORT + successEndpoint;
  failureStripeRedirectUrl = 'http://localhost:' + WEBPACK_WEB_PORT + failureEndpoint;
} else {
  successStripeRedirectUrl = URL + successEndpoint;
  failureStripeRedirectUrl = URL + failureEndpoint;
}

type Props = {
  source: string,
  doOpenModal: (string, {}) => void,
  doToast: ({ message: string }) => void,
};

type State = {
  error: boolean,
  loading: boolean,
  content: ?string,
  stripeConnectionUrl: string,
  accountConfirmed: boolean,
  accountPendingConfirmation: boolean,
  accountNotConfirmedButReceivedTips: boolean,
  unpaidBalance: number,
  pageTitle: string,
  stillRequiringVerification: boolean,
  accountTransactions: any,
};

class StripeAccountConnection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      content: null,
      loading: true,
      accountConfirmed: false,
      accountPendingConfirmation: false,
      accountNotConfirmedButReceivedTips: false,
      unpaidBalance: 0,
      stripeConnectionUrl: '',
      pageTitle: 'Add Payout Method',
      stillRequiringVerification: false,
      accountTransactions: [],
    };
  }

  componentDidMount() {
    let doToast = this.props.doToast;

    var that = this;

    function getAndSetAccountLink(stillNeedToConfirmAccount) {
      Lbryio.call(
        'account',
        'link',
        {
          return_url: successStripeRedirectUrl,
          refresh_url: failureStripeRedirectUrl,
          environment: stripeEnvironment,
        },
        'post'
      ).then((accountLinkResponse) => {
        // stripe link for user to navigate to and confirm account
        const stripeConnectionUrl = accountLinkResponse.url;

        // set connection url on frontend
        that.setState({
          stripeConnectionUrl,
        });

        // show the account confirmation link if not created already
        if (stillNeedToConfirmAccount) {
          that.setState({
            accountPendingConfirmation: true,
          });
        }
      });
    }

    // call the account status endpoint
    Lbryio.call(
      'account',
      'status',
      {
        environment: stripeEnvironment,
      },
      'post'
    )
      .then((accountStatusResponse) => {
        const yetToBeCashedOutBalance = accountStatusResponse.total_received_unpaid;
        if (yetToBeCashedOutBalance) {
          that.setState({
            unpaidBalance: yetToBeCashedOutBalance,
          });

          Lbryio.call(
            'account',
            'list',
            {
              environment: stripeEnvironment,
            },
            'post'
          ).then((accountListResponse: any) => {
            // TODO type this
            that.setState({
              accountTransactions: accountListResponse.reverse(),
            });
          });
        }

        // if charges already enabled, no need to generate an account link
        if (accountStatusResponse.charges_enabled) {
          // account has already been confirmed

          const eventuallyDueInformation = accountStatusResponse.account_info.requirements.eventually_due;

          const currentlyDueInformation = accountStatusResponse.account_info.requirements.currently_due;

          let objectToUpdateState = {
            accountConfirmed: true,
            stillRequiringVerification: false,
          };

          if (
            (eventuallyDueInformation && eventuallyDueInformation.length) ||
            (currentlyDueInformation && currentlyDueInformation.length)
          ) {
            objectToUpdateState.stillRequiringVerification = true;
            getAndSetAccountLink(false);
          }

          that.setState(objectToUpdateState);

          // user has not confirmed an account but have received payments
        } else if (accountStatusResponse.total_received_unpaid > 0) {
          that.setState({
            accountNotConfirmedButReceivedTips: true,
          });

          getAndSetAccountLink();

          // user has not received any amount or confirmed an account
        } else {
          // get stripe link and set it on the frontend
          // pass true so it updates the frontend
          getAndSetAccountLink(true);
        }
      })
      .catch(function (error) {
        // errorString passed from the API (with a 403 error)
        const errorString = 'account not linked to user, please link first';

        // if it's beamer's error indicating the account is not linked yet
        if (error.message.indexOf(errorString) > -1) {
          // get stripe link and set it on the frontend
          getAndSetAccountLink(true);
        } else {
          // probably an error from stripe
          const displayString = __('There was an error getting your account setup, please try again later');
          doToast({ message: displayString, isError: true });
          // not an error from Beamer, throw it
          throw new Error(error);
        }
      });
  }

  render() {
    const {
      stripeConnectionUrl,
      accountConfirmed,
      accountPendingConfirmation,
      unpaidBalance,
      accountNotConfirmedButReceivedTips,
      pageTitle,
      stillRequiringVerification,
    } = this.state;

    return (
      <Page
        noFooter
        noSideNavigation
        settingsPage
        className="card-stack"
        backout={{ title: pageTitle, backLabel: __('Back') }}
      >
        <Card
          title={<div className="table__header-text">{__('Connect a bank account')}</div>}
          isBodyList
          body={
            <div>
              {/* show while waiting for account status */}
              {!accountConfirmed && !accountPendingConfirmation && !accountNotConfirmedButReceivedTips && (
                <div className="card__body-actions">
                  <div>
                    <div>
                      <h3>{__('Getting your bank account connection status...')}</h3>
                    </div>
                  </div>
                </div>
              )}
              {/* user has yet to complete their integration */}
              {!accountConfirmed && accountPendingConfirmation && (
                <div className="card__body-actions">
                  <div>
                    <div>
                      <h3>{__('Connect your bank account to Odysee to receive donations directly from users')}</h3>
                    </div>
                    <div className="section__actions">
                      <a href={stripeConnectionUrl}>
                        <Button button="primary" label={__('Connect your bank account')} icon={ICONS.FINANCE} />
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {/* user has completed their integration */}
              {accountConfirmed && (
                <div className="card__body-actions">
                  <div>
                    <div>
                      <h3>{__('Congratulations! Your account has been connected with Odysee.')}</h3>
                      {stillRequiringVerification && (
                        <>
                          <h3 style={{ marginTop: '10px' }}>
                            Although your account is connected it still requires verification to begin receiving tips.
                          </h3>
                          <h3 style={{ marginTop: '10px' }}>
                            Please use the button below to complete your verification process and enable tipping for
                            your account.
                          </h3>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* TODO: hopefully we won't be using this anymore and can remove it */}
              {accountNotConfirmedButReceivedTips && (
                <div className="card__body-actions">
                  <div>
                    <div>
                      <h3>{__('Congratulations, you have already begun receiving tips on Odysee!')}</h3>
                      <div>
                        <br />
                        <h3>
                          {__('Your pending account balance is $%balance% USD.', { balance: unpaidBalance / 100 })}
                        </h3>
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
                  </div>
                </div>
              )}
            </div>
          }
          // only show additional buttons if its for additional verification or to show transaction page
          actions={
            (stillRequiringVerification || accountConfirmed) && (
              <>
                {stillRequiringVerification && (
                  <Button
                    button="primary"
                    label={__('Complete Verification')}
                    icon={ICONS.SETTINGS}
                    navigate={stripeConnectionUrl}
                    className="stripe__complete-verification-button"
                  />
                )}
                {accountConfirmed && (
                  <Button
                    button="secondary"
                    label={__('View Transactions')}
                    icon={ICONS.SETTINGS}
                    navigate={`/$/${PAGES.WALLET}?fiatType=incoming&tab=fiat-payment-history&currency=fiat`}
                  />
                )}
              </>
            )
          }
        />
        <br />
      </Page>
    );
  }
}

export default StripeAccountConnection;
