import * as types from "constants/action_types";
import lbry from "lbry";
import {
  selectDraftTransaction,
  selectDraftTransactionAmount,
  selectBalance,
} from "redux/selectors/wallet";
import { doOpenModal, doShowSnackBar } from "redux/actions/app";
import { doNavigate } from "redux/actions/navigation";
import * as modals from "constants/modal_types";

export function doUpdateBalance() {
  return function(dispatch, getState) {
    lbry.wallet_balance().then(balance =>
      dispatch({
        type: types.UPDATE_BALANCE,
        data: {
          balance,
        },
      })
    );
  };
}

export function doBalanceSubscribe() {
  return function(dispatch, getState) {
    dispatch(doUpdateBalance());
    setInterval(() => dispatch(doUpdateBalance()), 5000);
  };
}

export function doFetchTransactions(fetch_tip_info = true) {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_TRANSACTIONS_STARTED,
    });

    lbry
      .transaction_list({ include_tip_info: fetch_tip_info })
      .then(results => {
        dispatch({
          type: types.FETCH_TRANSACTIONS_COMPLETED,
          data: {
            transactions: results,
          },
        });
      });
  };
}

export function doFetchBlock(height) {
  return function(dispatch, getState) {
    lbry.block_show({ height }).then(block => {
      dispatch({
        type: types.FETCH_BLOCK_SUCCESS,
        data: { block },
      });
    });
  };
}

export function doGetNewAddress() {
  return function(dispatch, getState) {
    dispatch({
      type: types.GET_NEW_ADDRESS_STARTED,
    });

    lbry.wallet_new_address().then(address => {
      localStorage.setItem("wallet_address", address);
      dispatch({
        type: types.GET_NEW_ADDRESS_COMPLETED,
        data: { address },
      });
    });
  };
}

export function doCheckAddressIsMine(address) {
  return function(dispatch, getState) {
    dispatch({
      type: types.CHECK_ADDRESS_IS_MINE_STARTED,
    });

    lbry.wallet_is_address_mine({ address }).then(isMine => {
      if (!isMine) dispatch(doGetNewAddress());

      dispatch({
        type: types.CHECK_ADDRESS_IS_MINE_COMPLETED,
      });
    });
  };
}

export function doSendDraftTransaction() {
  return function(dispatch, getState) {
    const state = getState();
    const draftTx = selectDraftTransaction(state);
    const balance = selectBalance(state);
    const amount = selectDraftTransactionAmount(state);

    if (balance - amount <= 0) {
      return dispatch(doOpenModal(modals.INSUFFICIENT_CREDITS));
    }

    dispatch({
      type: types.SEND_TRANSACTION_STARTED,
    });

    const successCallback = results => {
      if (results === true) {
        dispatch({
          type: types.SEND_TRANSACTION_COMPLETED,
        });
        dispatch(
          doShowSnackBar({
            message: __(`You sent ${amount} LBC`),
            linkText: __("History"),
            linkTarget: __("/wallet"),
          })
        );
      } else {
        dispatch({
          type: types.SEND_TRANSACTION_FAILED,
          data: { error: results },
        });
        dispatch(doOpenModal(modals.TRANSACTION_FAILED));
      }
    };

    const errorCallback = error => {
      dispatch({
        type: types.SEND_TRANSACTION_FAILED,
        data: { error: error.message },
      });
      dispatch(doOpenModal(modals.TRANSACTION_FAILED));
    };

    lbry
      .wallet_send({
        amount: draftTx.amount,
        address: draftTx.address,
      })
      .then(successCallback, errorCallback);
  };
}

export function doSetDraftTransactionAmount(amount) {
  return {
    type: types.SET_DRAFT_TRANSACTION_AMOUNT,
    data: { amount },
  };
}

export function doSetDraftTransactionAddress(address) {
  return {
    type: types.SET_DRAFT_TRANSACTION_ADDRESS,
    data: { address },
  };
}

export function doSendSupport(amount, claim_id, uri) {
  return function(dispatch, getState) {
    const state = getState();
    const balance = selectBalance(state);

    if (balance - amount <= 0) {
      return dispatch(doOpenModal(modals.INSUFFICIENT_CREDITS));
    }

    dispatch({
      type: types.SUPPORT_TRANSACTION_STARTED,
    });

    const successCallback = results => {
      if (results.txid) {
        dispatch({
          type: types.SUPPORT_TRANSACTION_COMPLETED,
        });
        dispatch(
          doShowSnackBar({
            message: __(`You sent ${amount} LBC as support, Mahalo!`),
            linkText: __("History"),
            linkTarget: __("/wallet"),
          })
        );
        dispatch(doNavigate("/show", { uri }));
      } else {
        dispatch({
          type: types.SUPPORT_TRANSACTION_FAILED,
          data: { error: results.code },
        });
        dispatch(doOpenModal(modals.TRANSACTION_FAILED));
      }
    };

    const errorCallback = error => {
      dispatch({
        type: types.SUPPORT_TRANSACTION_FAILED,
        data: { error: error.code },
      });
      dispatch(doOpenModal(modals.TRANSACTION_FAILED));
    };

    lbry
      .wallet_send({
        claim_id,
        amount,
      })
      .then(successCallback, errorCallback);
  };
}
