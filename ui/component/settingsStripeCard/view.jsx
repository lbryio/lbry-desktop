// @flow
import React from 'react';

import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
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

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
const CARD_NAME_REGEX = /[0-9!@#$%^&*()_+=[\]{};:"\\|,<>?~]/;

type WrapperProps = {
  isModal: boolean,
  setIsBusy: (isBusy: boolean) => void,
  // -- redux --
  email: ?string,
  preferredCurrency: string,
  customerStatusFetching: ?boolean,
  cardDetails: StripeCardDetails,
  doSetPreferredCurrency: (value: string) => void,
  doGetCustomerStatus: () => void,
  doToast: (params: { message: string }) => void,
  doOpenModal: (modalId: string, {}) => void,
  doRemoveCardForPaymentMethodId: (paymentMethodId: string) => Promise<any>,
  doCustomerSetup: () => Promise<StripeCustomerSetupResponse>,
};

type Props = WrapperProps & {
  promisePending: ?boolean,
  stripeError: ?string,
  reloadForm: () => void,
};

const SettingsStripeCard = (props: Props) => {
  const {
    isModal,
    promisePending,
    stripeError,
    reloadForm,
    setIsBusy,
    // -- redux --
    email,
    preferredCurrency,
    customerStatusFetching,
    cardDetails,
    doSetPreferredCurrency,
    doGetCustomerStatus,
    doToast,
    doOpenModal,
    doRemoveCardForPaymentMethodId,
    doCustomerSetup,
  } = props;

  const stripe = useStripe();
  const elements = useElements();

  const [cardNameValue, setCardNameValue] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [formError, setFormError] = React.useState();

  function confirmCardSetup(clientSecret) {
    const cardElement = elements.getElement(CardElement);

    stripe
      .confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement, billing_details: { email, name: cardNameValue } },
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

  function handleSubmit(event) {
    if (!stripe || !elements) return;

    event.preventDefault();
    setLoading(true);

    doCustomerSetup().then((customerSetupResponse: StripeCustomerSetupResponse) => {
      confirmCardSetup(customerSetupResponse.client_secret);
    });
  }

  React.useEffect(() => {
    if (stripeError) {
      setFormError(stripeError);
    }
  }, [stripeError]);

  React.useEffect(() => {
    if (cardDetails === undefined) {
      doGetCustomerStatus();
    }
  }, [cardDetails, doGetCustomerStatus]);

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
          className="add-payment-card"
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
                className="view-transactions__button"
                button="secondary"
                label={__('View Transactions')}
                icon={ICONS.SETTINGS}
                navigate={`/$/${PAGES.WALLET}?fiatType=outgoing&tab=fiat-payment-history&currency=fiat`}
                style={{ marginLeft: '10px' }}
              />
              <Button
                className="remove-card__button"
                button="secondary"
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
            </>
          }
        />
        <br />

        {/* currency to use toggler (USD/EUR) */}
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

        <div className="stripe-billing-history">
          <h2 className="stripe-billing-history__header">{__('View billing history on Stripe')}</h2>
          <Button
            className="stripe-billing-history__button"
            button="secondary"
            label={__('Visit Stripe')}
            navigate={`${STRIPE.STRIPE_BILLING_URL}?prefilled_email=${encodeURIComponent(cardDetails?.email)}`}
          />
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
          disabled={stripeError}
          autoFocus
        />

        <FormField
          name="card-details"
          type="input"
          label={__('Card details')}
          inputElem={
            <CardElement
              className={'stripe-card__form-input' + (stripeError ? ' disabled' : '')}
              onChange={(event) => setFormError(event.error?.message)}
            />
          }
        />

        {stripeError ? (
          <Button
            className="button--card-link"
            label={promisePending ? <div className="stripe__spinner" /> : __('Reload')}
            onClick={reloadForm}
          />
        ) : (
          <Submit
            className="button--card-link"
            disabled={isLoading || formError || !cardNameValue}
            label={isLoading ? <div className="stripe__spinner" /> : __('Add Card')}
          />
        )}

        {formError && (
          <span className="error__text error__text--stripe-card">
            <p>{formError}</p>
            {stripeError ? (
              <p>{__('You may have blockers turned on, try turning them off and reloading.')}</p>
            ) : undefined}
          </span>
        )}
      </Form>
    );
  }

  return (
    <div className="main--empty">
      {customerStatusFetching && <Spinner text={__('Getting your card connection status...')} />}
    </div>
  );
};

export default function Wrapper(props: WrapperProps) {
  const [stripeError, setStripeError] = React.useState();
  const [promisePending, setPromisePending] = React.useState(true);

  React.useEffect(() => {
    stripePromise
      .then(() => setPromisePending(false))
      .catch((e) => {
        setPromisePending(false);
        setStripeError(e.message);
      });
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <SettingsStripeCard
        {...props}
        promisePending={promisePending}
        stripeError={stripeError}
        reloadForm={() => window.location.reload()}
      />
    </Elements>
  );
}
