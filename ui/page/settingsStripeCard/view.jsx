// @flow
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import Card from 'component/common/card';
import { SETTINGS } from 'lbry-redux';
import { Lbryio } from 'lbryinc';
import { STRIPE_PUBLIC_KEY } from 'config';
import classnames from 'classnames';
import TxoListItem from 'component/transactionListTableItem';


let scriptLoading = false;
let scriptLoaded = false;
let scriptDidError = false;


let stripeEnvironment = 'test';
// if the key contains pk_live it's a live key
// update the environment for the calls to the backend to indicate which environment to hit
if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
  stripeEnvironment = 'live';
}

type Props = {
  disabled: boolean,
  label: ?string,
  email: ?string,
}

class CardVerify extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      scriptFailedToLoad: false,
      currentFlowStage: 'loading', // loading, confirmingCard, cardConfirmed
      customerTransactions: [],
      pageTitle: 'Add Card',
      userCardDetails: {},
    };
  }

  componentDidMount() {
    var that = this;

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;

    // $FlowFixMe
    document.body.appendChild(script);

    // public key of the stripe account
    var publicKey = STRIPE_PUBLIC_KEY;

    // client secret of the SetupIntent (don't share with anyone but customer)
    var clientSecret = '';

    // setting a timeout to let the client secret populate
    // TODO: fix this, should be a cleaner way
    setTimeout(function() {

      // check if customer has card setup already
      Lbryio.call('customer', 'status', {
        environment: stripeEnvironment,
      }, 'post').then(customerStatusResponse => {

        // user has a card saved if their defaultPaymentMethod has an id
        const defaultPaymentMethod = customerStatusResponse.Customer.invoice_settings.default_payment_method;
        var userHasAlreadySetupPayment = Boolean(defaultPaymentMethod && defaultPaymentMethod.id);

        // show different frontend if user already has card
        if (userHasAlreadySetupPayment) {

          var card = customerStatusResponse.PaymentMethods[0].card;
          
          var cardDetails = {
            brand: card.brand,
            expiryYear: card.exp_year,
            expiryMonth: card.exp_month,
            lastFour: card.last4
          };

          that.setState({
            currentFlowStage: 'cardConfirmed',
            pageTitle: 'Tip History',
            userCardDetails: cardDetails,
          });

          // get customer transactions
          Lbryio.call('customer', 'list', {
            environment: stripeEnvironment,
          }, 'post').then(customerTransactionsResponse => {
            that.setState({
              customerTransactions: customerTransactionsResponse,
            })

            console.log(customerTransactionsResponse);
          });

          // otherwise, prompt them to save a card
        } else {
          that.setState({
            currentFlowStage: 'confirmingCard',
          });

          // get a payment method secret for frontend
          Lbryio.call('customer', 'setup', {
            environment: stripeEnvironment,
          }, 'post').then(customerSetupResponse => {
            console.log(customerSetupResponse);

            clientSecret = customerSetupResponse.client_secret;

            // instantiate stripe elements
            setupStripe();
          });
        }
        // if the status call fails, either an actual error or need to run setup first
      }).catch(function(error) {
        console.log(error);

        // errorString passed from the API (with a 403 error)
        const errorString = 'user as customer is not setup yet';

        // if it's beamer's error indicating the account is not linked yet
        if (error.message.indexOf(errorString) > -1) {
          // send them to save a card
          that.setState({
            currentFlowStage: 'confirmingCard',
          });

          // get a payment method secret for frontend
          Lbryio.call('customer', 'setup', {
            environment: stripeEnvironment,
          }, 'post').then(customerSetupResponse => {
            console.log(customerSetupResponse);

            clientSecret = customerSetupResponse.client_secret;

            // instantiate stripe elements
            setupStripe();
          });
        } else {
          console.log('Unseen before error');
        }
      });
    }, 250);

    function setupStripe() {
      // TODO: have to fix this, using so that the script is available
      setTimeout(function() {
        var stripeElements = function(publicKey, setupIntent) {
          var stripe = Stripe(publicKey);
          var elements = stripe.elements();

          // Element styles
          var style = {
            base: {
              fontSize: '16px',
              color: '#32325d',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: 'rgba(0,0,0,0.4)',
              },
            },
          };

          var card = elements.create('card', { style: style });

          card.mount('#card-element');

          // Element focus ring
          card.on('focus', function() {
            var el = document.getElementById('card-element');
            el.classList.add('focused');
          });

          card.on('blur', function() {
            var el = document.getElementById('card-element');
            el.classList.remove('focused');
          });

          card.on('ready', function() {
            card.focus();
          });

          var email = that.props.email;

          function submitForm(event) {
            event.preventDefault();

            // if client secret wasn't loaded properly
            if (!clientSecret) {
              var displayErrorText = 'There was an error in generating your payment method. Please contact a developer';
              var displayError = document.getElementById('card-errors');
              displayError.textContent = displayErrorText;

              return;
            }

            changeLoadingState(true);

            stripe.confirmCardSetup(clientSecret, {
              payment_method: {
                card: card,
                billing_details: { email: email },
              },
            }).then(function(result) {
              if (result.error) {
                console.log(result);

                changeLoadingState(false);
                var displayError = document.getElementById('card-errors');
                displayError.textContent = result.error.message;
              } else {
                // The PaymentMethod was successfully set up
                // hide and show the proper divs
                orderComplete(stripe, clientSecret);
              }
            });
          }

          // Handle payment submission when user clicks the pay button.
          var button = document.getElementById('submit');
          button.addEventListener('click', function(event) {
            submitForm(event);
          });

          // currently doesn't work because the iframe javascript context is different
          // would be nice though if it's even technically possible
          // window.addEventListener('keyup', function(event) {
          //   if (event.keyCode === 13) {
          //     submitForm(event);
          //   }
          // }, false);
        };

        // TODO: possible bug here where clientSecret isn't done
        stripeElements(publicKey, clientSecret);

        // Show a spinner on payment submission
        var changeLoadingState = function(isLoading) {
          if (isLoading) {
            document.querySelector('button').disabled = true;
            document.querySelector('#spinner').classList.remove('hidden');
            document.querySelector('#button-text').classList.add('hidden');
          } else {
            document.querySelector('button').disabled = false;
            document.querySelector('#spinner').classList.add('hidden');
            document.querySelector('#button-text').classList.remove('hidden');
          }
        };

        // shows a success / error message when the payment is complete
        var orderComplete = function(stripe, clientSecret) {
          stripe.retrieveSetupIntent(clientSecret).then(function(result) {
            that.setState({
              currentFlowStage: 'cardConfirmed',
            });

            console.log(result);

            changeLoadingState(false);
          });
        };
      }, 0);
    }
  }

  componentDidUpdate() {
    if (!scriptLoading) {
      this.updateStripeHandler();
    }
  }

  componentWillUnmount() {
    if (this.loadPromise) {
      this.loadPromise.reject();
    }
    if (CardVerify.stripeHandler && this.state.open) {
      CardVerify.stripeHandler.close();
    }
  }

  onScriptLoaded = () => {
    // if (!CardVerify.stripeHandler) {
    //   CardVerify.stripeHandler = StripeCheckout.configure({
    //     key: 'pk_test_NoL1JWL7i1ipfhVId5KfDZgo',
    //   });
    //
    //   if (this.hasPendingClick) {
    //     this.showStripeDialog();
    //   }
    // }
  };

  onScriptError = (...args) => {
    this.setState({ scriptFailedToLoad: true });
  };

  onClosed = () => {
    this.setState({ open: false });
  };

  updateStripeHandler() {
    // if (!CardVerify.stripeHandler) {
    //   CardVerify.stripeHandler = StripeCheckout.configure({
    //     key: this.props.stripeKey,
    //   });
    // }
  }

  render() {
    const { scriptFailedToLoad } = this.props;

    const { currentFlowStage, customerTransactions, pageTitle, userCardDetails } = this.state;

    return (

      <Page backout={{ title: pageTitle, backLabel: __('Done') }} noFooter noSideNavigation>
        <div>
          {scriptFailedToLoad && (
            <div className="error__text">There was an error connecting to Stripe. Please try again later.</div>
          )}
        </div>

        {currentFlowStage === 'loading' && <div className="headerCard toConfirmCard">
          <Card
            title={__('Connect your card with Odysee')}
            subtitle={__('Getting your card connection status...')}
          />
        </div>}

        {currentFlowStage === 'confirmingCard' && <div className="headerCard toConfirmCard">
          {/*<Card*/}
          {/*  title={__('Connect your card with Odysee')}*/}
          {/*  subtitle={__('Securely connect your card to your Odysee account to tip your favorite creators')}*/}
          {/*/>*/}
        </div>}

        {currentFlowStage === 'confirmingCard' && <div className="sr-root">
          <div className="sr-main">
            <div className="sr-payment-form card cardInput">
              <div className="sr-form-row">
                <label className="payment-details">
                  Card Details
                </label>
                <div className="sr-input sr-element sr-card-element" id="card-element" />
              </div>
              <div className="sr-field-error" id="card-errors" role="alert" />
              <button className="linkButton" id="submit">
                <div className="spinner hidden" id="spinner" />
                <span id="button-text">Add Card</span>
              </button>
            </div>
          </div>
        </div>}

        {currentFlowStage === 'cardConfirmed' && <div className="successCard">
          {/*<Card*/}
          {/*  title={__('Card successfully added!')}*/}
          {/*  subtitle={__('Congratulations! Your card has been successfully added to your Odysee account. You can now tip your favorite creators while viewing their content.')}*/}
          {/*/>*/}

          {/*<br></br>*/}

          <Card
            title={__('Card Details')}
            // subtitle={'Brand: ' + userCardDetails.brand.toUpperCase()}
            // expandable: true
            // // subtitle={'Last 4: ' + userCardDetails.lastFour}
            body={<>
              <h4 className="grey-text">Brand: {userCardDetails.brand.toUpperCase()} &nbsp;
                Last 4:  {userCardDetails.lastFour} &nbsp;
                Expires: {userCardDetails.expiryMonth}/{userCardDetails.expiryYear} &nbsp;
                </h4>
              </>}
          />
          <br />

          {customerTransactions && <Card
            title={__('Tip History')}
            subtitle={''}
          />}

          {!customerTransactions && <Card
            title={__('Tip History')}
            subtitle={__('You have not sent any tips yet. When you do they will appear here. ')}
          />}


          {customerTransactions && <div className="table__wrapper">
            <table className="table table--transactions">
              <thead>
              <tr>
                <th className="date-header">{__('Date')}</th>
                <th>{<>{__('Receiving Channel Name')}</>}</th>
                <th>{__('Amount (USD)')} </th>
                <th>{__('Anonymous')}</th>
              </tr>
              </thead>
              <tbody>
              {customerTransactions &&
              customerTransactions.map((transaction) => (
                <tr>
                  <td>{transaction.created_at}</td>
                  <td>{transaction.channel_name}</td>
                  <td>${transaction.tipped_amount / 100}</td>
                  <td>{transaction.private_tip ? 'Yes' :  'No'}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>}

          {/*{customerTransactions.map((transactions) => (*/}
          {/*  <h2>{transactions.id}</h2>*/}
          {/*))}*/}
        </div>}

      </Page>
    );
  }
}

export default CardVerify;
/* eslint-enable no-undef */
/* eslint-enable react/prop-types */
