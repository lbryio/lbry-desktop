// @flow
import React from 'react';
import Button from 'component/button';
import * as icons from 'constants/icons';

let scriptLoading = false;
let scriptLoaded = false;
let scriptDidError = false;

declare class CardVerify {
  static stripeHandler: {
    open: Function,
    close: Function,
  };
}

declare class StripeCheckout {
  static configure({}): {
    open: Function,
    close: Function,
  };
}

type Props = {
  disabled: boolean,
  label: ?string,

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
  email: string,
};

type State = {
  open: boolean,
};

class CardVerifyComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
    };
    this.onClick = this.onClick.bind(this);
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
          this.onScriptError();
        };
      });
      const wrappedPromise = new Promise((accept, cancel) => {
        promise.then(() => (canceled ? cancel(new Error({ isCanceled: true })) : accept()));
        promise.catch(
          error => (canceled ? cancel(new Error({ isCanceled: true })) : cancel(error))
        );
      });

      return {
        promise: wrappedPromise,
        cancel() {
          canceled = true;
        },
      };
    })();

    this.loadPromise.promise.then(this.onScriptLoaded).catch(this.onScriptError);

    if (document.body) {
      document.body.appendChild(script);
    }
  }

  componentDidUpdate() {
    if (!scriptLoading) {
      this.updateStripeHandler();
    }
  }

  componentWillUnmount() {
    if (this.loadPromise) {
      this.loadPromise.cancel();
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

  onScriptError = () => {
    throw new Error('Unable to load credit validation script.');
  };

  onClosed = () => {
    this.setState({ open: false });
  };

  onClick = () => {
    if (scriptDidError) {
      throw new Error('Tried to call onClick, but StripeCheckout failed to load');
    } else if (CardVerify.stripeHandler) {
      this.showStripeDialog();
    } else {
      this.hasPendingClick = true;
    }
  };

  loadPromise: {
    promise: Promise<any>,
    cancel: Function,
  };

  hasPendingClick: boolean;

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

  render() {
    return (
      <Button
        button="primary"
        label={this.props.label}
        icon={icons.LOCK}
        disabled={this.props.disabled || this.state.open || this.hasPendingClick}
        onClick={this.onClick}
      />
    );
  }
}

export default CardVerifyComponent;
