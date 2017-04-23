import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doCloseModal,
} from 'actions/app'
import {
  doGetNewAddress,
  doCheckAddressIsMine,
  doSendDraftTransaction,
  doSetDraftTransactionAmount,
  doSetDraftTransactionAddress,
} from 'actions/wallet'
import {
  selectCurrentPage,
  selectCurrentModal,
} from 'selectors/app'
import {
  selectBalance,
  selectTransactions,
  selectTransactionItems,
  selectIsFetchingTransactions,
  selectReceiveAddress,
  selectGettingNewAddress,
  selectDraftTransactionAmount,
  selectDraftTransactionAddress,
} from 'selectors/wallet'
import WalletPage from './view'

const select = (state) => ({
  currentPage: selectCurrentPage(state),
  balance: selectBalance(state),
  transactions: selectTransactions(state),
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactionItems: selectTransactionItems(state),
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
  modal: selectCurrentModal(state),
  address: selectDraftTransactionAddress(state),
  amount: selectDraftTransactionAmount(state),
})

const perform = (dispatch) => ({
  closeModal: () => dispatch(doCloseModal()),
  getNewAddress: () => dispatch(doGetNewAddress()),
  checkAddressIsMine: (address) => dispatch(doCheckAddressIsMine(address)),
  sendToAddress: () => dispatch(doSendDraftTransaction()),
  setAmount: (event) => dispatch(doSetDraftTransactionAmount(event.target.value)),
  setAddress: (event) => dispatch(doSetDraftTransactionAddress(event.target.value)),
})

export default connect(select, perform)(WalletPage)
