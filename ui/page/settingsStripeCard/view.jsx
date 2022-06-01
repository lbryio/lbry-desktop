// restore flow
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import { Lbryio } from 'lbryinc';
import Plastic from 'react-plastic';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import { FormField } from 'component/common/form';
import { STRIPE_PUBLIC_KEY } from 'config';
import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

const STRIPE_PLUGIN_SRC = 'https://js.stripe.com/v3/';

const APIS_DOWN_ERROR_RESPONSE = __('There was an error from the server, please try again later');
const CARD_SETUP_ERROR_RESPONSE = __('There was an error getting your card setup, please try again later');

// eslint-disable-next-line flowtype/no-types-missing-file-annotation
type Props = {
  disabled: boolean,
  label: ?string,
  email: ?string,
  scriptFailedToLoad: boolean,
  doOpenModal: (string, {}) => void,
  doToast: ({}) => void,
  openModal: (string, {}) => void,
  setAsConfirmingCard: () => void,
  locale: ?any,
  preferredCurrency: string,
  setPreferredCurrency: (string) => void,
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
      preferredCurrency: 'USD',
    };
  }

  componentDidMount() {
    let that = this;

    const { preferredCurrency, locale } = this.props;

    // use preferredCurrency if it's set on client, otherwise use USD, unless in Europe then use EUR
    if (preferredCurrency) {
      that.setState({
        preferredCurrency: preferredCurrency,
      });
    } else if (locale) {
      if (locale.continent === 'EU') {
        that.setState({
          preferredCurrency: 'EUR',
        });
      }
    }

    let doToast = this.props.doToast;

    // only add script if it doesn't already exist
    const stripeScriptExists = document.querySelectorAll(`script[src="${STRIPE_PLUGIN_SRC}"]`).length > 0;

    if (!stripeScriptExists) {
      const script = document.createElement('script');
      script.src = STRIPE_PLUGIN_SRC;
      script.async = true;

      // $FlowFixMe
      document.body.appendChild(script);
    }

    // public key of the stripe account
    let publicKey = STRIPE_PUBLIC_KEY;

    // client secret of the SetupIntent (don't share with anyone but customer)
    let clientSecret = '';

    // setting a timeout to let the client secret populate
    // TODO: fix this, should be a cleaner way
    setTimeout(function () {
      // check if customer has card setup already
      if (stripeEnvironment) {
        Lbryio.call(
          'customer',
          'status',
          {
            environment: stripeEnvironment,
          },
          'post',
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
                pageTitle: 'Payment Methods',
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
                'post',
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
              'post',
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
                'post',
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
      }
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
              'post',
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
                pageTitle: 'Payment Methods',
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

    const returnToValue = new URLSearchParams(location.search).get('returnTo');
    let shouldShowBackToMembershipButton = returnToValue === 'premium';

    function setAsConfirmingCard() {
      that.setState({
        currentFlowStage: 'confirmingCard',
      });
    }

    const { setPreferredCurrency } = this.props;

    // when user changes currency in selector
    function onCurrencyChange(event) {
      const { value } = event.target;

      // update preferred currency in frontend
      that.setState({
        preferredCurrency: value,
      });

      // update client settings
      setPreferredCurrency(value);
    }

    const { scriptFailedToLoad, openModal } = this.props;

    const { currentFlowStage, pageTitle, userCardDetails, paymentMethodId, preferredCurrency } = this.state;

    return (
      <Page noFooter noSideNavigation className="card-stack" backout={{ title: __(pageTitle), backLabel: __('Back') }}>
        {/* if Stripe javascript didn't load */}
        <div>
          {scriptFailedToLoad && (
            <div className="error__text">{__('There was an error connecting to Stripe. Please try again later.')}</div>
          )}
        </div>

        {/* initial markup to show while getting information */}
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
                  <span id="button-text">{__('Add Card')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* if the user has already confirmed their card */}
        {currentFlowStage === 'cardConfirmed' && (
          <div className="successCard">
            {/* back to membership button */}
            {shouldShowBackToMembershipButton && (
              <Button
                button="primary"
                label={__('Back To Odysee Premium')}
                icon={ICONS.UPGRADE}
                navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}`}
                style={{ marginBottom: '20px' }}
              />
            )}
            <Card
              title={__('Card Details')}
              className="add-payment-card-div"
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
                    button="primary"
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
                  <Button
                    button="secondary"
                    label={__('View Transactions')}
                    icon={ICONS.SETTINGS}
                    navigate={`/$/${PAGES.WALLET}?fiatType=outgoing&tab=fiat-payment-history&currency=fiat`}
                    style={{ marginLeft: '10px' }}
                  />
                </>
              }
            />
            <br />

            <div className="currency-to-use-div">
              <h1 className="currency-to-use-header">{__('Currency To Use')}:</h1>

              <fieldset-section>
                <FormField
                  className="currency-to-use-selector"
                  name="currency_selector"
                  type="select"
                  onChange={onCurrencyChange}
                  value={preferredCurrency}
                >
                  {['USD', 'EUR'].map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </FormField>
              </fieldset-section>
            </div>
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsStripeCard;
/* eslint-enable no-undef */
/* eslint-enable react/prop-types */
