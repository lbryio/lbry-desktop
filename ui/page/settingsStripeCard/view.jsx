/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import Card from 'component/common/card';
import { SETTINGS } from 'lbry-redux';

let scriptLoading = false;
let scriptLoaded = false;
let scriptDidError = false;

// Flow does not like the way this stripe plugin works
// Disabled because it was a huge pain
// type Props = {
//   disabled: boolean,
//   label: ?string,
//   email: string,

//   // =====================================================
//   // Required by stripe
//   // see Stripe docs for more info:
//   //   https://stripe.com/docs/checkout#integration-custom
//   // =====================================================

//   // Your publishable key (test or live).
//   // can't use "key" as a prop in react, so have to change the keyname
//   stripeKey: string,

//   // The callback to invoke when the Checkout process is complete.
//   //   function(token)
//   //     token is the token object created.
//   //     token.id can be used to create a charge or customer.
//   //     token.email contains the email address entered by the user.
//   token: string,
// };

class CardVerify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      scriptFailedToLoad: false,
    };
  }

  componentDidMount() {
    console.log("SOMETHING");

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

    // this.loadPromise = (() => {
    //   let canceled = false;
    //   const promise = new Promise((resolve, reject) => {
    //     script.onload = () => {
    //       scriptLoaded = true;
    //       scriptLoading = false;
    //       resolve();
    //       this.onScriptLoaded();
    //     };
    //     script.onerror = event => {
    //       scriptDidError = true;
    //       scriptLoading = false;
    //       reject(event);
    //       this.onScriptError(event);
    //     };
    //   });
    //   const wrappedPromise = new Promise((resolve, reject) => {
    //     promise.then(() => (canceled ? reject({ isCanceled: true }) : resolve()));
    //     promise.catch(error => (canceled ? reject({ isCanceled: true }) : reject(error)));
    //   });
    //
    //   return {
    //     promise: wrappedPromise,
    //     reject() {
    //       canceled = true;
    //     },
    //   };
    // })();
    //
    // this.loadPromise.promise.then(this.onScriptLoaded).catch(this.onScriptError);

    // $FlowFixMe
    document.body.appendChild(script);


    // run after the dom is loaded
    // window.addEventListener("DOMContentLoaded", function() {

      console.log('FRONTEND LOADED');

    // public key of the stripe account
    var publicKey = 'pk_test_NoL1JWL7i1ipfhVId5KfDZgo';

    // client secret of the SetupIntent (don't share with anyone but customer)
    var clientSecret = 'seti_1J06NBIrsVv9ySuhNe8kilMp_secret_JdN7X7QEudCP69ZpnL7njukN2ytXhlk';


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

        // Handle payment submission when user clicks the pay button.
        var button = document.getElementById("submit");
        button.addEventListener("click", function(event) {
          event.preventDefault();
          changeLoadingState(true);
          var email = document.getElementById("email").value;

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



      }, 1500)




      // getPublicKey();
    // }, false);



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

  showStripeDialog() {
    this.setState({ open: true });
    // CardVerify.stripeHandler.open({
    //   allowRememberMe: false,
    //   closed: this.onClosed,
    //   description: __('Confirm Identity'),
    //   email: this.props.email,
    //   locale: 'auto',
    //   panelLabel: 'Verify',
    //   token: this.props.token,
    //   zipCode: true,
    // });
  }

  onClick = () => {
    if (scriptDidError) {
      try {
        throw new Error('Tried to call onClick, but StripeCheckout failed to load');
      } catch (x) {}
    } else if (CardVerify.stripeHandler) {
      this.showStripeDialog();
    } else {
      this.hasPendingClick = true;
    }
  };

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
          title={__('App notifications')}
          subtitle={__('Notification settings for the desktop app.')}
        />

        <div className="sr-root">
          <div className="sr-main">
            <div className="sr-payment-form card">
              <div className="sr-form-row">
                <label>
                  Account details
                </label>
                <input type="text" id="email" placeholder="Email address" />
              </div>

              <div className="sr-form-row">
                <label>
                  Payment details
                </label>
                <div className="sr-input sr-element sr-card-element" id="card-element">
                </div>
              </div>
              <div className="sr-field-error" id="card-errors" role="alert"></div>
              <button id="submit">
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
