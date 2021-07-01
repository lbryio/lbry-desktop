// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import { Lbryio } from 'lbryinc';
import { URL, WEBPACK_WEB_PORT } from 'config';

const isDev = process.env.NODE_ENV !== 'production';

let successStripeRedirectUrl, failureStripeRedirectUrl;
let successEndpoint = '/$/wallet';
let failureEndpoint = '/$/wallet';
if (isDev) {
  successStripeRedirectUrl = 'localhost:' + WEBPACK_WEB_PORT + successEndpoint;
  failureStripeRedirectUrl = 'localhost:' + WEBPACK_WEB_PORT + failureEndpoint;
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
        return_url: successStripeRedirectUrl,
        refresh_url: failureStripeRedirectUrl,
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
          title={<div className="table__header-text">{__(`Connect A Bank Account`)}</div>}
          isBodyList
          body={
            <div>
              {/* show while waiting for account status */}
              {!accountConfirmed && !accountPendingConfirmation &&
              <div className="card__body-actions">
                <div>
                  <div>
                    <h3>Getting your Bank Account Connection status...</h3>
                  </div>
                </div>
              </div>
              }
              {/* user has yet to complete their integration */}
              {!accountConfirmed && accountPendingConfirmation &&
              <div className="card__body-actions">
                <div>
                  <div>
                    <h3>Connect your Bank Account to Odysee to receive donations directly from users</h3>
                  </div>
                  <div className="section__actions">
                    <a href={stripeConnectionUrl}>
                      <Button
                        button="secondary"
                        label={__('Connect Your Bank Account')}
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
                    <h3>Congratulations! Your account has been connected with Odysee.</h3>
                    {unpaidBalance > 0 ? <div><br></br>
                      <h3>Your account balance is ${unpaidBalance/100} USD. When the functionality exists you will be able to withdraw your balance.</h3>
                    </div> : <div><br></br>
                      <h3>Your account balance is $0 USD. When you receive a tip you will see it here.</h3>
                    </div>}
                  </div>
                  <div className="section__actions">
                    <a href="/$/wallet">
                      <Button
                        button="secondary"
                        label={__('View Your Transaction History')}
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
