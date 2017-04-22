import * as types from 'constants/action_types'
import lbry from 'lbry'

export function doUpdateBalance(balance) {
  return {
    type: types.UPDATE_BALANCE,
    data: {
      balance: balance
    }
  }
}

export function doFetchTransactions() {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_TRANSACTIONS_STARTED
    })

    lbry.call('get_transaction_history', {}, (results) => {
      dispatch({
        type: types.FETCH_TRANSACTIONS_COMPLETED,
        data: {
          transactions: results
        }
      })
    })
  }
}

export function doGetNewAddress() {
  return function(dispatch, getState) {
    dispatch({
      type: types.GET_NEW_ADDRESS_STARTED
    })

    lbry.wallet_new_address().then(function(address) {
      localStorage.setItem('wallet_address', address);
      dispatch({
        type: types.GET_NEW_ADDRESS_COMPLETED,
        data: { address }
      })
    })
  }
}

export function doCheckAddressIsMine(address) {
  return function(dispatch, getState) {
    dispatch({
      type: types.CHECK_ADDRESS_IS_MINE_STARTED
    })

    lbry.checkAddressIsMine(address, (isMine) => {
      if (!isMine) dispatch(doGetNewAddress())

      dispatch({
        type: types.CHECK_ADDRESS_IS_MINE_COMPLETED
      })
    })
  }
}
