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
  doSendToAddress,
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
  address: null,
  amount: 0.0,
})

const perform = (dispatch) => ({
  closeModal: () => dispatch(doCloseModal()),
  getNewAddress: () => dispatch(doGetNewAddress()),
  checkAddressIsMine: (address) => dispatch(doCheckAddressIsMine(address)),
  sendToAddress: () => dispatch(doSendToAddress()),
  setAmount: () => console.log('set amount'),
  setAddress: () => console.log('set address'),
})

export default connect(select, perform)(WalletPage)
