import lbry from "lbry";
import { selectBalance } from "selectors/wallet";
import {
  selectSupportTransaction,
  selectSupportTransactionAmount,
} from "selectors/claims";
import { doOpenModal, doShowSnackBar } from "actions/app";
import * as types from "constants/action_types";
import * as modals from "constants/modal_types";

export function doSendSupport() {
  return function(dispatch, getState) {
    const state = getState();
    const supportTx = selectSupportTransaction(state);
    const balance = selectBalance(state);
    const amount = selectSupportTransactionAmount(state);

    if (balance - amount < 1) {
      return dispatch(doOpenModal(modals.INSUFFICIENT_BALANCE));
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
      } else {
        dispatch({
          type: types.SUPPORT_TRANSACTION_FAILED,
          data: { error: results },
        });
        dispatch(doOpenModal(modals.TRANSACTION_FAILED));
      }
    };

    const errorCallback = error => {
      dispatch({
        type: types.SUPPORT_TRANSACTION_FAILED,
        data: { error: error.message },
      });
      dispatch(doOpenModal(modals.TRANSACTION_FAILED));
    };

    lbry
      .claim_send_tip({
        claim_id: supportTx.claim_id,
        amount: supportTx.amount,
      })
      .then(successCallback, errorCallback);
  };
}

export function doSetSupportAmount(amount) {
  return {
    type: types.SET_SUPPORT_AMOUNT,
    data: { amount },
  };
}

export function doSetSupportClaimID(claim_id) {
  return {
    type: types.SET_SUPPORT_CLAIMID,
    data: { claim_id },
  };
}
