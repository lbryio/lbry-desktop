import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import Lbry from 'lbry';
import { doOpenModal, doShowSnackBar } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import {
  selectBalance,
  selectDraftTransaction,
  selectDraftTransactionAmount,
} from 'redux/selectors/wallet';

export function doUpdateBalance() {
  return dispatch => {
    Lbry.wallet_balance().then(balance =>
      dispatch({
        type: ACTIONS.UPDATE_BALANCE,
        data: {
          balance,
        },
      })
    );
  };
}

export function doBalanceSubscribe() {
  return dispatch => {
    dispatch(doUpdateBalance());
    setInterval(() => dispatch(doUpdateBalance()), 5000);
  };
}

export function doFetchTransactions() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_TRANSACTIONS_STARTED,
    });

    Lbry.transaction_list().then(results => {
      dispatch({
        type: ACTIONS.FETCH_TRANSACTIONS_COMPLETED,
        data: {
          transactions: results,
        },
      });
    });
  };
}

export function doFetchBlock(height) {
  return dispatch => {
    Lbry.block_show({ height }).then(block => {
      dispatch({
        type: ACTIONS.FETCH_BLOCK_SUCCESS,
        data: { block },
      });
    });
  };
}

export function doGetNewAddress() {
  return dispatch => {
    dispatch({
      type: ACTIONS.GET_NEW_ADDRESS_STARTED,
    });

    Lbry.wallet_new_address().then(address => {
      localStorage.setItem('wallet_address', address);
      dispatch({
        type: ACTIONS.GET_NEW_ADDRESS_COMPLETED,
        data: { address },
      });
    });
  };
}

export function doCheckAddressIsMine(address) {
  return dispatch => {
    dispatch({
      type: ACTIONS.CHECK_ADDRESS_IS_MINE_STARTED,
    });

    Lbry.wallet_is_address_mine({ address }).then(isMine => {
      if (!isMine) dispatch(doGetNewAddress());

      dispatch({
        type: ACTIONS.CHECK_ADDRESS_IS_MINE_COMPLETED,
      });
    });
  };
}

export function doSendDraftTransaction() {
  return (dispatch, getState) => {
    const state = getState();
    const draftTx = selectDraftTransaction(state);
    const balance = selectBalance(state);
    const amount = selectDraftTransactionAmount(state);

    if (balance - amount <= 0) {
      dispatch(doOpenModal(MODALS.INSUFFICIENT_CREDITS));
      return;
    }

    dispatch({
      type: ACTIONS.SEND_TRANSACTION_STARTED,
    });

    const successCallback = results => {
      if (results === true) {
        dispatch({
          type: ACTIONS.SEND_TRANSACTION_COMPLETED,
        });
        dispatch(
          doShowSnackBar({
            message: __(`You sent ${amount} LBC`),
            linkText: __('History'),
            linkTarget: __('/wallet'),
          })
        );
      } else {
        dispatch({
          type: ACTIONS.SEND_TRANSACTION_FAILED,
          data: { error: results },
        });
        dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
      }
    };

    const errorCallback = error => {
      dispatch({
        type: ACTIONS.SEND_TRANSACTION_FAILED,
        data: { error: error.message },
      });
      dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
    };

    Lbry.wallet_send({
      amount: draftTx.amount,
      address: draftTx.address,
    }).then(successCallback, errorCallback);
  };
}

export function doSetDraftTransactionAmount(amount) {
  return {
    type: ACTIONS.SET_DRAFT_TRANSACTION_AMOUNT,
    data: { amount },
  };
}

export function doSetDraftTransactionAddress(address) {
  return {
    type: ACTIONS.SET_DRAFT_TRANSACTION_ADDRESS,
    data: { address },
  };
}

export function doSendSupport(amount, claimId, uri) {
  return (dispatch, getState) => {
    const state = getState();
    const balance = selectBalance(state);

    if (balance - amount <= 0) {
      dispatch(doOpenModal(MODALS.INSUFFICIENT_CREDITS));
      return;
    }

    dispatch({
      type: ACTIONS.SUPPORT_TRANSACTION_STARTED,
    });

    const successCallback = results => {
      if (results.txid) {
        dispatch({
          type: ACTIONS.SUPPORT_TRANSACTION_COMPLETED,
        });
        dispatch(
          doShowSnackBar({
            message: __(`You sent ${amount} LBC as support, Mahalo!`),
            linkText: __('History'),
            linkTarget: __('/wallet'),
          })
        );
        dispatch(doNavigate('/show', { uri }));
      } else {
        dispatch({
          type: ACTIONS.SUPPORT_TRANSACTION_FAILED,
          data: { error: results.code },
        });
        dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
      }
    };

    const errorCallback = error => {
      dispatch({
        type: ACTIONS.SUPPORT_TRANSACTION_FAILED,
        data: { error: error.code },
      });
      dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
    };

    Lbry.wallet_send({
      claim_id: claimId,
      amount,
    }).then(successCallback, errorCallback);
  };
}
