// @flow
import React from 'react';
import Button from 'component/button';

let scriptLoading = false;
let scriptLoaded = false;
let scriptDidError = false;

type Props = {
  disabled: boolean,
  label: ?string,
  email: string,

  // =====================================================
  // Required by stripe
  // see Stripe docs for more info:
  //   https://stripe.com/docs/checkout#integration-custom
  // =====================================================

  // Your publishable key (test or live).
  // can't use "key" as a prop in react, so have to change the keyname
  stripeKey: string,

  // The callback to invoke when the Checkout process is complete.
  //   function(token)
  //     token is the token object created.
  //     token.id can be used to create a charge or customer.
  //     token.email contains the email address entered by the user.
  token: string,
};

type State = {
  open: boolean,
};

class CardVerify extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
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
    throw new Error('Unable to load credit validation script.');
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
    return (
      <Button
        button="inverse"
        label={this.props.label}
        disabled={this.props.disabled || this.state.open || this.hasPendingClick}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}

export default CardVerify;
