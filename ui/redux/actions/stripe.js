// @flow
import { Lbryio } from 'lbryinc';
import { selectChannelClaimIdForUri, selectChannelNameForUri } from 'redux/selectors/claims';
import {
  selectAccountCheckIsFetchingForId,
  selectCustomerStatusFetching,
  selectAccountStatusFetching,
} from 'redux/selectors/stripe';
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

export const doTipAccountStatus = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const isFetching = selectAccountStatusFetching(state);

  if (isFetching) return Promise.resolve();

  dispatch({ type: ACTIONS.STRIPE_ACCOUNT_STATUS_START });

  return await Lbryio.call('account', 'status', { environment: stripeEnvironment }, 'post')
    .then((accountStatusResponse: StripeAccountStatus) => {
      dispatch({ type: ACTIONS.STRIPE_ACCOUNT_STATUS_COMPLETE, data: accountStatusResponse });

      return accountStatusResponse;
    })
    .catch((error) => {
      if (error.message === 'account not linked to user, please link first') {
        dispatch({ type: ACTIONS.STRIPE_ACCOUNT_STATUS_COMPLETE, data: false });
        return error;
      }

      dispatch(
        doToast({ message: __('There was an error getting your account setup, please try again later'), isError: true })
      );
      dispatch({ type: ACTIONS.STRIPE_ACCOUNT_STATUS_COMPLETE, data: null });
    });
};

export const doGetAndSetAccountLink = () => async (dispatch: Dispatch) => {
  const currentUrl = window.location.href;

  return await Lbryio.call(
    'account',
    'link',
    { return_url: currentUrl, refresh_url: currentUrl, environment: stripeEnvironment },
    'post'
  ).then((accountLinkResponse: StripeAccountLink) => {
    dispatch({ type: ACTIONS.SET_ACCOUNT_LINK, data: accountLinkResponse });
    return accountLinkResponse;
  });
};

export const doCustomerListPaymentHistory = () => async (dispatch: Dispatch) =>
  await Lbryio.call('customer', 'list', { environment: stripeEnvironment }, 'post')
    .then((customerTransactionResponse: StripeTransactions) => {
      // TODO: remove this once pagination is implemented
      if (customerTransactionResponse?.length && customerTransactionResponse.length > 100) {
        customerTransactionResponse.length = 100;
      }

      dispatch({ type: ACTIONS.SET_ACCOUNT_PAYMENT_HISTORY, data: customerTransactionResponse });
    })
    .catch((e) => e);

export const doCheckIfPurchasedClaimId = (claimId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.CHECK_IF_PURCHASED_STARTED });

  // we'll check if there's anything for the targeted id
  // if we're on a preorder and there is, build the purchase url with the reference (if exists)
  // if we're on a purchase and there is, show the video
  return await Lbryio.call('customer', 'list', { environment: stripeEnvironment, claim_id_filter: claimId }, 'post')
    .then((response) => dispatch({ type: ACTIONS.CHECK_IF_PURCHASED_COMPLETED, data: response }))
    .catch((e) => dispatch({ type: ACTIONS.CHECK_IF_PURCHASED_FAILED, data: { error: e.message } }));
};

export const doCheckIfPurchasedClaimIds = (claimIds: ClaimIds) => {
  // TODO:
  // - This is a separate function for now to reduce churn. There should just be
  // a single doCustomerList(...) that can do different actions based on function
  // parameters, so we'll update everything then.
  // - 'myPurchasedClaims' is an unnecessary duplicate of 'customerTransactionResponse'.
  // Just share the storage and do a fetch-all when viewing transaction history.
  // - Move the reducer to the stripe slice.

  return (dispatch: Dispatch) => {
    const params: StripeCustomerListParams = {
      environment: stripeEnvironment,
      claim_id_filter: claimIds.join(','),
    };

    dispatch({ type: ACTIONS.CHECK_IF_PURCHASED_STARTED });

    return Lbryio.call('customer', 'list', params, 'post')
      .then((response) => dispatch({ type: ACTIONS.CHECK_IF_PURCHASED_COMPLETED, data: response }))
      .catch((e) => dispatch({ type: ACTIONS.CHECK_IF_PURCHASED_FAILED, data: e.message }));
  };
};

export const doCustomerPurchaseCost = (cost: number) => (
  dispatch: Dispatch
): Promise<StripeCustomerPurchaseCostResponse> => {
  return Lbryio.call('customer', 'purchase_cost', { environment: stripeEnvironment, amount: cost });
};

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

export const doGetCustomerStatus = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const isFetching = selectCustomerStatusFetching(state);

  if (isFetching) return;

  dispatch({ type: ACTIONS.SET_CUSTOMER_STATUS_STARTED });

  return await Lbryio.call('customer', 'status', { environment: stripeEnvironment }, 'post')
    .then((customerStatusResponse: StripeCustomerStatus) => {
      dispatch({ type: ACTIONS.SET_CUSTOMER_STATUS, data: customerStatusResponse });

      return customerStatusResponse;
    })
    .catch((error) => {
      if (error === 'internal_apis_down') {
        dispatch(doToast({ message: __(STRIPE.APIS_DOWN_ERROR_RESPONSE), isError: true }));
      } else {
        // probably an error from stripe
        dispatch(doToast({ message: __(STRIPE.CARD_SETUP_ERROR_RESPONSE), isError: true }));
      }

      dispatch({ type: ACTIONS.SET_CUSTOMER_STATUS, data: null });

      return error;
    });
};

export const doCustomerSetup = () => async (dispatch: Dispatch) =>
  await Lbryio.call('customer', 'setup', { environment: stripeEnvironment }, 'post').then(
    (customerSetupResponse: StripeCustomerSetupResponse) => {
      dispatch({ type: ACTIONS.SET_CUSTOMER_SETUP_RESPONSE, data: customerSetupResponse });
      return customerSetupResponse;
    }
  );

export const doRemoveCardForPaymentMethodId = (paymentMethodId: string) => async (dispatch: Dispatch) =>
  await Lbryio.call(
    'customer',
    'detach',
    { environment: stripeEnvironment, payment_method_id: paymentMethodId },
    'post'
  ).then(() => dispatch(doGetCustomerStatus()));
