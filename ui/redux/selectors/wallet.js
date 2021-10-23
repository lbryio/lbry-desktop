import { createSelector } from 'reselect';
import * as TRANSACTIONS from 'constants/transaction_types';
import { PAGE_SIZE, LATEST_PAGE_SIZE } from 'constants/transaction_list';
import { selectClaimIdsByUri } from 'redux/selectors/claims';
import parseData from 'util/parse-data';
export const selectState = (state) => state.wallet || {};

export const selectWalletState = selectState;

export const selectWalletIsEncrypted = (state) => selectState(state).walletIsEncrypted;
export const selectWalletEncryptPending = (state) => selectState(state).walletEncryptPending;
export const selectWalletEncryptSucceeded = (state) => selectState(state).walletEncryptSucceded;
export const selectPendingSupportTransactions = (state) => selectState(state).pendingSupportTransactions;
export const selectPendingOtherTransactions = (state) => selectState(state).pendingTxos;
export const selectAbandonClaimSupportError = (state) => selectState(state).abandonClaimSupportError;

export const makeSelectPendingAmountByUri = (uri) =>
  createSelector(selectClaimIdsByUri, selectPendingSupportTransactions, (claimIdsByUri, pendingSupports) => {
    const uriEntry = Object.entries(claimIdsByUri).find(([u, cid]) => u === uri);
    const claimId = uriEntry && uriEntry[1];
    const pendingSupport = claimId && pendingSupports[claimId];
    return pendingSupport ? pendingSupport.effective : undefined;
  });

export const selectWalletEncryptResult = (state) => selectState(state).walletEncryptResult;
export const selectWalletDecryptPending = (state) => selectState(state).walletDecryptPending;
export const selectWalletDecryptSucceeded = (state) => selectState(state).walletDecryptSucceded;
export const selectWalletDecryptResult = (state) => selectState(state).walletDecryptResult;
export const selectWalletUnlockPending = (state) => selectState(state).walletUnlockPending;
export const selectWalletUnlockSucceeded = (state) => selectState(state).walletUnlockSucceded;
export const selectWalletUnlockResult = (state) => selectState(state).walletUnlockResult;
export const selectWalletLockPending = (state) => selectState(state).walletLockPending;
export const selectWalletLockSucceeded = (state) => selectState(state).walletLockSucceded;
export const selectWalletLockResult = (state) => selectState(state).walletLockResult;
export const selectBalance = (state) => selectState(state).balance;
export const selectTotalBalance = (state) => selectState(state).totalBalance;
export const selectReservedBalance = (state) => selectState(state).reservedBalance;
export const selectClaimsBalance = (state) => selectState(state).claimsBalance;
export const selectSupportsBalance = (state) => selectState(state).supportsBalance;
export const selectTipsBalance = (state) => selectState(state).tipsBalance;

export const selectTransactionsById = createSelector(selectState, (state) => state.transactions || {});

export const selectSupportsByOutpoint = createSelector(selectState, (state) => state.supports || {});

export const selectTotalSupports = createSelector(selectSupportsByOutpoint, (byOutpoint) => {
  let total = parseFloat('0.0');

  Object.values(byOutpoint).forEach((support) => {
    const { amount } = support;
    total = amount ? total + parseFloat(amount) : total;
  });

  return total;
});

export const selectTransactionItems = createSelector(selectTransactionsById, (byId) => {
  const items = [];

  Object.keys(byId).forEach((txid) => {
    const tx = byId[txid];

    // ignore dust/fees
    // it is fee only txn if all infos are also empty
    if (
      Math.abs(tx.value) === Math.abs(tx.fee) &&
      tx.claim_info.length === 0 &&
      tx.support_info.length === 0 &&
      tx.update_info.length === 0 &&
      tx.abandon_info.length === 0
    ) {
      return;
    }

    const append = [];

    append.push(
      ...tx.claim_info.map((item) =>
        Object.assign({}, tx, item, {
          type: item.claim_name[0] === '@' ? TRANSACTIONS.CHANNEL : TRANSACTIONS.PUBLISH,
        })
      )
    );
    append.push(
      ...tx.support_info.map((item) =>
        Object.assign({}, tx, item, {
          type: !item.is_tip ? TRANSACTIONS.SUPPORT : TRANSACTIONS.TIP,
        })
      )
    );
    append.push(...tx.update_info.map((item) => Object.assign({}, tx, item, { type: TRANSACTIONS.UPDATE })));
    append.push(...tx.abandon_info.map((item) => Object.assign({}, tx, item, { type: TRANSACTIONS.ABANDON })));

    if (!append.length) {
      append.push(
        Object.assign({}, tx, {
          type: tx.value < 0 ? TRANSACTIONS.SPEND : TRANSACTIONS.RECEIVE,
        })
      );
    }

    items.push(
      ...append.map((item) => {
        // value on transaction, amount on outpoint
        // amount is always positive, but should match sign of value
        const balanceDelta = parseFloat(item.balance_delta);
        const value = parseFloat(item.value);
        const amount = balanceDelta || value;
        const fee = parseFloat(tx.fee);

        return {
          txid,
          timestamp: tx.timestamp,
          date: tx.timestamp ? new Date(Number(tx.timestamp) * 1000) : null,
          amount,
          fee,
          claim_id: item.claim_id,
          claim_name: item.claim_name,
          type: item.type || TRANSACTIONS.SPEND,
          nout: item.nout,
          confirmations: tx.confirmations,
        };
      })
    );
  });

  return items.sort((tx1, tx2) => {
    if (!tx1.timestamp && !tx2.timestamp) {
      return 0;
    } else if (!tx1.timestamp && tx2.timestamp) {
      return -1;
    } else if (tx1.timestamp && !tx2.timestamp) {
      return 1;
    }

    return tx2.timestamp - tx1.timestamp;
  });
});

