import { createSelector } from "reselect";

export const _selectState = state => state.wallet || {};

export const selectBalance = createSelector(
  _selectState,
  state => state.balance
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
        claim_info: tx.claim_info,
        support_info: tx.support_info,
        update_info: tx.update_info,
        fee: tx.fee,
      });
    });
    return transactionItems.reverse();
  }
);

export const selectRecentTransactions = createSelector(
  selectTransactionItems,
  transactions => {
    let threshold = new Date();
    threshold.setDate(threshold.getDate() - 7);
    return transactions.filter(transaction => {
      return transaction.date > threshold;
    });
  }
);

export const selectHasTransactions = createSelector(
  selectTransactionItems,
  transactions => {
    return transactions && transactions.length > 0;
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

export const selectDraftTransactionError = createSelector(
  selectDraftTransaction,
  draft => draft.error
);

export const selectBlocks = createSelector(_selectState, state => state.blocks);

export const makeSelectBlockDate = block => {
  return createSelector(
    selectBlocks,
    blocks =>
      blocks && blocks[block] ? new Date(blocks[block].time * 1000) : undefined
  );
};
