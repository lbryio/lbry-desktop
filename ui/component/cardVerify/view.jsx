/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import Button from 'component/button';

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
    if (scriptLoaded) {
      return;
    }

    if (scriptLoading) {
      return;
    }

    scriptLoading = true;

    const script = document.createElement('script');
    script.src = 'https://checkout.stripe.com/checkout.js';
    script.async = true;

    this.loadPromise = (() => {
      let canceled = false;
      const promise = new Promise((resolve, reject) => {
        script.onload = () => {
          scriptLoaded = true;
          scriptLoading = false;
          resolve();
          this.onScriptLoaded();
        };
        script.onerror = event => {
          scriptDidError = true;
          scriptLoading = false;
          reject(event);
          this.onScriptError(event);
        };
      });
      const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(() => (canceled ? reject({ isCanceled: true }) : resolve()));
        promise.catch(error => (canceled ? reject({ isCanceled: true }) : reject(error)));
      });

      return {
        promise: wrappedPromise,
        reject() {
          canceled = true;
        },
      };
    })();

    this.loadPromise.promise.then(this.onScriptLoaded).catch(this.onScriptError);

    // $FlowFixMe
    document.body.appendChild(script);
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
    if (!CardVerify.stripeHandler) {
      CardVerify.stripeHandler = StripeCheckout.configure({
        key: this.props.stripeKey,
      });

      if (this.hasPendingClick) {
        this.showStripeDialog();
      }
    }
  };

  onScriptError = (...args) => {
    this.setState({ scriptFailedToLoad: true });
  };

  onClosed = () => {
    this.setState({ open: false });
  };

  updateStripeHandler() {
    if (!CardVerify.stripeHandler) {
      CardVerify.stripeHandler = StripeCheckout.configure({
        key: this.props.stripeKey,
      });
    }
  }

  showStripeDialog() {
    this.setState({ open: true });
    CardVerify.stripeHandler.open({
      allowRememberMe: false,
      closed: this.onClosed,
      description: __('Confirm Identity'),
      email: this.props.email,
      locale: 'auto',
      panelLabel: 'Verify',
      token: this.props.token,
      zipCode: true,
    });
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
      <div>
        {scriptFailedToLoad && (
          <div className="error__text">There was an error connecting to Stripe. Please try again later.</div>
        )}

        <Button
          button="primary"
          label={this.props.label}
          disabled={this.props.disabled || this.state.open || this.hasPendingClick}
          onClick={this.onClick.bind(this)}
        />
      </div>
    );
  }
}

export default CardVerify;
/* eslint-enable no-undef */
/* eslint-enable react/prop-types */
