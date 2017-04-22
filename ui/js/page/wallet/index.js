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
} from 'actions/wallet'
import {
  selectCurrentPage,
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
})

const perform = (dispatch) => ({
  closeModal: () => dispatch(doCloseModal()),
  getNewAddress: () => dispatch(doGetNewAddress()),
  checkAddressIsMine: (address) => dispatch(doCheckAddressIsMine(address))
})

export default connect(select, perform)(WalletPage)
