import { createSelector } from 'reselect'
import {
  selectCurrentPage,
  selectDaemonReady,
} from 'selectors/app'

export const _selectState = state => state.wallet || {}

export const selectBalance = createSelector(
  _selectState,
  (state) => state.balance || 0
)

export const selectTransactions = createSelector(
  _selectState,
  (state) => state.transactions || {}
)

export const selectTransactionsById = createSelector(
  selectTransactions,
  (transactions) => transactions.byId || {}
)

export const selectTransactionItems = createSelector(
  selectTransactionsById,
  (byId) => {
    const transactionItems = []
    const txids = Object.keys(byId)
    txids.forEach((txid) => {
      const tx = byId[txid]
      transactionItems.push({
        id: txid,
        date: tx.timestamp ? (new Date(parseInt(tx.timestamp) * 1000)) : null,
        amount: parseFloat(tx.value)
      })
    })
    return transactionItems
  }
)

export const selectIsFetchingTransactions = createSelector(
  _selectState,
  (state) => state.fetchingTransactions
)

export const shouldFetchTransactions = createSelector(
  selectCurrentPage,
  selectTransactions,
  selectIsFetchingTransactions,
  (page, transactions, fetching) => {
    if (page != 'wallet') return false
    if (fetching) return false
    if (transactions.length != 0) return false

    return true
  }
)

export const selectReceiveAddress = createSelector(
  _selectState,
  (state) => state.receiveAddress
)

export const selectGettingNewAddress = createSelector(
  _selectState,
  (state) => state.gettingNewAddress
)

export const shouldGetReceiveAddress = createSelector(
  selectReceiveAddress,
  selectGettingNewAddress,
  selectDaemonReady,
  (address, fetching, daemonReady) => {
    if (!daemonReady) return false
    if (fetching) return false
    if (address) return false

    return true
  }
)

export const shouldCheckAddressIsMine = createSelector(
  _selectState,
  selectCurrentPage,
  selectReceiveAddress,
  selectDaemonReady,
  (state, page, address, daemonReady) => {
    if (!daemonReady) return false
    if (address === undefined) return false
    if (state.addressOwnershipChecked) return false

    return true
  }
)
