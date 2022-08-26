// @flow
import React from 'react';

import { Elements, useStripe, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Form, FormField, Submit } from 'component/common/form';
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
import ErrorText from 'component/common/error-text';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
const CARD_NAME_REGEX = /[0-9!@#$%^&*()_+=[\]{};:"\\|,<>?~]/;

type Props = {
  isModal: boolean,
  setIsBusy: (isBusy: boolean) => void,
  // -- redux --
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
    isModal,
    setIsBusy,
    // -- redux --
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

  const cardElement = React.useRef();

  const stripe = useStripe();

  const [cardNameValue, setCardNameValue] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [formError, setFormError] = React.useState();

  const clientSecret = customerSetupResponse?.client_secret;

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    // if client secret wasn't loaded properly
    if (!clientSecret) {
      setFormError(__('There was an error in generating your payment method. Please contact a developer'));
      return;
    }

    stripe
      .confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement.current, billing_details: { email, name: cardNameValue } },
      })
      .then((result) => {
        if (result.error) {
          setLoading(false);
          setFormError(result.error.message);
        } else {
          // The PaymentMethod was successfully set up
          // hide and show the proper divs
          stripe.retrieveSetupIntent(clientSecret).then(doGetCustomerStatus);
        }
      });
  }

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
    if (cardDetails) {
      setLoading(false);
      if (setIsBusy) setIsBusy(false);
      setCardNameValue('');
    }
  }, [cardDetails, setIsBusy]);

  // $FlowFixMe
  const returnToValue = new URLSearchParams(location.search).get('returnTo');
  let shouldShowBackToMembershipButton = returnToValue === 'premium';

  function clearErrorMessage() {
    setFormError(undefined);
  }

  function onChangeCardName(event) {
    const { value } = event.target;

    if (CARD_NAME_REGEX.test(value)) {
      setFormError(__('Special characters and numbers are not allowed'));
    } else if (value.length > 48) {
      setFormError(__('Name must be less than 48 characters long'));
    } else {
      clearErrorMessage();
      setCardNameValue(value);
    }
  }

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
          title={isModal ? undefined : __('Card Details')}
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
      <Form className="stripe-card__form" onSubmit={handleSubmit}>
        <FormField
          className="stripe-card__form-input"
          name="name-on-card"
          type="input"
          label={__('Name on card')}
          onChange={onChangeCardName}
          value={cardNameValue}
          onBlur={clearErrorMessage}
          autoFocus
        />

        <FormField
          name="card-details"
          type="input"
          label={__('Card details')}
          inputElem={
            <CardElement
              className="stripe-card__form-input"
              onReady={(element) => {
                cardElement.current = element;
              }}
              onChange={(event) => setFormError(event.error?.message)}
            />
          }
        />

        <Submit
          className="button--card-link"
          disabled={isLoading || formError || !cardNameValue}
          label={isLoading ? <div className="stripe__spinner" /> : __('Add Card')}
        />

        {formError && <ErrorText>{formError}</ErrorText>}
      </Form>
    );
  }

  return (
    <div className="main--empty">
      {customerStatusFetching && <Spinner text={__('Getting your card connection status...')} />}
    </div>
  );
};

export default function Wrapper(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <SettingsStripeCard {...props} />
    </Elements>
  );
}
