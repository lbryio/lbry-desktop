import { createSelector } from "reselect";

export const _selectState = state => state.wallet || {};

export const selectBalance = createSelector(
  _selectState,
  state => state.balance
);

export const selectTransactionsById = createSelector(
  _selectState,
  state => state.transactions
);

export const selectTransactionItems = createSelector(
  selectTransactionsById,
  byId => {
    const items = [];

    Object.keys(byId).forEach(txid => {
      const tx = byId[txid];

      //ignore dust/fees
      if (Math.abs(tx.amount) === Math.abs(tx.fee)) {
        return;
      }

      let append = [];

      append.push(
        ...tx.claim_info.map(item =>
          Object.assign({}, tx, item, {
            type: item.claim_name[0] === "@" ? "channel" : "publish",
          })
        )
      );
      append.push(
        ...tx.support_info.map(item =>
          Object.assign({}, tx, item, {
            type: !item.is_tip ? "support" : "tip",
          })
        )
      );
      append.push(
        ...tx.update_info.map(item =>
          Object.assign({}, tx, item, { type: "update" })
        )
      );

      if (!append.length) {
        append.push(
          Object.assign({}, tx, {
            type: tx.value < 0 ? "spend" : "receive",
          })
        );
      }

      items.push(
        ...append.map(item => {
          //value on transaction, amount on outpoint
          //amount is always positive, but should match sign of value
          const amount = parseFloat(
            item.amount ? (item.value < 0 ? -1 : 1) * item.amount : item.value
          );

          return {
            txid: txid,
            date: tx.timestamp ? new Date(parseInt(tx.timestamp) * 1000) : null,
            amount: amount,
            fee: amount < 0 ? -1 * tx.fee / append.length : 0,
            claim_id: item.claim_id,
            claim_name: item.claim_name,
            type: item.type || "send",
            nout: item.nout,
          };
        })
      );
    });
    return items.reverse();
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

export const selectIsSendingSupport = createSelector(
  _selectState,
  state => state.sendingSupport
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
