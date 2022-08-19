// @flow
import React from 'react';

import { FormField } from 'component/common/form';
import { STRIPE_PUBLIC_KEY } from 'config';

import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import * as STRIPE from 'constants/stripe';

import Card from 'component/common/card';
// $FlowFixMe
import Plastic from 'react-plastic';
import Button from 'component/button';
import Spinner from 'component/spinner';

const STRIPE_PLUGIN_SRC = 'https://js.stripe.com/v3/';

type Props = {
  email: ?string,
  preferredCurrency: string,
  customerStatusFetching: ?boolean,
  cardDetails: StripeCardDetails,
  customerSetupResponse: StripeCustomerSetupResponse,
  doSetPreferredCurrency: (value: string) => void,
  doGetCustomerStatus: () => void,
  doToast: (params: { message: string }) => void,
  doOpenModal: (modalId: string, {}) => void,
  doRemoveCardForPaymentMethodId: (paymentMethodId: string) => Promise<any>,
  doCustomerSetup: () => Promise<StripeCustomerSetupResponse>,
};

const SettingsStripeCard = (props: Props) => {
  const {
    email,
    preferredCurrency,
    customerStatusFetching,
    cardDetails,
    customerSetupResponse,
    doSetPreferredCurrency,
    doGetCustomerStatus,
    doToast,
    doOpenModal,
    doRemoveCardForPaymentMethodId,
    doCustomerSetup,
  } = props;

  const didStripeConfirm = React.useRef(false);

  const [cardNameValue, setCardNameValue] = React.useState('');
  const [cardElement, setCardElement] = React.useState(undefined);

  const clientSecret = customerSetupResponse?.client_secret;

  React.useEffect(() => {
    if (cardDetails === undefined) {
      doGetCustomerStatus();
    }
  }, [cardDetails, doGetCustomerStatus]);

  React.useEffect(() => {
    if (cardDetails === null) {
      doCustomerSetup();
    }
  }, [cardDetails, doCustomerSetup]);

  React.useEffect(() => {
    if (clientSecret && cardElement && !didStripeConfirm.current) {
      const stripeElements = (setupIntent) => {
        const stripe = window.Stripe(STRIPE_PUBLIC_KEY);
        const elements = stripe.elements();

        // Element styles
        const style = {
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

        const card = elements.create('card', { style: style });

        card.mount('#card-element');

        // Element focus ring
        card.on('focus', () => {
          const elem = document.getElementById('card-element');
          if (elem) elem.classList.add('focused');
        });

        card.on('blur', () => {
          const elem = document.getElementById('card-element');
          if (elem) elem.classList.remove('focused');
        });

        card.on('ready', () => {
          const elem = document.getElementById('card-element');
          if (elem) elem.focus();
        });

        function submitForm(event) {
          event.preventDefault();

          const cardNameElem = document.querySelector('#card-name');
          // $FlowFixMe
          const cardUserName = cardNameElem && cardNameElem.value;
          if (!cardUserName) {
            const errorFieldElem = document.querySelector('.sr-field-error');
            if (errorFieldElem) errorFieldElem.innerHTML = __('Please enter the name on the card');
            return;
          }

          // if client secret wasn't loaded properly
          if (!clientSecret) {
            const displayErrorText = 'There was an error in generating your payment method. Please contact a developer';
            const displayError = document.getElementById('card-errors');
            if (displayError) displayError.textContent = displayErrorText;

            return;
          }

          changeLoadingState(true);

          stripe
            .confirmCardSetup(clientSecret, {
              payment_method: { card, billing_details: { email, name: cardUserName } },
            })
            .then((result) => {
              if (result.error) {
                changeLoadingState(false);
                const displayError = document.getElementById('card-errors');
                if (displayError) displayError.textContent = result.error.message;
                didStripeConfirm.current = true;
              } else {
                // The PaymentMethod was successfully set up
                // hide and show the proper divs
                stripe.retrieveSetupIntent(clientSecret).then(doGetCustomerStatus);
              }
            });
        }

        // Handle payment submission when user clicks the pay button.
        const button = document.getElementById('submit');
        // $FlowFixMe
        if (button) button.addEventListener('click', submitForm);

        // currently doesn't work because the iframe javascript context is different
        // would be nice though if it's even technically possible
        // window.addEventListener('keyup', function(event) {
        //   if (event.keyCode === 13) {
        //     submitForm(event);
        //   }
        // }, false);
      };

      stripeElements(STRIPE_PUBLIC_KEY);

      // Show a spinner on payment submission
      const changeLoadingState = (isLoading) => {
        const button = document.getElementById('submit');
        const stripeSpinner = document.getElementById('stripe-spinner');
        const buttonText = document.getElementById('button-text');

        if (isLoading) {
          // $FlowFixMe
          if (button) button.disabled = true;
          if (stripeSpinner) stripeSpinner.classList.remove('hidden');
          if (buttonText) buttonText.classList.add('hidden');
        } else {
          // $FlowFixMe
          if (button) button.disabled = false;
          if (stripeSpinner) stripeSpinner.classList.add('hidden');
          if (buttonText) buttonText.classList.remove('hidden');
        }
      };
    }
  }, [cardElement, clientSecret, doGetCustomerStatus, email]);

  React.useEffect(() => {
    // only add script if it doesn't already exist
    const stripeScript = document.querySelectorAll(`script[src="${STRIPE_PLUGIN_SRC}"]`);
    const stripeScriptExists = stripeScript && stripeScript.length > 0;

    if (!stripeScriptExists) {
      const script = document.createElement('script');
      script.src = STRIPE_PLUGIN_SRC;
      script.async = true;

      // $FlowFixMe
      document.body.appendChild(script);
    }
  }, []);

  // $FlowFixMe
  const returnToValue = new URLSearchParams(location.search).get('returnTo');
  let shouldShowBackToMembershipButton = returnToValue === 'premium';

  function clearErrorMessage() {
    const errorElement = document.querySelector('.sr-field-error');

    // $FlowFixMe
    if (errorElement) errorElement.innerHTML = '';
  }

  function onChangeCardName(event) {
    const { value } = event.target;

    const numberOrSpecialCharacter = /[0-9!@#$%^&*()_+=[\]{};:"\\|,<>?~]/;

    const errorElement = document.querySelector('.sr-field-error');

    if (!errorElement) return;

    if (numberOrSpecialCharacter.test(value)) {
      // $FlowFixMe
      errorElement.innerHTML = __('Special characters and numbers are not allowed');
    } else if (value.length > 48) {
      // $FlowFixMe
      errorElement.innerHTML = __('Name must be less than 48 characters long');
    } else {
      // $FlowFixMe
      errorElement.innerHTML = '';

      setCardNameValue(value);
    }
  }

  const cardElementRef = React.useCallback((node) => {
    if (node) setCardElement(node);
  }, []);

  if (cardDetails) {
    return (
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
                type={cardDetails.brand}
                name={cardDetails.cardName}
                expiry={cardDetails.expiryMonth + '/' + cardDetails.expiryYear}
                number={'____________' + cardDetails.lastFour}
              />
              <br />
              <Button
                button="primary"
                label={__('Remove Card')}
                icon={ICONS.DELETE}
                onClick={(e) =>
                  doOpenModal(MODALS.CONFIRM, {
                    title: __('Confirm Remove Card'),
                    subtitle: __('Remove the current card in your account?'),
                    onConfirm: (closeModal, setIsBusy) => {
                      setIsBusy(true);
                      doRemoveCardForPaymentMethodId(cardDetails.paymentMethodId).then(() => {
                        setIsBusy(false);
                        doToast({ message: __('Successfully removed card.') });
                        closeModal();
                      });
                    },
                  })
                }
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
              onChange={(e) => doSetPreferredCurrency(e.target.value)}
              value={preferredCurrency}
            >
              {Object.values(STRIPE.CURRENCIES).map((currency) => (
                <option key={String(currency)} value={String(currency)}>
                  {String(currency)}
                </option>
              ))}
            </FormField>
          </fieldset-section>
        </div>
      </div>
    );
  }

  if (cardDetails === null) {
    return (
      <div className="sr-root">
        <div className="sr-main">
          <div className="">
            <div className="sr-form-row">
              <label className="payment-details">{__('Name on card')}</label>
              <input
                type="text"
                id="card-name"
                onChange={onChangeCardName}
                value={cardNameValue}
                onBlur={clearErrorMessage}
                autoFocus
              />
            </div>
            <div className="sr-form-row">
              <label className="payment-details">{__('Card details')}</label>
              <div ref={cardElementRef} className="sr-input sr-element sr-card-element" id="card-element" />
            </div>
            <div className="sr-field-error" id="card-errors" role="alert" />
            <button className="linkButton" id="submit">
              <div className="stripe__spinner hidden" id="stripe-spinner" />
              <span id="button-text">{__('Add Card')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main--empty">
      {customerStatusFetching && <Spinner text={__('Getting your card connection status...')} />}
    </div>
  );
};

export default SettingsStripeCard;
