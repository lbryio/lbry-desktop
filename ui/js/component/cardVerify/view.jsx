import React from "react";
import PropTypes from "prop-types";
import Link from "component/link";

let scriptLoading = false;
let scriptLoaded = false;
let scriptDidError = false;

class CardVerify extends React.Component {
  static defaultProps = {
    label: "Verify",
    locale: "auto",
  };

  static propTypes = {
    // If included, will render the default blue button with label text.
    // (Requires including stripe-checkout.css or adding the .styl file
    // to your pipeline)
    label: PropTypes.string,

    // =====================================================
    // Required by stripe
    // see Stripe docs for more info:
    //   https://stripe.com/docs/checkout#integration-custom
    // =====================================================

    // Your publishable key (test or live).
    // can't use "key" as a prop in react, so have to change the keyname
    stripeKey: PropTypes.string.isRequired,

    // The callback to invoke when the Checkout process is complete.
    //   function(token)
    //     token is the token object created.
    //     token.id can be used to create a charge or customer.
    //     token.email contains the email address entered by the user.
    token: PropTypes.func.isRequired,

    // ==========================
    // Highly Recommended Options
    // ==========================

    // Name of the company or website.
    name: PropTypes.string,

    // A description of the product or service being purchased.
    description: PropTypes.string,

    // Specify auto to display Checkout in the user's preferred language, if
    // available. English will be used by default.
    //
    // https://stripe.com/docs/checkout#supported-languages
    // for more info.
    locale: PropTypes.oneOf([
      "auto", // (Default) Automatically chosen by checkout
      "zh", // Simplified Chinese
      "da", // Danish
      "nl", // Dutch
      "en", // English
      "fr", // French
      "de", // German
      "it", // Italian
      "ja", // Japanease
      "no", // Norwegian
      "es", // Spanish
      "sv", // Swedish
    ]),

    // ==============
    // Optional Props
    // ==============

    // The currency of the amount (3-letter ISO code). The default is USD.
    currency: PropTypes.oneOf([
      "AED",
      "AFN",
      "ALL",
      "AMD",
      "ANG",
      "AOA",
      "ARS",
      "AUD",
      "AWG",
      "AZN",
      "BAM",
      "BBD",
      "BDT",
      "BGN",
      "BIF",
      "BMD",
      "BND",
      "BOB",
      "BRL",
      "BSD",
      "BWP",
      "BZD",
      "CAD",
      "CDF",
      "CHF",
      "CLP",
      "CNY",
      "COP",
      "CRC",
      "CVE",
      "CZK",
      "DJF",
      "DKK",
      "DOP",
      "DZD",
      "EEK",
      "EGP",
      "ETB",
      "EUR",
      "FJD",
      "FKP",
      "GBP",
      "GEL",
      "GIP",
      "GMD",
      "GNF",
      "GTQ",
      "GYD",
      "HKD",
      "HNL",
      "HRK",
      "HTG",
      "HUF",
      "IDR",
      "ILS",
      "INR",
      "ISK",
      "JMD",
      "JPY",
      "KES",
      "KGS",
      "KHR",
      "KMF",
      "KRW",
      "KYD",
      "KZT",
      "LAK",
      "LBP",
      "LKR",
      "LRD",
      "LSL",
      "LTL",
      "LVL",
      "MAD",
      "MDL",
      "MGA",
      "MKD",
      "MNT",
      "MOP",
      "MRO",
      "MUR",
      "MVR",
      "MWK",
      "MXN",
      "MYR",
      "MZN",
      "NAD",
      "NGN",
      "NIO",
      "NOK",
      "NPR",
      "NZD",
      "PAB",
      "PEN",
      "PGK",
      "PHP",
      "PKR",
      "PLN",
      "PYG",
      "QAR",
      "RON",
      "RSD",
      "RUB",
      "RWF",
      "SAR",
      "SBD",
      "SCR",
      "SEK",
      "SGD",
      "SHP",
      "SLL",
      "SOS",
      "SRD",
      "STD",
      "SVC",
      "SZL",
      "THB",
      "TJS",
      "TOP",
      "TRY",
      "TTD",
      "TWD",
      "TZS",
      "UAH",
      "UGX",
      "USD",
      "UYU",
      "UZS",
      "VND",
      "VUV",
      "WST",
      "XAF",
      "XCD",
      "XOF",
      "XPF",
      "YER",
      "ZAR",
      "ZMW",
    ]),

    // The label of the payment button in the Checkout form (e.g. “Subscribe”,
    // “Pay {{amount}}”, etc.). If you include {{amount}}, it will be replaced
    // by the provided amount. Otherwise, the amount will be appended to the
    // end of your label.
    panelLabel: PropTypes.string,
  };

  constructor(props) {
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

    const script = document.createElement("script");
    script.src = "https://checkout.stripe.com/checkout.js";
    script.async = 1;

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
      const wrappedPromise = new Promise((accept, cancel) => {
        promise.then(
          () => (canceled ? cancel({ isCanceled: true }) : accept())
        );
        promise.catch(
          error => (canceled ? cancel({ isCanceled: true }) : cancel(error))
        );
      });

      return {
        promise: wrappedPromise,
        cancel() {
          canceled = true;
        },
      };
    })();

    this.loadPromise.promise
      .then(this.onScriptLoaded)
      .catch(this.onScriptError);

    document.body.appendChild(script);
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

  onScriptError = (...args) => {
    throw new Error("Unable to load credit validation script.");
  };

  onClosed = () => {
    this.setState({ open: false });
  };

  getConfig = () =>
    ["token", "name", "description"].reduce(
      (config, key) =>
        Object.assign(
          {},
          config,
          this.props.hasOwnProperty(key) && {
            [key]: this.props[key],
          }
        ),
      {
        allowRememberMe: false,
        closed: this.onClosed,
        description: __("Confirm Identity"),
        email: this.props.email,
        panelLabel: "Verify",
      }
    );

  updateStripeHandler() {
    if (!CardVerify.stripeHandler) {
      CardVerify.stripeHandler = StripeCheckout.configure({
        key: this.props.stripeKey,
      });
    }
  }

  showStripeDialog() {
    this.setState({ open: true });
    CardVerify.stripeHandler.open(this.getConfig());
  }

  onClick = () => {
    if (scriptDidError) {
      try {
        throw new Error(
          "Tried to call onClick, but StripeCheckout failed to load"
        );
      } catch (x) {}
    } else if (CardVerify.stripeHandler) {
      this.showStripeDialog();
    } else {
      this.hasPendingClick = true;
    }
  };

  render() {
    return (
      <Link
        button="primary"
        label={this.props.label}
        disabled={
          this.props.disabled || this.state.open || this.hasPendingClick
        }
        onClick={this.onClick.bind(this)}
      />
    );
  }
}

export default CardVerify;
