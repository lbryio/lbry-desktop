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
    };
  }

  componentDidMount() {

    var that = this;

    if (scriptLoaded) {
      return;
    }

    if (scriptLoading) {
      return;
    }

    scriptLoading = true;

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;

    // $FlowFixMe
    document.body.appendChild(script);

    // run after the dom is loaded
    // window.addEventListener("DOMContentLoaded", function() {

    // public key of the stripe account
    var publicKey = 'pk_test_NoL1JWL7i1ipfhVId5KfDZgo';

    // client secret of the SetupIntent (don't share with anyone but customer)
    // var clientSecret = 'seti_1J3ULjIrsVv9ySuhkUWZXOmV_secret_Jgs5DyXwLF12743YO1apFxQvnawbCna';
    var clientSecret = '';

    Lbryio.call('customer', 'setup', {}, 'post').then(customerSetupResponse => {
      console.log('credit card response');
      console.log(customerSetupResponse);
      clientSecret = customerSetupResponse.client_secret;
    });

    // TODO: have to fix this
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

        console.log('email');

        console.log(that.props);
        console.log('email');
        console.log(email);

        // Handle payment submission when user clicks the pay button.
        var button = document.getElementById("submit");
        button.addEventListener("click", function(event) {
          event.preventDefault();
          changeLoadingState(true);

          stripe
            .confirmCardSetup(clientSecret, {
              payment_method: {
                card: card,
                billing_details: { email: email }
              }
            })
            .then(function(result) {
              if (result.error) {
                changeLoadingState(false);
                var displayError = document.getElementById("card-errors");
                displayError.textContent = result.error.message;
              } else {
                // The PaymentMethod was successfully set up
                orderComplete(stripe, clientSecret);
              }
            });
        });
      };

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

      /* Shows a success / error message when the payment is complete */
      var orderComplete = function(stripe, clientSecret) {
        stripe.retrieveSetupIntent(clientSecret).then(function(result) {

          console.log(result);

          var setupIntent = result.setupIntent;
          var setupIntentJson = JSON.stringify(setupIntent, null, 2);

          document.querySelector(".sr-payment-form").classList.add("hidden");
          document.querySelector(".sr-result").classList.remove("hidden");
          document.querySelector("pre").textContent = setupIntentJson;
          setTimeout(function() {
            document.querySelector(".sr-result").classList.add("expand");
          }, 200);

          changeLoadingState(false);
        });
      };
      }, 200)

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

    return (

      <Page backout={{ title: __('Manage Stripe card'), backLabel: __('Done') }} noFooter noSideNavigation>
        <div>
          {scriptFailedToLoad && (
            <div className="error__text">There was an error connecting to Stripe. Please try again later.</div>
          )}
        </div>

        <Card
          title={__('Connect your card to tip creators')}
          subtitle={__('Securely connect your card through Stripe to tip your favorite creators')}
        />

        <div className="sr-root">
          <div className="sr-main">
            <div className="sr-payment-form card">
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
            <div className="sr-result hidden">
              <p>Card setup completed<br /></p>
              <pre>
            <code></code>
          </pre>
            </div>
          </div>
        </div>

      </Page>
    );
  }
}

export default CardVerify;
/* eslint-enable no-undef */
/* eslint-enable react/prop-types */
