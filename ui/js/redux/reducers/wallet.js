import * as types from "constants/action_types";

const reducers = {};
const address = localStorage.getItem("receiveAddress");
const buildDraftTransaction = () => ({
  amount: undefined,
  address: undefined,
});

const defaultState = {
  balance: undefined,
  blocks: {},
  transactions: {},
  fetchingTransactions: false,
  receiveAddress: address,
  gettingNewAddress: false,
  draftTransaction: buildDraftTransaction(),
  sendingSupport: false,
};

reducers[types.FETCH_TRANSACTIONS_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetchingTransactions: true,
  });
};

reducers[types.FETCH_TRANSACTIONS_COMPLETED] = function(state, action) {
  let byId = Object.assign({}, state.transactions);

  const { transactions } = action.data;

  transactions.forEach(transaction => {
    byId[transaction.txid] = transaction;
  });

  return Object.assign({}, state, {
    transactions: byId,
    fetchingTransactions: false,
  });
};

reducers[types.GET_NEW_ADDRESS_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    gettingNewAddress: true,
  });
};

reducers[types.GET_NEW_ADDRESS_COMPLETED] = function(state, action) {
  const { address } = action.data;

  localStorage.setItem("receiveAddress", address);
  return Object.assign({}, state, {
    gettingNewAddress: false,
    receiveAddress: address,
  });
};

reducers[types.UPDATE_BALANCE] = function(state, action) {
  return Object.assign({}, state, {
    balance: action.data.balance,
  });
};

reducers[types.CHECK_ADDRESS_IS_MINE_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    checkingAddressOwnership: true,
  });
};

reducers[types.CHECK_ADDRESS_IS_MINE_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    checkingAddressOwnership: false,
  });
};

reducers[types.SET_DRAFT_TRANSACTION_AMOUNT] = function(state, action) {
  const oldDraft = state.draftTransaction;
  const newDraft = Object.assign({}, oldDraft, {
    amount: parseFloat(action.data.amount),
  });

  return Object.assign({}, state, {
    draftTransaction: newDraft,
  });
};

reducers[types.SET_DRAFT_TRANSACTION_ADDRESS] = function(state, action) {
  const oldDraft = state.draftTransaction;
  const newDraft = Object.assign({}, oldDraft, {
    address: action.data.address,
  });

  return Object.assign({}, state, {
    draftTransaction: newDraft,
  });
};

reducers[types.SEND_TRANSACTION_STARTED] = function(state, action) {
  const newDraftTransaction = Object.assign({}, state.draftTransaction, {
    sending: true,
  });

  return Object.assign({}, state, {
    draftTransaction: newDraftTransaction,
  });
};

reducers[types.SEND_TRANSACTION_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    draftTransaction: buildDraftTransaction(),
  });
};

reducers[types.SEND_TRANSACTION_FAILED] = function(state, action) {
  const newDraftTransaction = Object.assign({}, state.draftTransaction, {
    sending: false,
    error: action.data.error,
  });

  return Object.assign({}, state, {
    draftTransaction: newDraftTransaction,
  });
};

reducers[types.SUPPORT_TRANSACTION_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    sendingSupport: true,
  });
};

reducers[types.SUPPORT_TRANSACTION_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    sendingSupport: false,
  });
};

reducers[types.SUPPORT_TRANSACTION_FAILED] = function(state, action) {
  return Object.assign({}, state, {
    error: action.data.error,
    sendingSupport: false,
  });
};

reducers[types.FETCH_BLOCK_SUCCESS] = (state, action) => {
  const { block, block: { height } } = action.data,
    blocks = Object.assign({}, state.blocks);

  blocks[height] = block;

  return Object.assign({}, state, { blocks });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
