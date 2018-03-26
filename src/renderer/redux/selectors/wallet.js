import { createSelector } from 'reselect';

export const selectState = state => state.wallet || {};

export const selectBalance = createSelector(selectState, state => state.balance);

export const selectTransactionsById = createSelector(selectState, state => state.transactions);

export const selectTransactionItems = createSelector(selectTransactionsById, byId => {
  const items = [];

  Object.keys(byId).forEach(txid => {
    const tx = byId[txid];

    // ignore dust/fees
    // it is fee only txn if all infos are also empty
    if (
      Math.abs(tx.value) === Math.abs(tx.fee) &&
      tx.claim_info.length === 0 &&
      tx.support_info.length === 0 &&
      tx.update_info.length === 0
    ) {
      return;
    }

    const append = [];

    append.push(
      ...tx.claim_info.map(item =>
        Object.assign({}, tx, item, {
          type: item.claim_name[0] === '@' ? 'channel' : 'publish',
        })
      )
    );
    append.push(
      ...tx.support_info.map(item =>
        Object.assign({}, tx, item, {
          type: !item.is_tip ? 'support' : 'tip',
        })
      )
    );
    append.push(...tx.update_info.map(item => Object.assign({}, tx, item, { type: 'update' })));

    if (!append.length) {
      append.push(
        Object.assign({}, tx, {
          type: tx.value < 0 ? 'spend' : 'receive',
        })
      );
    }

    items.push(
      ...append.map(item => {
        // value on transaction, amount on outpoint
        // amount is always positive, but should match sign of value
        const amount = parseFloat(item.balance_delta ? item.balance_delta : item.value);

        return {
          txid,
          date: tx.timestamp ? new Date(Number(tx.timestamp) * 1000) : null,
          amount,
          fee: amount < 0 ? -1 * tx.fee / append.length : 0,
          claim_id: item.claim_id,
          claim_name: item.claim_name,
          type: item.type || 'send',
          nout: item.nout,
        };
      })
    );
  });
  return items.reverse();
});

export const selectRecentTransactions = createSelector(selectTransactionItems, transactions => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 7);
  return transactions.filter(transaction => transaction.date > threshold);
});

export const selectHasTransactions = createSelector(
  selectTransactionItems,
  transactions => transactions && transactions.length > 0
);

export const selectIsFetchingTransactions = createSelector(
  selectState,
  state => state.fetchingTransactions
);

export const selectIsSendingSupport = createSelector(selectState, state => state.sendingSupport);

export const selectReceiveAddress = createSelector(selectState, state => state.receiveAddress);

export const selectGettingNewAddress = createSelector(
  selectState,
  state => state.gettingNewAddress
);

export const selectBlocks = createSelector(selectState, state => state.blocks);

export const makeSelectBlockDate = block =>
  createSelector(
    selectBlocks,
    blocks => (blocks && blocks[block] ? new Date(blocks[block].time * 1000) : undefined)
  );
