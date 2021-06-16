// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
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
  accountConfirmed: boolean
};

class DocxViewer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      content: null,
      loading: true,
      accountConfirmed: false,
      accountPendingConfirmation: false,
    };
  }

  componentDidMount() {
    const { user } = this.props;

    this.experimentalUiEnabled = user && user.experimental_ui;

    var that = this;

    // call the account status endpoint
    Lbryio.call('account', 'status', {}, 'post').then(accountStatusResponse => {
      // if charges already enabled, no need to generate an account link
      if (accountStatusResponse.charges_enabled) {

        console.log(accountStatusResponse);

        // account has already been confirmed
        that.setState({
          accountConfirmed: true,
        });

        // update the frontend
        console.log(accountStatusResponse);
      } else {
        Lbryio.call('account', 'link', {
          return_url: STRIPE_ACCOUNT_CONNECTION_SUCCESS_URL,
          refresh_url: STRIPE_ACCOUNT_CONNECTION_FAILURE_URL,
        }, 'post').then(accountLinkResponse => {
          console.log(accountLinkResponse);

          that.setState({
            stripeConnectionUrl: accountLinkResponse.url,
            accountPendingConfirmation: true,
          });
        });
      }
    }).catch(function(error) {
      // errorString passed from the API (with a 403 error)
      const errorString = 'account not linked to user, please link first';

      // if it's beamer's error indicating the account is not linked yet
      if (error.message.indexOf(errorString) > -1) {
        // tell the frontend it's not confirmed, to show the proper markup

        Lbryio.call('account', 'link', {
          return_url: STRIPE_ACCOUNT_CONNECTION_SUCCESS_URL,
          refresh_url: STRIPE_ACCOUNT_CONNECTION_FAILURE_URL,
        }, 'post').then(accountLinkResponse => {
          console.log(accountLinkResponse);

          that.setState({
            stripeConnectionUrl: accountLinkResponse.url,
            accountPendingConfirmation: true,
          });
        });
      }
    });
  }

  render() {
    const { stripeConnectionUrl, accountConfirmed, accountPendingConfirmation } = this.state;

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

export default DocxViewer;
