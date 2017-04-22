import * as types from 'constants/action_types'

const reducers = {}
const address = sessionStorage.getItem('receiveAddress')
const defaultState = {
  balance: 0,
  transactions: [],
  fetchingTransactions: false,
  receiveAddress: address,
  gettingNewAddress: false,
}

reducers[types.FETCH_TRANSACTIONS_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetchingTransactions: true
  })
}

reducers[types.FETCH_TRANSACTIONS_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    transactions: action.data.transactions,
    fetchingTransactions: false
  })
}

reducers[types.GET_NEW_ADDRESS_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    gettingNewAddress: true
  })
}

reducers[types.GET_NEW_ADDRESS_COMPLETED] = function(state, action) {
  const { address } = action.data

  sessionStorage.setItem('receiveAddress', address)
  return Object.assign({}, state, {
    gettingNewAddress: false,
    receiveAddress: address
  })
}

reducers[types.UPDATE_BALANCE] = function(state, action) {
  return Object.assign({}, state, {
    balance: action.data.balance
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
