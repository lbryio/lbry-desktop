import * as types from "constants/action_types";

const reducers = {};
const buildClaimSupport = () => ({
  name: undefined,
  amount: undefined,
  claim_id: undefined,
});

const defaultState = {
  claimSupport: buildClaimSupport(),
};

reducers[types.SET_CLAIM_SUPPORT_CLAIM] = function(state, action) {
  const oldClaimSupport = state.claimSupport;
  const newClaimSupport = Object.assign({}, oldClaimSupport, {
    claim_id: action.data.claim_id,
    name: action.data.name,
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

reducers[types.SET_CLAIM_SUPPORT_AMOUNT] = function(state, action) {
  const oldClaimSupport = state.claimSupport;
  const newClaimSupport = Object.assign({}, oldClaimSupport, {
    amount: parseFloat(action.data.amount),
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

reducers[types.CLAIM_SUPPORT_STARTED] = function(state, action) {
  const newClaimSupport = Object.assign({}, state.claimSupport, {
    sending: true,
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

reducers[types.CLAIM_SUPPORT_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    draftTransaction: buildClaimSupport(),
  });
};

reducers[types.CLAIM_SUPPORT_FAILED] = function(state, action) {
  const newClaimSupport = Object.assign({}, state.claimSupport, {
    sending: false,
    error: action.data.error,
  });

  return Object.assign({}, state, {
    claimSupport: newClaimSupport,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
