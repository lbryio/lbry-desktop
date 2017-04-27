import * as types from 'constants/action_types'
import lbry from 'lbry'
import {
  selectDraftTransaction,
  selectDraftTransactionAmount,
  selectBalance,
} from 'selectors/wallet'
import {
  doOpenModal,
} from 'actions/app'

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

export function doSendDraftTransaction() {
  return function(dispatch, getState) {
    const state = getState()
    const draftTx = selectDraftTransaction(state)
    const balance = selectBalance(state)
    const amount = selectDraftTransactionAmount(state)

    if (balance - amount < 1) {
      return dispatch(doOpenModal('insufficientBalance'))
    }

    dispatch({
      type: types.SEND_TRANSACTION_STARTED,
    })

    const successCallback = (results) => {
      if(results === true) {
        dispatch({
          type: types.SEND_TRANSACTION_COMPLETED,
        })
        dispatch(doOpenModal('transactionSuccessful'))
      }
      else {
        dispatch({
          type: types.SEND_TRANSACTION_FAILED,
          data: { error: results }
        })
        dispatch(doOpenModal('transactionFailed'))
      }
    }

    const errorCallback = (error) => {
      dispatch({
        type: types.SEND_TRANSACTION_FAILED,
        data: { error: error.message }
      })
      dispatch(doOpenModal('transactionFailed'))
    }

    lbry.sendToAddress(draftTx.amount, draftTx.address, successCallback, errorCallback);
  }
}

export function doSetDraftTransactionAmount(amount) {
  return {
    type: types.SET_DRAFT_TRANSACTION_AMOUNT,
    data: { amount }
  }
}

export function doSetDraftTransactionAddress(address) {
  return {
    type: types.SET_DRAFT_TRANSACTION_ADDRESS,
    data: { address }
  }
}
