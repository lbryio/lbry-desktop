// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Page from 'component/page';
import { Lbryio } from 'lbryinc';
import { URL, WEBPACK_WEB_PORT, STRIPE_PUBLIC_KEY } from 'config';
import moment from 'moment';

const isDev = process.env.NODE_ENV !== 'production';

let stripeEnvironment = 'test';
// if the key contains pk_live it's a live key
// update the environment for the calls to the backend to indicate which environment to hit
if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
  stripeEnvironment = 'live';
}

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
  user: User,
};

type State = {
  error: boolean,
  loading: boolean,
  content: ?string,
  stripeConnectionUrl: string,
  // alreadyUpdated: boolean,
  accountConfirmed: boolean,
  accountPendingConfirmation: boolean,
  accountNotConfirmedButReceivedTips: boolean,
  unpaidBalance: number,
  pageTitle: string,
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
      accountTransactions: [],
      // alreadyUpdated: false,
    };
  }

  componentDidMount() {
    const { user } = this.props;

    // $FlowFixMe
    this.experimentalUiEnabled = user && user.experimental_ui;

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
          )
            .then((accountListResponse) => {

              that.setState({
                accountTransactions: accountListResponse,
              });

              console.log(accountListResponse);
            });
        }

        // if charges already enabled, no need to generate an account link
        if (accountStatusResponse.charges_enabled) {
          // account has already been confirmed

          that.setState({
            accountConfirmed: true,
          });
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
          getAndSetAccountLink();
        } else {
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
      accountTransactions,
    } = this.state;

    const { user } = this.props;

    if (user.fiat_enabled) {
      return (
        <Page backout={{ title: pageTitle, backLabel: __('Done') }} noFooter noSideNavigation>
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
                          <Button button="secondary" label={__('Connect your bank account')} icon={ICONS.FINANCE} />
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
                        {unpaidBalance > 0 ? (
                          <div>
                            <br />
                            <h3>
                              {__(
                                'Your pending account balance is $%balance% USD.',
                                { balance: unpaidBalance / 100 }
                              )}
                            </h3>
                          </div>
                        ) : (
                          <div>
                            <br />
                            <h3>{__('Your account balance is $0 USD. When you receive a tip you will see it here.')}</h3>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {accountNotConfirmedButReceivedTips && (
                  <div className="card__body-actions">
                    <div>
                      <div>
                        <h3>{__('Congratulations, you have already begun receiving tips on Odysee!')}</h3>
                        <div>
                          <br />
                          <h3>
                            {__(
                              'Your pending account balance is $%balance% USD.',
                              { balance: unpaidBalance / 100 }
                            )}
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
                            <Button button="secondary" label={__('Connect your bank account')} icon={ICONS.FINANCE} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
          />
          <br />


          {/* customer already has transactions */}
          {accountTransactions && accountTransactions.length > 0 && (

            <Card
              title={__('Tip History')}
              body={
                <>
                  <div className="table__wrapper">
                    <table className="table table--transactions">
                      <thead>
                      <tr>
                        <th className="date-header">{__('Date')}</th>
                        <th>{<>{__('Receiving Channel Name')}</>}</th>
                        <th>{__('Tip Location')}</th>
                        <th>{__('Amount (USD)')} </th>
                        <th>{__('Processing Fee')}</th>
                        <th>{__('Odysee Fee')}</th>
                        <th>{__('Received Amount')}</th>
                      </tr>
                      </thead>
                      <tbody>
                      {accountTransactions &&
                      accountTransactions.reverse().map((transaction) => (
                        <tr key={transaction.name + transaction.created_at}>
                          <td>{moment(transaction.created_at).format('LLL')}</td>
                          <td>
                            <Button
                              className="stripe__card-link-text"
                              navigate={'/' + transaction.channel_name + ':' + transaction.channel_claim_id}
                              label={transaction.channel_name}
                              button="link"
                            />
                          </td>
                          <td>
                            <Button
                              className="stripe__card-link-text"
                              navigate={'/' + transaction.channel_name + ':' + transaction.source_claim_id}
                              label={transaction.channel_claim_id === transaction.source_claim_id ? 'Channel Page' : 'File Page'}
                              button="link"

                            />
                          </td>
                          <td>${transaction.tipped_amount / 100}</td>
                          <td>${transaction.transaction_fee / 100}</td>
                          <td>${transaction.application_fee / 100}</td>
                          <td>${transaction.received_amount / 100}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </>
              }
            />
          )}
        </Page>
      );
    } else {
      return <></>; // probably null;
    }
  }
}

export default StripeAccountConnection;
