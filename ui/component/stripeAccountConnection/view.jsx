// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import { Lbryio } from 'lbryinc';
import { STRIPE_ACCOUNT_CONNECTION_SUCCESS_URL, STRIPE_ACCOUNT_CONNECTION_FAILURE_URL } from 'config';

type Props = {
  source: string,
  user: User,
};

type State = {
  error: boolean,
  loading: boolean,
  content: ?string,
  stripeConnectionUrl: string,
  alreadyUpdated: boolean,
  accountConfirmed: boolean,
  unpaidBalance: string
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
      unpaidBalance: 0,
    };
  }

  componentDidMount() {
    const { user } = this.props;

    this.experimentalUiEnabled = user && user.experimental_ui;

    var that = this;

    function getAndSetAccountLink(){
      Lbryio.call('account', 'link', {
        return_url: STRIPE_ACCOUNT_CONNECTION_SUCCESS_URL,
        refresh_url: STRIPE_ACCOUNT_CONNECTION_FAILURE_URL,
      }, 'post').then(accountLinkResponse => {

        // stripe link for user to navigate to and confirm account
        const stripeConnectionUrl = accountLinkResponse.url;

        that.setState({
          stripeConnectionUrl,
          accountPendingConfirmation: true,
        });
      });
    }

    // call the account status endpoint
    Lbryio.call('account', 'status', {}, 'post').then(accountStatusResponse => {
      // if charges already enabled, no need to generate an account link
      if (accountStatusResponse.charges_enabled) {
        // account has already been confirmed

        const yetToBeCashedOutBalance = accountStatusResponse.total_received_unpaid;
        if (yetToBeCashedOutBalance) {
          that.setState({
            unpaidBalance: yetToBeCashedOutBalance,
          });
        }

        console.log(accountStatusResponse.total_received_unpaid);

        that.setState({
          accountConfirmed: true,
        });
      } else {
        // get stripe link and set it on the frontend
        getAndSetAccountLink();
      }
    }).catch(function(error) {
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
    const { stripeConnectionUrl, accountConfirmed, accountPendingConfirmation, unpaidBalance } = this.state;

    if (this.experimentalUiEnabled) {
      return (
        <Card
          title={<div className="table__header-text">{__(`Connect to Stripe`)}</div>}
          isBodyList
          body={
            <div>
              {/* show while waiting for account status */}
              {!accountConfirmed && !accountPendingConfirmation &&
              <div className="card__body-actions">
                <div>
                  <div>
                    <h3>Getting your Stripe account connection status...</h3>
                  </div>
                </div>
              </div>
              }
              {/* user has yet to complete their integration */}
              {!accountConfirmed && accountPendingConfirmation &&
              <div className="card__body-actions">
                <div>
                  <div>
                    <h3>Connect your account to Stripe to receive tips from viewers directly to your bank account</h3>
                  </div>
                  <div className="section__actions">
                    <a href={stripeConnectionUrl}>
                      <Button
                        button="secondary"
                        label={__('Connect To Stripe')}
                        icon={ICONS.FINANCE}
                      />
                    </a>
                  </div>
                </div>
              </div>
              }
              {/* user has completed their integration */}
              {accountConfirmed &&
              <div className="card__body-actions">
                <div>
                  <div>
                    <h3>Congratulations! Your account has been connected with Stripe.</h3>
                    {unpaidBalance && <div><br></br>
                      <h3>Your account balance is ${unpaidBalance/100} USD. When the functionality exists you will be able to withdraw your balance.</h3>
                    </div>}
                  </div>
                  <div className="section__actions">
                    <a href="/$/wallet">
                      <Button
                        button="secondary"
                        label={__('View Your Stripe Setup')}
                        icon={ICONS.SETTINGS}
                      />
                    </a>
                  </div>
                </div>
              </div>
              }
            </div>
          }
        />
      );
    } else {
      return (<></>);
    }
  }
}

export default StripeAccountConnection;
