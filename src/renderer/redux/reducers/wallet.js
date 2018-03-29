import * as ACTIONS from 'constants/action_types';

const reducers = {};
const receiveAddress = localStorage.getItem('receiveAddress');

const defaultState = {
  balance: undefined,
  blocks: {},
  transactions: {},
  fetchingTransactions: false,
  receiveAddress,
  gettingNewAddress: false,
  sendingSupport: false,
  sendingTx: false,
};

reducers[ACTIONS.FETCH_TRANSACTIONS_STARTED] = state =>
  Object.assign({}, state, {
    fetchingTransactions: true,
  });

reducers[ACTIONS.FETCH_TRANSACTIONS_COMPLETED] = (state, action) => {
  const byId = Object.assign({}, state.transactions);

  const { transactions } = action.data;

  transactions.forEach(transaction => {
    byId[transaction.txid] = transaction;
  });

  return Object.assign({}, state, {
    transactions: byId,
    fetchingTransactions: false,
  });
};

reducers[ACTIONS.GET_NEW_ADDRESS_STARTED] = state =>
  Object.assign({}, state, {
    gettingNewAddress: true,
  });

reducers[ACTIONS.GET_NEW_ADDRESS_COMPLETED] = (state, action) => {
  const { address } = action.data;

  localStorage.setItem('receiveAddress', address);
  return Object.assign({}, state, {
    gettingNewAddress: false,
    receiveAddress: address,
  });
};

reducers[ACTIONS.UPDATE_BALANCE] = (state, action) =>
  Object.assign({}, state, {
    balance: action.data.balance,
  });

reducers[ACTIONS.CHECK_ADDRESS_IS_MINE_STARTED] = state =>
  Object.assign({}, state, {
    checkingAddressOwnership: true,
  });

reducers[ACTIONS.CHECK_ADDRESS_IS_MINE_COMPLETED] = state =>
  Object.assign({}, state, {
    checkingAddressOwnership: false,
  });

reducers[ACTIONS.SEND_TRANSACTION_STARTED] = state => {
  return Object.assign({}, state, {
    sendingTx: true,
  });
};

reducers[ACTIONS.SEND_TRANSACTION_COMPLETED] = state =>
  Object.assign({}, state, {
    sendingTx: false,
  });

reducers[ACTIONS.SEND_TRANSACTION_FAILED] = (state, action) => {
  return Object.assign({}, state, {
    sendingTx: false,
    error: action.data.error,
  });
};

reducers[ACTIONS.SUPPORT_TRANSACTION_STARTED] = state =>
  Object.assign({}, state, {
    sendingSupport: true,
  });

reducers[ACTIONS.SUPPORT_TRANSACTION_COMPLETED] = state =>
  Object.assign({}, state, {
    sendingSupport: false,
  });

reducers[ACTIONS.SUPPORT_TRANSACTION_FAILED] = (state, action) =>
  Object.assign({}, state, {
    error: action.data.error,
    sendingSupport: false,
  });

reducers[ACTIONS.FETCH_BLOCK_SUCCESS] = (state, action) => {
  const { block, block: { height } } = action.data;
  const blocks = Object.assign({}, state.blocks);

  blocks[height] = block;

  return Object.assign({}, state, { blocks });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
