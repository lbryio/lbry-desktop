// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const buildDraftTransaction = () => ({
  amount: undefined,
  address: undefined,
});

// TODO: Split into common success and failure types
// See details in https://github.com/lbryio/lbry/issues/1307
type ActionResult = {
  type: any,
  result: any,
};

type WalletState = {
  balance: any,
  totalBalance: any,
  reservedBalance: any,
  claimsBalance: any,
  supportsBalance: any,
  tipsBalance: any,
  latestBlock: ?number,
  transactions: { [string]: Transaction },
  supports: { [string]: Support },
  abandoningSupportsByOutpoint: { [string]: boolean },
  fetchingTransactions: boolean,
  fetchingTransactionsError: string,
  gettingNewAddress: boolean,
  draftTransaction: any,
  sendingSupport: boolean,
  walletIsEncrypted: boolean,
  walletEncryptPending: boolean,
  walletEncryptSucceded: ?boolean,
  walletEncryptResult: ?boolean,
  walletDecryptPending: boolean,
  walletDecryptSucceded: ?boolean,
  walletDecryptResult: ?boolean,
  walletUnlockPending: boolean,
  walletUnlockSucceded: ?boolean,
  walletUnlockResult: ?boolean,
  walletLockPending: boolean,
  walletLockSucceded: ?boolean,
  walletLockResult: ?boolean,
  walletReconnecting: boolean,
  txoFetchParams: {},
  utxoCounts: {},
  txoPage: any,
  fetchId: string,
  fetchingTxos: boolean,
  fetchingTxosError?: string,
  consolidatingUtxos: boolean,
  pendingConsolidateTxid?: string,
  massClaimingTips: boolean,
  pendingMassClaimTxid?: string,
  pendingSupportTransactions: {}, // { claimId: {txid: 123, amount 12.3}, }
  pendingTxos: Array<string>,
  abandonClaimSupportError?: string,
};

const defaultState = {
  balance: undefined,
  totalBalance: undefined,
  reservedBalance: undefined,
  claimsBalance: undefined,
  supportsBalance: undefined,
  tipsBalance: undefined,
  latestBlock: undefined,
  transactions: {},
  fetchingTransactions: false,
  fetchingTransactionsError: undefined,
  supports: {},
  fetchingSupports: false,
  abandoningSupportsByOutpoint: {},
  gettingNewAddress: false,
  draftTransaction: buildDraftTransaction(),
  sendingSupport: false,
  walletIsEncrypted: false,
  walletEncryptPending: false,
  walletEncryptSucceded: null,
  walletEncryptResult: null,
  walletDecryptPending: false,
  walletDecryptSucceded: null,
  walletDecryptResult: null,
  walletUnlockPending: false,
  walletUnlockSucceded: null,
  walletUnlockResult: null,
  walletLockPending: false,
  walletLockSucceded: null,
  walletLockResult: null,
  transactionListFilter: 'all',
  walletReconnecting: false,
  txoFetchParams: {},
  utxoCounts: {},
  fetchingUtxoCounts: false,
  fetchingUtxoError: undefined,
  consolidatingUtxos: false,
  pendingConsolidateTxid: null,
  massClaimingTips: false,
  pendingMassClaimTxid: null,
  txoPage: {},
  fetchId: '',
  fetchingTxos: false,
  fetchingTxosError: undefined,
  pendingSupportTransactions: {},
  pendingTxos: [],

  abandonClaimSupportError: undefined,
};

