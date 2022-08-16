// @flow
import * as ACTIONS from 'constants/action_types';

const reducers = {};

const defaultState: StripeState = {
  canReceiveFiatTipsById: {},
  accountStatus: undefined,
  accountLinkResponse: undefined,
  accountTransactions: undefined,
  accountPaymentHistory: undefined,
  customerStatusFetching: undefined,
  customerStatus: undefined,
  customerSetupResponse: undefined,
};

reducers[ACTIONS.SET_ACCOUNT_STATUS] = (state, action) => ({ ...state, accountStatus: action.data });
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

reducers[ACTIONS.SET_CAN_RECEIVE_FIAT_TIPS] = (state, action) => {
  const { accountCheckResponse, claimId } = action.data;
  const newCanReceiveFiatTipsById = Object.assign({}, state.canReceiveFiatTipsById);
  newCanReceiveFiatTipsById[claimId] = accountCheckResponse === true;

  return { ...state, canReceiveFiatTipsById: newCanReceiveFiatTipsById };
};

export default function stripeReducer(state: StripeState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
