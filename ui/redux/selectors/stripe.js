// @flow
import { selectChannelClaimIdForUri } from 'redux/selectors/claims';

type State = { claims: any, user: UserState, stripe: StripeState };

const selectState = (state: State) => state.stripe || {};

export const selectCanReceiveFiatTipsById = (state: State) => selectState(state).canReceiveFiatTipsById || {};
export const selectAccountCheckFetchingIds = (state: State) => selectState(state).accountCheckFetchingIds;
export const selectAccountLinkResponse = (state: State) => selectState(state).accountLinkResponse;
export const selectPaymentHistory = (state: State) => selectState(state).accountPaymentHistory;
export const selectAccountTransactions = (state: State) => selectState(state).accountTransactions;
export const selectCustomerStatus = (state: State) => selectState(state).customerStatus;
export const selectCustomerStatusFetching = (state: State) => selectState(state).customerStatusFetching;
export const selectCustomerSetupResponse = (state: State) => selectState(state).customerSetupResponse;

export const selectAccountStatus = (state: State) => selectState(state).accountStatus;
export const selectAccountUnpaidBalance = (state: State) => selectAccountStatus(state)?.total_received_unpaid || 0;
export const selectAccountChargesEnabled = (state: State) => Boolean(selectAccountStatus(state)?.charges_enabled);

export const selectAccountCheckIsFetchingForId = (state: State, id: string) =>
  selectAccountCheckFetchingIds(state).includes(id);

export const selectAccountRequiresVerification = (state: State) => {
  const chargesEnabled = selectAccountChargesEnabled(state);

  if (!chargesEnabled) return false;

  const accountStatus = selectAccountStatus(state);
  const eventuallyDueInformation = accountStatus?.account_info.requirements.eventually_due;
  const currentlyDueInformation = accountStatus?.account_info.requirements.currently_due;

  if (Number.isInteger(eventuallyDueInformation?.length) || Number.isInteger(currentlyDueInformation?.length)) {
    return true;
  }

  return false;
};

export const selectPaymentMethods = (state: State) => {
  const customerStatus = selectCustomerStatus(state);
  const { PaymentMethods: paymentMethods } = customerStatus || {};

  return Number.isInteger(paymentMethods?.length) && paymentMethods;
};

export const selectLastFour = (state: State) => {
  const paymentMethods = selectPaymentMethods(state);
  const lastFour = paymentMethods && paymentMethods[0].card.last4;
  return lastFour;
};

export const selectHasSavedCard = (state: State) => {
  const customerStatus = selectCustomerStatus(state);
  const defaultPaymentMethod = customerStatus?.Customer?.invoice_settings?.default_payment_method;
  return [null, undefined].includes(defaultPaymentMethod) ? defaultPaymentMethod : Boolean(defaultPaymentMethod);
};

export const selectCardDetails = (state: State) => {
  const hasSavedCard = selectHasSavedCard(state);

  if (!hasSavedCard) return hasSavedCard;

  const customerStatus = selectCustomerStatus(state);
  const card = customerStatus.PaymentMethods[0].card;
  const customer = customerStatus.Customer;
  const email = customer.email;

  const cardDetails: StripeCardDetails = {
    paymentMethodId: customerStatus.PaymentMethods[0].id,
    cardName: customerStatus.PaymentMethods[0].billing_details.name,
    brand: card.brand,
    expiryYear: card.exp_year,
    expiryMonth: card.exp_month,
    lastFour: card.last4,
    email,
  };

  return cardDetails;
};

export const selectCanReceiveFiatTipsForUri = (state: State, uri: string) => {
  const byId = selectCanReceiveFiatTipsById(state);
  // $FlowFixMe
  const channelId = selectChannelClaimIdForUri(state, uri);
  return channelId && byId[channelId];
};
