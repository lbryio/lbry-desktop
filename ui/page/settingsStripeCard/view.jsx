// @flow
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import Card from 'component/common/card';
import { SETTINGS } from 'lbry-redux';
import { Lbryio } from 'lbryinc';
import { STRIPE_ACCOUNT_CONNECTION_FAILURE_URL, STRIPE_ACCOUNT_CONNECTION_SUCCESS_URL } from '../../../config';

let scriptLoading = false;
let scriptLoaded = false;
let scriptDidError = false;

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
    var publicKey = 'pk_test_NoL1JWL7i1ipfhVId5KfDZgo';

    // client secret of the SetupIntent (don't share with anyone but customer)
    var clientSecret = '';

    // setting a timeout to let the client secret populate
    // TODO: fix this, should be a cleaner way
    setTimeout(function() {
      Lbryio.call('customer', 'status', {}, 'post').then(customerStatusResponse => {
        
        const defaultPaymentMethod = customerStatusResponse.Customer.invoice_settings.default_payment_method;

        var userHasAlreadySetupPayment = Boolean(defaultPaymentMethod && defaultPaymentMethod.id);

        // show different frontend if user already has card
        if (userHasAlreadySetupPayment) {
          that.setState({
            currentFlowStage: 'cardConfirmed',
          });
        } else {
          that.setState({
            currentFlowStage: 'confirmingCard',
          });

          Lbryio.call('customer', 'setup', {}, 'post').then(customerSetupResponse => {
            console.log(customerSetupResponse);

            clientSecret = customerSetupResponse.client_secret;

            setupStripe();
          });
        }
      }).catch(function(error) {
          console.log(error);

          // errorString passed from the API (with a 403 error)
          const errorString = 'user as customer is not setup yet';

          // if it's beamer's error indicating the account is not linked yet
          if (error.message.indexOf(errorString) > -1) {
            // TODO: check the error better
            that.setState({
              currentFlowStage: 'confirmingCard',
            });

            Lbryio.call('customer', 'setup', {}, 'post').then(customerSetupResponse => {
              console.log(customerSetupResponse);

              clientSecret = customerSetupResponse.client_secret;
              setupStripe();
            });

          } else {
            console.log('Unseen before error');
          }
        });
    }, 250);

    function setupStripe(){
      // TODO: have to fix this, using so that the script is available
      setTimeout(function(){
        var stripeElements = function(publicKey, setupIntent) {
          var stripe = Stripe(publicKey);
          var elements = stripe.elements();

          // Element styles
          var style = {
            base: {
              fontSize: "16px",
              color: "#32325d",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
              fontSmoothing: "antialiased",
              "::placeholder": {
                color: "rgba(0,0,0,0.4)"
              }
            }
          };

          var card = elements.create("card", { style: style });

          card.mount("#card-element");

          // Element focus ring
          card.on("focus", function() {
            var el = document.getElementById("card-element");
            el.classList.add("focused");
          });

          card.on("blur", function() {
            var el = document.getElementById("card-element");
            el.classList.remove("focused");
          });

          var email = that.props.email;

          // Handle payment submission when user clicks the pay button.
          var button = document.getElementById('submit');
          button.addEventListener('click', function(event) {

            event.preventDefault();

            // if client secret wasn't loaded properly
            if (!clientSecret){
              var displayErrorText = 'There was an error in generating your payment method. Please contact a developer';
              var displayError = document.getElementById("card-errors");
              displayError.textContent = displayErrorText;

              return;
            };

            changeLoadingState(true);

            stripe.confirmCardSetup(clientSecret, {
              payment_method: {
                card: card,
                billing_details: { email: email },
              },
            }).then(function(result) {
              if (result.error) {
                changeLoadingState(false);
                var displayError = document.getElementById("card-errors");
                displayError.textContent = result.error.message;
              } else {
                // The PaymentMethod was successfully set up
                // hide and show the proper divs
                orderComplete(stripe, clientSecret);
              }
            })
          });
        };

        // TODO: possible bug here where clientSecret isn't done
        stripeElements(publicKey, clientSecret);

        // Show a spinner on payment submission
        var changeLoadingState = function(isLoading) {
          if (isLoading) {
            document.querySelector("button").disabled = true;
            document.querySelector("#spinner").classList.remove("hidden");
            document.querySelector("#button-text").classList.add("hidden");
          } else {
            document.querySelector("button").disabled = false;
            document.querySelector("#spinner").classList.add("hidden");
            document.querySelector("#button-text").classList.remove("hidden");
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

    const { currentFlowStage } = this.state;

    console.log(currentFlowStage);


    return (

      <Page backout={{ title: __('Manage Card'), backLabel: __('Done') }} noFooter noSideNavigation>
        <div>
          {scriptFailedToLoad && (
            <div className="error__text">There was an error connecting to Stripe. Please try again later.</div>
          )}
        </div>

        {currentFlowStage === 'loading' && <div className="headerCard">
          <Card
            title={__('Connect your card with Odysee')}
            subtitle={__('Getting your card connection status...')}
          />
        </div>}

        {currentFlowStage === 'confirmingCard' && <div className="headerCard">
          <Card
            title={__('Connect your card with Odysee')}
            subtitle={__('Securely connect your card to your Odysee account to tip your favorite creators')}
          />
        </div>}

        {currentFlowStage === 'confirmingCard' && <div className="sr-root">
          <div className="sr-main">
            <div className="sr-payment-form card cardInput">
              <div className="sr-form-row">
                <label className="payment-details">
                  Payment Details
                </label>
                <div className="sr-input sr-element sr-card-element" id="card-element">
                </div>
              </div>
              <div className="sr-field-error" id="card-errors" role="alert"></div>
              <button className="linkButton" id="submit">
                <div className="spinner hidden" id="spinner"></div>
                <span id="button-text">Link your card to your account</span>
              </button>
            </div>
          </div>
        </div>}

        {currentFlowStage === 'cardConfirmed' && <div className="successCard">
          <Card
            title={__('Card successfully added!')}
            subtitle={__('Congratulations! Your card has been successfully added to your Odysee account. You can now tip your favorite creators while viewing their content.')}
          />
        </div>}

      </Page>
    );
  }
}

export default CardVerify;
/* eslint-enable no-undef */
/* eslint-enable react/prop-types */
