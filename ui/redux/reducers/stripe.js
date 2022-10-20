// @flow
import * as ACTIONS from 'constants/action_types';

const reducers = {};

const defaultState: StripeState = {
  accountCheckFetchingIds: [],
  canReceiveFiatTipsById: {},
  accountStatus: undefined,
  accountStatusFetching: false,
  accountLinkResponse: undefined,
  accountTransactions: undefined,
  accountPaymentHistory: undefined,
  customerStatusFetching: undefined,
  customerStatus: undefined,
  customerSetupResponse: undefined,
};

reducers[ACTIONS.STRIPE_ACCOUNT_STATUS_START] = (state, action) => ({ ...state, accountStatusFetching: true });
reducers[ACTIONS.STRIPE_ACCOUNT_STATUS_COMPLETE] = (state, action) => ({
  ...state,
  accountStatusFetching: false,
  accountStatus: action.data,
});

reducers[ACTIONS.SET_ACCOUNT_LINK] = (state, action) => ({ ...state, accountLinkResponse: action.data });
reducers[ACTIONS.SET_ACCOUNT_TRANSACTIONS] = (state, action) => ({ ...state, accountTransactions: action.data });
reducers[ACTIONS.SET_ACCOUNT_PAYMENT_HISTORY] = (state, action) => ({ ...state, accountPaymentHistory: action.data });
reducers[ACTIONS.SET_CUSTOMER_STATUS_STARTED] = (state, action) => ({ ...state, customerStatusFetching: true });
reducers[ACTIONS.SET_CUSTOMER_STATUS] = (state, action) => ({
  ...state,
  customerStatus: action.data,
  customerStatusFetching: false,
});

reducers[ACTIONS.SET_CUSTOMER_SETUP_RESPONSE] = (state, action) => ({ ...state, customerSetupResponse: action.data });

reducers[ACTIONS.CHECK_CAN_RECEIVE_FIAT_TIPS_STARTED] = (state, action) => {
  const channelClaimId = action.data;
  const newAccountCheckFetchingIds = new Set(state.accountCheckFetchingIds);
  newAccountCheckFetchingIds.add(channelClaimId);

  return {
    ...state,
    accountCheckFetchingIds: Array.from(newAccountCheckFetchingIds),
  };
};
reducers[ACTIONS.SET_CAN_RECEIVE_FIAT_TIPS] = (state, action) => {
  const { accountCheckResponse, claimId } = action.data;
  const newCanReceiveFiatTipsById = Object.assign({}, state.canReceiveFiatTipsById);
  newCanReceiveFiatTipsById[claimId] = accountCheckResponse === true;

  const newAccountCheckFetchingIds = new Set(state.accountCheckFetchingIds);
  newAccountCheckFetchingIds.delete(claimId);

  return {
    ...state,
    canReceiveFiatTipsById: newCanReceiveFiatTipsById,
    accountCheckFetchingIds: Array.from(newAccountCheckFetchingIds),
  };
};

export default function stripeReducer(state: StripeState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