export const walletReducer = handleActions(
  {
    [ACTIONS.FETCH_TRANSACTIONS_STARTED]: (state: WalletState) => ({
      ...state,
      fetchingTransactions: true,
    }),

    [ACTIONS.FETCH_TRANSACTIONS_COMPLETED]: (state: WalletState, action) => {
      const byId = { ...state.transactions };

      const { transactions } = action.data;
      transactions.forEach((transaction) => {
        byId[transaction.txid] = transaction;
      });

      return {
        ...state,
        transactions: byId,
        fetchingTransactions: false,
      };
    },

    [ACTIONS.FETCH_TXO_PAGE_STARTED]: (state: WalletState, action) => {
      return {
        ...state,
        fetchId: action.data,
        fetchingTxos: true,
        fetchingTxosError: undefined,
      };
    },

    [ACTIONS.FETCH_TXO_PAGE_COMPLETED]: (state: WalletState, action) => {
      if (state.fetchId !== action.data.fetchId) {
        // Leave 'state' and 'fetchingTxos' alone. The latter would ensure
        // the spiner would continue spinning for the latest transaction.
        return { ...state };
      }

      return {
        ...state,
        txoPage: action.data.result,
        fetchId: '',
        fetchingTxos: false,
      };
    },

    [ACTIONS.FETCH_TXO_PAGE_FAILED]: (state: WalletState, action) => {
      return {
        ...state,
        txoPage: {},
        fetchId: '',
        fetchingTxos: false,
        fetchingTxosError: action.data,
      };
    },
    [ACTIONS.FETCH_UTXO_COUNT_STARTED]: (state: WalletState) => {
      return {
        ...state,
        fetchingUtxoCounts: true,
        fetchingUtxoError: undefined,
      };
    },

    [ACTIONS.FETCH_UTXO_COUNT_COMPLETED]: (state: WalletState, action) => {
      return {
        ...state,
        utxoCounts: action.data,
        fetchingUtxoCounts: false,
      };
    },
    [ACTIONS.FETCH_UTXO_COUNT_FAILED]: (state: WalletState, action) => {
      return {
        ...state,
        utxoCounts: {},
        fetchingUtxoCounts: false,
        fetchingUtxoError: action.data,
      };
    },
    [ACTIONS.DO_UTXO_CONSOLIDATE_STARTED]: (state: WalletState) => {
      return {
        ...state,
        consolidatingUtxos: true,
      };
    },

    [ACTIONS.DO_UTXO_CONSOLIDATE_COMPLETED]: (state: WalletState, action) => {
      const { txid } = action.data;
      return {
        ...state,
        consolidatingUtxos: false,
        pendingConsolidateTxid: txid,
      };
    },

    [ACTIONS.DO_UTXO_CONSOLIDATE_FAILED]: (state: WalletState, action) => {
      return {
        ...state,
        consolidatingUtxos: false,
      };
    },

    [ACTIONS.TIP_CLAIM_MASS_STARTED]: (state: WalletState) => {
      return {
        ...state,
        massClaimingTips: true,
      };
    },

    [ACTIONS.TIP_CLAIM_MASS_COMPLETED]: (state: WalletState, action) => {
      const { txid } = action.data;
      return {
        ...state,
        massClaimingTips: false,
        pendingMassClaimTxid: txid,
      };
    },

    [ACTIONS.TIP_CLAIM_MASS_FAILED]: (state: WalletState, action) => {
      return {
        ...state,
        massClaimingTips: false,
      };
    },

    [ACTIONS.PENDING_CONSOLIDATED_TXOS_UPDATED]: (state: WalletState, action) => {
      const { pendingTxos, pendingMassClaimTxid, pendingConsolidateTxid } = state;

      const { txids, remove } = action.data;

      if (remove) {
        const newTxos = pendingTxos.filter((txo) => !txids.includes(txo));
        const newPendingMassClaimTxid = txids.includes(pendingMassClaimTxid) ? undefined : pendingMassClaimTxid;
        const newPendingConsolidateTxid = txids.includes(pendingConsolidateTxid) ? undefined : pendingConsolidateTxid;
        return {
          ...state,
          pendingTxos: newTxos,
          pendingMassClaimTxid: newPendingMassClaimTxid,
          pendingConsolidateTxid: newPendingConsolidateTxid,
        };
      } else {
        const newPendingSet = new Set([...pendingTxos, ...txids]);
        return { ...state, pendingTxos: Array.from(newPendingSet) };
      }
    },

    [ACTIONS.UPDATE_TXO_FETCH_PARAMS]: (state: WalletState, action) => {
      return {
        ...state,
        txoFetchParams: action.data,
      };
    },

    [ACTIONS.FETCH_SUPPORTS_STARTED]: (state: WalletState) => ({
      ...state,
      fetchingSupports: true,
    }),

    [ACTIONS.FETCH_SUPPORTS_COMPLETED]: (state: WalletState, action) => {
      const byOutpoint = state.supports;
      const { supports } = action.data;

      supports.forEach((transaction) => {
        const { txid, nout } = transaction;
        byOutpoint[`${txid}:${nout}`] = transaction;
      });

      return { ...state, supports: byOutpoint, fetchingSupports: false };
    },

    [ACTIONS.ABANDON_SUPPORT_STARTED]: (state: WalletState, action: any): WalletState => {
      const { outpoint }: { outpoint: string } = action.data;
      const currentlyAbandoning = state.abandoningSupportsByOutpoint;

      currentlyAbandoning[outpoint] = true;

      return {
        ...state,
        abandoningSupportsByOutpoint: currentlyAbandoning,
      };
    },

    [ACTIONS.ABANDON_SUPPORT_COMPLETED]: (state: WalletState, action: any): WalletState => {
      const { outpoint }: { outpoint: string } = action.data;
      const byOutpoint = state.supports;
      const currentlyAbandoning = state.abandoningSupportsByOutpoint;

      delete currentlyAbandoning[outpoint];
      delete byOutpoint[outpoint];

      return {
        ...state,
        supports: byOutpoint,
        abandoningSupportsByOutpoint: currentlyAbandoning,
      };
    },

    [ACTIONS.ABANDON_CLAIM_SUPPORT_STARTED]: (state: WalletState, action: any): WalletState => {
      return {
        ...state,
        abandonClaimSupportError: undefined,
      };
    },

    [ACTIONS.ABANDON_CLAIM_SUPPORT_PREVIEW]: (state: WalletState, action: any): WalletState => {
      return {
        ...state,
        abandonClaimSupportError: undefined,
      };
    },

    [ACTIONS.ABANDON_CLAIM_SUPPORT_COMPLETED]: (state: WalletState, action: any): WalletState => {
      const {
        claimId,
        type,
        txid,
        effective,
      }: { claimId: string, type: string, txid: string, effective: string } = action.data;
      const pendingtxs = Object.assign({}, state.pendingSupportTransactions);

      pendingtxs[claimId] = { txid, type, effective };

      return {
        ...state,
        pendingSupportTransactions: pendingtxs,
        abandonClaimSupportError: undefined,
      };
    },

    [ACTIONS.ABANDON_CLAIM_SUPPORT_FAILED]: (state: WalletState, action: any): WalletState => {
      return {
        ...state,
        abandonClaimSupportError: action.data,
      };
    },

    [ACTIONS.PENDING_SUPPORTS_UPDATED]: (state: WalletState, action: any): WalletState => {
      return {
        ...state,
        pendingSupportTransactions: action.data,
      };
    },

    [ACTIONS.GET_NEW_ADDRESS_STARTED]: (state: WalletState) => ({
      ...state,
      gettingNewAddress: true,
    }),

    [ACTIONS.GET_NEW_ADDRESS_COMPLETED]: (state: WalletState, action) => {
      const { address } = action.data;

      return { ...state, gettingNewAddress: false, receiveAddress: address };
    },

    [ACTIONS.UPDATE_BALANCE]: (state: WalletState, action) => ({
      ...state,
      totalBalance: action.data.totalBalance,
      balance: action.data.balance,
      reservedBalance: action.data.reservedBalance,
      claimsBalance: action.data.claimsBalance,
      supportsBalance: action.data.supportsBalance,
      tipsBalance: action.data.tipsBalance,
    }),

    [ACTIONS.CHECK_ADDRESS_IS_MINE_STARTED]: (state: WalletState) => ({
      ...state,
      checkingAddressOwnership: true,
    }),

    [ACTIONS.CHECK_ADDRESS_IS_MINE_COMPLETED]: (state: WalletState) => ({
      ...state,
      checkingAddressOwnership: false,
    }),

    [ACTIONS.SET_DRAFT_TRANSACTION_AMOUNT]: (state: WalletState, action) => {
      const oldDraft = state.draftTransaction;
      const newDraft = { ...oldDraft, amount: parseFloat(action.data.amount) };

      return { ...state, draftTransaction: newDraft };
    },

    [ACTIONS.SET_DRAFT_TRANSACTION_ADDRESS]: (state: WalletState, action) => {
      const oldDraft = state.draftTransaction;
      const newDraft = { ...oldDraft, address: action.data.address };

      return { ...state, draftTransaction: newDraft };
    },

    [ACTIONS.SEND_TRANSACTION_STARTED]: (state: WalletState) => {
      const newDraftTransaction = { ...state.draftTransaction, sending: true };

      return { ...state, draftTransaction: newDraftTransaction };
    },

    [ACTIONS.SEND_TRANSACTION_COMPLETED]: (state: WalletState) =>
      Object.assign({}, state, {
        draftTransaction: buildDraftTransaction(),
      }),

    [ACTIONS.SEND_TRANSACTION_FAILED]: (state: WalletState, action) => {
      const newDraftTransaction = Object.assign({}, state.draftTransaction, {
        sending: false,
        error: action.data.error,
      });

      return { ...state, draftTransaction: newDraftTransaction };
    },

    [ACTIONS.SUPPORT_TRANSACTION_STARTED]: (state: WalletState) => ({
      ...state,
      sendingSupport: true,
    }),

    [ACTIONS.SUPPORT_TRANSACTION_COMPLETED]: (state: WalletState) => ({
      ...state,
      sendingSupport: false,
    }),

    [ACTIONS.SUPPORT_TRANSACTION_FAILED]: (state: WalletState, action) => ({
      ...state,
      error: action.data.error,
      sendingSupport: false,
    }),

    [ACTIONS.CLEAR_SUPPORT_TRANSACTION]: (state: WalletState) => ({
      ...state,
      sendingSupport: false,
    }),

    [ACTIONS.WALLET_STATUS_COMPLETED]: (state: WalletState, action) => ({
      ...state,
      walletIsEncrypted: action.result,
    }),

    [ACTIONS.WALLET_ENCRYPT_START]: (state: WalletState) => ({
      ...state,
      walletEncryptPending: true,
      walletEncryptSucceded: null,
      walletEncryptResult: null,
    }),

    [ACTIONS.WALLET_ENCRYPT_COMPLETED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletEncryptPending: false,
      walletEncryptSucceded: true,
      walletEncryptResult: action.result,
    }),

    [ACTIONS.WALLET_ENCRYPT_FAILED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletEncryptPending: false,
      walletEncryptSucceded: false,
      walletEncryptResult: action.result,
    }),

    [ACTIONS.WALLET_DECRYPT_START]: (state: WalletState) => ({
      ...state,
      walletDecryptPending: true,
      walletDecryptSucceded: null,
      walletDecryptResult: null,
    }),

    [ACTIONS.WALLET_DECRYPT_COMPLETED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletDecryptPending: false,
      walletDecryptSucceded: true,
      walletDecryptResult: action.result,
    }),

    [ACTIONS.WALLET_DECRYPT_FAILED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletDecryptPending: false,
      walletDecryptSucceded: false,
      walletDecryptResult: action.result,
    }),

    [ACTIONS.WALLET_UNLOCK_START]: (state: WalletState) => ({
      ...state,
      walletUnlockPending: true,
      walletUnlockSucceded: null,
      walletUnlockResult: null,
    }),

    [ACTIONS.WALLET_UNLOCK_COMPLETED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletUnlockPending: false,
      walletUnlockSucceded: true,
      walletUnlockResult: action.result,
    }),

    [ACTIONS.WALLET_UNLOCK_FAILED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletUnlockPending: false,
      walletUnlockSucceded: false,
      walletUnlockResult: action.result,
    }),

    [ACTIONS.WALLET_LOCK_START]: (state: WalletState) => ({
      ...state,
      walletLockPending: false,
      walletLockSucceded: null,
      walletLockResult: null,
    }),

    [ACTIONS.WALLET_LOCK_COMPLETED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletLockPending: false,
      walletLockSucceded: true,
      walletLockResult: action.result,
    }),

    [ACTIONS.WALLET_LOCK_FAILED]: (state: WalletState, action: ActionResult) => ({
      ...state,
      walletLockPending: false,
      walletLockSucceded: false,
      walletLockResult: action.result,
    }),

    [ACTIONS.SET_TRANSACTION_LIST_FILTER]: (state: WalletState, action: { data: string }) => ({
      ...state,
      transactionListFilter: action.data,
    }),

    [ACTIONS.UPDATE_CURRENT_HEIGHT]: (state: WalletState, action: { data: number }) => ({
      ...state,
      latestBlock: action.data,
    }),
    [ACTIONS.WALLET_RESTART]: (state: WalletState) => ({
      ...state,
      walletReconnecting: true,
    }),

    [ACTIONS.WALLET_RESTART_COMPLETED]: (state: WalletState) => ({
      ...state,
      walletReconnecting: false,
    }),
  },
  defaultState
);
