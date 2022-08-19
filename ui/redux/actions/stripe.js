// @flow
import { Lbryio } from 'lbryinc';
import { selectChannelClaimIdForUri, selectChannelNameForUri } from 'redux/selectors/claims';
import { selectAccountCheckIsFetchingForId } from 'redux/selectors/stripe';
import { doToast } from 'redux/actions/notifications';

import * as ACTIONS from 'constants/action_types';
import * as STRIPE from 'constants/stripe';

import { getStripeEnvironment } from 'util/stripe';
const stripeEnvironment = getStripeEnvironment();

export const doTipAccountCheckForUri = (uri: string) => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const channelClaimId = selectChannelClaimIdForUri(state, uri);
  const channelName = selectChannelNameForUri(state, uri);

  const isFetching = channelClaimId && selectAccountCheckIsFetchingForId(state, channelClaimId);

  if (isFetching) return;

  dispatch({ type: ACTIONS.CHECK_CAN_RECEIVE_FIAT_TIPS_STARTED, data: channelClaimId });

  return await Lbryio.call(
    'account',
    'check',
    { channel_claim_id: channelClaimId, channel_name: channelName, environment: stripeEnvironment },
    'post'
  )
    .then((accountCheckResponse) =>
      dispatch({ type: ACTIONS.SET_CAN_RECEIVE_FIAT_TIPS, data: { accountCheckResponse, claimId: channelClaimId } })
    )
    .catch(() =>
      dispatch({
        type: ACTIONS.SET_CAN_RECEIVE_FIAT_TIPS,
        data: { accountCheckResponse: undefined, claimId: channelClaimId },
      })
    );
};

export const doTipAccountStatus = () => async (dispatch: Dispatch) =>
  await Lbryio.call('account', 'status', { environment: stripeEnvironment }, 'post')
    .then((accountStatusResponse: StripeAccountStatus) => {
      dispatch({ type: ACTIONS.SET_ACCOUNT_STATUS, data: accountStatusResponse });

      return accountStatusResponse;
    })
    .catch((e) => {
      doToast({ message: __('There was an error getting your account setup, please try again later'), isError: true });
      dispatch({ type: ACTIONS.SET_ACCOUNT_STATUS, data: null });

      return e;
    });

export const doCustomerListPaymentHistory = () => async (dispatch: Dispatch) =>
  await Lbryio.call('customer', 'list', { environment: stripeEnvironment }, 'post')
    .then((customerTransactionResponse: StripeTransactions) => {
      // reverse so order is from most recent to latest
      if (Number.isInteger(customerTransactionResponse?.length)) customerTransactionResponse.reverse();

      // TODO: remove this once pagination is implemented
      if (customerTransactionResponse?.length && customerTransactionResponse.length > 100) {
        customerTransactionResponse.length = 100;
      }

      dispatch({ type: ACTIONS.SET_ACCOUNT_PAYMENT_HISTORY, data: customerTransactionResponse });
    })
    .catch((e) => e);

export const doListAccountTransactions = () => async (dispatch: Dispatch) =>
  await Lbryio.call('account', 'list', { environment: stripeEnvironment }, 'post').then(
    (accountListResponse: StripeTransactions) => {
      // reverse so order is from most recent to latest
      if (Number.isInteger(accountListResponse?.length)) accountListResponse.reverse();

      // TODO: remove this once pagination is implemented
      if (accountListResponse && accountListResponse.length && accountListResponse.length > 100) {
        accountListResponse.length = 100;
      }

      dispatch({ type: ACTIONS.SET_ACCOUNT_TRANSACTIONS, data: accountListResponse });
    }
  );

export const doGetAndSetAccountLink = () => async (dispatch: Dispatch) =>
  await Lbryio.call(
    'account',
    'link',
    {
      return_url: STRIPE.SUCCESS_REDIRECT_URL,
      refresh_url: STRIPE.FAILURE_REDIRECT_URL,
      environment: stripeEnvironment,
    },
    'post'
  ).then((accountLinkResponse: StripeAccountLink) =>
    dispatch({ type: ACTIONS.SET_ACCOUNT_LINK, data: accountLinkResponse })
  );

export const doGetCustomerStatus = () => async (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.SET_CUSTOMER_STATUS_STARTED });

  return await Lbryio.call('customer', 'status', { environment: stripeEnvironment }, 'post')
    .then((customerStatusResponse) => {
      dispatch({ type: ACTIONS.SET_CUSTOMER_STATUS, data: customerStatusResponse });

      return customerStatusResponse;
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.SET_CUSTOMER_STATUS, data: null });

      return e;
    });
};

export const doCustomerSetup = () => async (dispatch: Dispatch) =>
  await dispatch(doGetCustomerStatus())
    .then(() =>
      Lbryio.call(
        'customer',
        'setup',
        { environment: stripeEnvironment },
        'post'
      ).then((customerSetupResponse: StripeCustomerSetupResponse) =>
        dispatch({ type: ACTIONS.SET_CUSTOMER_SETUP_RESPONSE, data: customerSetupResponse })
      )
    )
    .catch((error) => {
      // errorString passed from the API (with a 403 error)
      const errorString = 'user as customer is not setup yet';

      // if it's beamer's error indicating the account is not linked yet
      // $FlowFixMe
      if (error.message && error.message.indexOf(errorString) > -1) {
        // get a payment method secret for frontend
        Lbryio.call(
          'customer',
          'setup',
          { environment: stripeEnvironment },
          'post'
        ).then((customerSetupResponse: StripeCustomerSetupResponse) =>
          dispatch({ type: ACTIONS.SET_CUSTOMER_SETUP_RESPONSE, data: customerSetupResponse })
        );
        // 500 error from the backend being down
      } else if (error === 'internal_apis_down') {
        doToast({ message: __(STRIPE.APIS_DOWN_ERROR_RESPONSE), isError: true });
      } else {
        // probably an error from stripe
        doToast({ message: __(STRIPE.CARD_SETUP_ERROR_RESPONSE), isError: true });
      }
    });

export const doRemoveCardForPaymentMethodId = (paymentMethodId: string) => async (dispatch: Dispatch) =>
  await Lbryio.call(
    'customer',
    'detach',
    { environment: stripeEnvironment, payment_method_id: paymentMethodId },
    'post'
  ).then(() => dispatch(doGetCustomerStatus()));
