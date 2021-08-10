// restore flow
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import { Lbryio } from 'lbryinc';
import { STRIPE_PUBLIC_KEY } from 'config';
import Plastic from 'react-plastic';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';

let stripeEnvironment = 'test';
// if the key contains pk_live it's a live key
// update the environment for the calls to the backend to indicate which environment to hit
if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
  stripeEnvironment = 'live';
}

const APIS_DOWN_ERROR_RESPONSE = __('There was an error from the server, please try again later');
const CARD_SETUP_ERROR_RESPONSE = __('There was an error getting your card setup, please try again later');

// eslint-disable-next-line flowtype/no-types-missing-file-annotation
type Props = {
  disabled: boolean,
  label: ?string,
  email: ?string,
  scriptFailedToLoad: boolean,
  doOpenModal: (string, {}) => void,
  openModal: (string, {}) => void,
  setAsConfirmingCard: () => void,
};

// type State = {
//   open: boolean,
//   currentFlowStage: string,
//   customerTransactions: Array<any>,
//   pageTitle: string,
//   userCardDetails: any, // fill this out
//   scriptFailedToLoad: boolean,
// };

class SettingsStripeCard extends React.Component<Props, State> {
  constructor(props) {
    // :Props
    super(props);
    this.state = {
      open: false,
      scriptFailedToLoad: false,
      currentFlowStage: 'loading', // loading, confirmingCard, cardConfirmed
      customerTransactions: [],
      pageTitle: 'Add Card',
      userCardDetails: {},
      paymentMethodId: '',
    };
  }