export const selectRecentTransactions = createSelector(selectTransactionItems, (transactions) => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 7);
  return transactions.filter((transaction) => {
    if (!transaction.date) {
      return true; // pending transaction
    }

    return transaction.date > threshold;
  });
});

export const selectHasTransactions = createSelector(
  selectTransactionItems,
  (transactions) => transactions && transactions.length > 0
);

export const selectIsFetchingTransactions = (state) => selectState(state).fetchingTransactions;

/**
 * CSV of 'selectTransactionItems'.
 */
export const selectTransactionsFile = createSelector(selectTransactionItems, (transactions) => {
  if (!transactions || transactions.length === 0) {
    // No data.
    return undefined;
  }

  const parsed = parseData(transactions, 'csv');
  if (!parsed) {
    // Invalid data, or failed to parse.
    return null;
  }

  return parsed;
});

export const selectIsSendingSupport = (state) => selectState(state).sendingSupport;
export const selectReceiveAddress = (state) => selectState(state).receiveAddress;
export const selectGettingNewAddress = (state) => selectState(state).gettingNewAddress;
export const selectDraftTransaction = createSelector(selectState, (state) => state.draftTransaction || {});

export const selectDraftTransactionAmount = createSelector(selectDraftTransaction, (draft) => draft.amount);

export const selectDraftTransactionAddress = createSelector(selectDraftTransaction, (draft) => draft.address);

export const selectDraftTransactionError = createSelector(selectDraftTransaction, (draft) => draft.error);

export const selectBlocks = (state) => selectState(state).blocks;
export const selectCurrentHeight = (state) => selectState(state).latestBlock;

export const selectTransactionListFilter = createSelector(selectState, (state) => state.transactionListFilter || '');

export const selectFilteredTransactions = createSelector(
  selectTransactionItems,
  selectTransactionListFilter,
  (transactions, filter) => {
    return transactions.filter((transaction) => {
      return filter === TRANSACTIONS.ALL || filter === transaction.type;
    });
  }
);

export const selectTxoPageParams = (state) => selectState(state).txoFetchParams;

export const selectTxoPage = createSelector(selectState, (state) => (state.txoPage && state.txoPage.items) || []);

export const selectTxoPageNumber = createSelector(selectState, (state) => (state.txoPage && state.txoPage.page) || 1);

export const selectTxoItemCount = createSelector(
  selectState,
  (state) => (state.txoPage && state.txoPage.total_items) || 1
);

export const selectFetchingTxosError = (state) => selectState(state).fetchingTxosError;
export const selectIsFetchingTxos = (state) => selectState(state).fetchingTxos;

export const makeSelectFilteredTransactionsForPage = (page = 1) =>
  createSelector(selectFilteredTransactions, (filteredTransactions) => {
    const start = (Number(page) - 1) * Number(PAGE_SIZE);
    const end = Number(page) * Number(PAGE_SIZE);
    return filteredTransactions && filteredTransactions.length ? filteredTransactions.slice(start, end) : [];
  });

export const makeSelectLatestTransactions = createSelector(selectTransactionItems, (transactions) => {
  return transactions && transactions.length ? transactions.slice(0, LATEST_PAGE_SIZE) : [];
});

export const selectFilteredTransactionCount = createSelector(
  selectFilteredTransactions,
  (filteredTransactions) => filteredTransactions.length
);

export const selectIsWalletReconnecting = (state) => selectState(state).walletReconnecting;
export const selectIsFetchingUtxoCounts = (state) => selectState(state).fetchingUtxoCounts;
export const selectIsConsolidatingUtxos = (state) => selectState(state).consolidatingUtxos;
export const selectIsMassClaimingTips = (state) => selectState(state).massClaimingTips;
export const selectPendingConsolidateTxid = (state) => selectState(state).pendingConsolidateTxid;
export const selectPendingMassClaimTxid = (state) => selectState(state).pendingMassClaimTxid;
export const selectUtxoCounts = (state) => selectState(state).utxoCounts;
