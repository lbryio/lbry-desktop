import { createSelector } from "reselect";
import { selectCurrentPage, selectDaemonReady } from "selectors/app";

export const _selectState = state => state.wallet || {};

export const selectBalance = createSelector(
  _selectState,
  state => state.balance || 0
);

export const selectTransactions = createSelector(
  _selectState,
  state => state.transactions || {}
);

export const selectTransactionsById = createSelector(
  selectTransactions,
  transactions => transactions.byId || {}
);

export const selectTransactionItems = createSelector(
  selectTransactionsById,
  byId => {
    const transactionItems = [];
    const txids = Object.keys(byId);
    txids.forEach(txid => {
      const tx = byId[txid];
      transactionItems.push({
        id: txid,
        date: tx.timestamp ? new Date(parseInt(tx.timestamp) * 1000) : null,
        amount: parseFloat(tx.value),
      });
    });
    return transactionItems.reverse();
  }
);

export const selectIsFetchingTransactions = createSelector(
  _selectState,
  state => state.fetchingTransactions
);

export const selectReceiveAddress = createSelector(
  _selectState,
  state => state.receiveAddress
);

export const selectGettingNewAddress = createSelector(
  _selectState,
  state => state.gettingNewAddress
);

export const selectDraftTransaction = createSelector(
  _selectState,
  state => state.draftTransaction || {}
);

export const selectDraftTransactionAmount = createSelector(
  selectDraftTransaction,
  draft => draft.amount
);

export const selectDraftTransactionAddress = createSelector(
  selectDraftTransaction,
  draft => draft.address
);