  componentDidMount() {
    let that = this;

    let doToast = this.props.doToast;

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;

    // $FlowFixMe
    document.body.appendChild(script);

    // public key of the stripe account
    let publicKey = STRIPE_PUBLIC_KEY;

    // client secret of the SetupIntent (don't share with anyone but customer)
    let clientSecret = '';

    // setting a timeout to let the client secret populate
    // TODO: fix this, should be a cleaner way
    setTimeout(function () {
      // check if customer has card setup already
      Lbryio.call(
        'customer',
        'status',
        {
          environment: stripeEnvironment,
        },
        'post'
      )
        .then((customerStatusResponse) => {
          // user has a card saved if their defaultPaymentMethod has an id
          const defaultPaymentMethod = customerStatusResponse.Customer.invoice_settings.default_payment_method;
          let userHasAlreadySetupPayment = Boolean(defaultPaymentMethod && defaultPaymentMethod.id);

          // show different frontend if user already has card
          if (userHasAlreadySetupPayment) {
            let card = customerStatusResponse.PaymentMethods[0].card;

            let customer = customerStatusResponse.Customer;

            let topOfDisplay = customer.email.split('@')[0];
            let bottomOfDisplay = '@' + customer.email.split('@')[1];

            let cardDetails = {
              brand: card.brand,
              expiryYear: card.exp_year,
              expiryMonth: card.exp_month,
              lastFour: card.last4,
              topOfDisplay: topOfDisplay,
              bottomOfDisplay: bottomOfDisplay,
            };

            that.setState({
              currentFlowStage: 'cardConfirmed',
              pageTitle: 'Tip History',
              userCardDetails: cardDetails,
              paymentMethodId: customerStatusResponse.PaymentMethods[0].id,
            });

            // otherwise, prompt them to save a card
          } else {
            that.setState({
              currentFlowStage: 'confirmingCard',
            });

            // get a payment method secret for frontend
            Lbryio.call(
              'customer',
              'setup',
              {
                environment: stripeEnvironment,
              },
              'post'
            ).then((customerSetupResponse) => {
              clientSecret = customerSetupResponse.client_secret;

              // instantiate stripe elements
              setupStripe();
            });
          }

          // get customer transactions
          Lbryio.call(
            'customer',
            'list',
            {
              environment: stripeEnvironment,
            },
            'post'
          ).then((customerTransactionsResponse) => {
            that.setState({
              customerTransactions: customerTransactionsResponse,
            });
          });
          // if the status call fails, either an actual error or need to run setup first
        })
        .catch(function (error) {
          // errorString passed from the API (with a 403 error)
          const errorString = 'user as customer is not setup yet';

          // if it's beamer's error indicating the account is not linked yet
          if (error.message && error.message.indexOf(errorString) > -1) {
            // send them to save a card
            that.setState({
              currentFlowStage: 'confirmingCard',
            });

            // get a payment method secret for frontend
            Lbryio.call(
              'customer',
              'setup',
              {
                environment: stripeEnvironment,
              },
              'post'
            ).then((customerSetupResponse) => {
              clientSecret = customerSetupResponse.client_secret;

              // instantiate stripe elements
              setupStripe();
            });
            // 500 error from the backend being down
          } else if (error === 'internal_apis_down') {
            doToast({ message: APIS_DOWN_ERROR_RESPONSE, isError: true });
          } else {
            // probably an error from stripe
            doToast({ message: CARD_SETUP_ERROR_RESPONSE, isError: true });
          }
        });
    }, 250);

    function setupStripe() {
      // TODO: have to fix this, using so that the script is available
      setTimeout(function () {
        var stripeElements = function (publicKey, setupIntent) {
          var stripe = Stripe(publicKey);
          var elements = stripe.elements();

          // Element styles
          var style = {
            base: {
              fontSize: '16px',
              color: '#32325d',
              fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: 'rgba(0,0,0,0.4)',
              },
            },
          };

          var card = elements.create('card', { style: style });

          card.mount('#card-element');

          // Element focus ring
          card.on('focus', function () {
            var el = document.getElementById('card-element');
            el.classList.add('focused');
          });

          card.on('blur', function () {
            var el = document.getElementById('card-element');
            el.classList.remove('focused');
          });

          card.on('ready', function () {
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

            stripe
              .confirmCardSetup(clientSecret, {
                payment_method: {
                  card: card,
                  billing_details: { email: email },
                },
              })
              .then(function (result) {
                if (result.error) {
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
          button.addEventListener('click', function (event) {
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
        var changeLoadingState = function (isLoading) {
          if (isLoading) {
            // $FlowFixMe
            document.querySelector('button').disabled = true;
            // $FlowFixMe
            document.querySelector('#stripe-spinner').classList.remove('hidden');
            // $FlowFixMe
            document.querySelector('#button-text').classList.add('hidden');
          } else {
            // $FlowFixMe
            document.querySelector('button').disabled = false;
            // $FlowFixMe
            document.querySelector('#stripe-spinner').classList.add('hidden');
            // $FlowFixMe
            document.querySelector('#button-text').classList.remove('hidden');
          }
        };

        // shows a success / error message when the payment is complete
        var orderComplete = function (stripe, clientSecret) {
          stripe.retrieveSetupIntent(clientSecret).then(function (result) {
            Lbryio.call(
              'customer',
              'status',
              {
                environment: stripeEnvironment,
              },
              'post'
            ).then((customerStatusResponse) => {
              let card = customerStatusResponse.PaymentMethods[0].card;

              let customer = customerStatusResponse.Customer;

              let topOfDisplay = customer.email.split('@')[0];
              let bottomOfDisplay = '@' + customer.email.split('@')[1];

              let cardDetails = {
                brand: card.brand,
                expiryYear: card.exp_year,
                expiryMonth: card.exp_month,
                lastFour: card.last4,
                topOfDisplay,
                bottomOfDisplay,
              };

              that.setState({
                currentFlowStage: 'cardConfirmed',
                pageTitle: 'Tip History',
                userCardDetails: cardDetails,
                paymentMethodId: customerStatusResponse.PaymentMethods[0].id,
              });
            });

            changeLoadingState(false);
          });
        };
      }, 0);
    }
  }

  render() {
    let that = this;

    function setAsConfirmingCard() {
      that.setState({
        currentFlowStage: 'confirmingCard',
      });
    }

    const { scriptFailedToLoad, openModal } = this.props;

    const { currentFlowStage, pageTitle, userCardDetails, paymentMethodId } = this.state;

    return (
      <Page backout={{ title: pageTitle, backLabel: __('Done') }} noFooter noSideNavigation>
        <div>
          {scriptFailedToLoad && (
            <div className="error__text">There was an error connecting to Stripe. Please try again later.</div>
          )}
        </div>

        {currentFlowStage === 'loading' && (
          <div className="headerCard toConfirmCard">
            <Card title={__('Connect your card with Odysee')} subtitle={__('Getting your card connection status...')} />
          </div>
        )}

        {/* customer has not added a card yet */}
        {currentFlowStage === 'confirmingCard' && (
          <div className="sr-root">
            <div className="sr-main">
              <div className="sr-payment-form card cardInput">
                <div className="sr-form-row">
                  <label className="payment-details">Card Details</label>
                  <div className="sr-input sr-element sr-card-element" id="card-element" />
                </div>
                <div className="sr-field-error" id="card-errors" role="alert" />
                <button className="linkButton" id="submit">
                  <div className="stripe__spinner hidden" id="stripe-spinner" />
                  <span id="button-text">Add Card</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* if the user has already confirmed their card */}
        {currentFlowStage === 'cardConfirmed' && (
          <div className="successCard">
            <Card
              title={__('Card Details')}
              body={
                <>
                  <Plastic
                    type={userCardDetails.brand}
                    name={userCardDetails.topOfDisplay + ' ' + userCardDetails.bottomOfDisplay}
                    expiry={userCardDetails.expiryMonth + '/' + userCardDetails.expiryYear}
                    number={'____________' + userCardDetails.lastFour}
                  />
                  <br />
                  <Button
                    button="secondary"
                    label={__('Remove Card')}
                    icon={ICONS.DELETE}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openModal(MODALS.CONFIRM_REMOVE_CARD, {
                        paymentMethodId: paymentMethodId,
                        setAsConfirmingCard: setAsConfirmingCard,
                      });
                    }}
                  />
                </>
              }
              actions={
                <Button
                  button="primary"
                  label={__('View Transactions')}
                  icon={ICONS.SETTINGS}
                  navigate={`/$/${PAGES.WALLET}?tab=payment-history`}
                />
              }
            />
            <br />
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsStripeCard;
/* eslint-enable no-undef */
/* eslint-enable react/prop-types */
