import lbry from "lbry";
import { selectBalance } from "selectors/wallet";
import { doOpenModal, doShowSnackBar } from "actions/app";
import * as types from "constants/action_types";
import * as modals from "constants/modal_types";

export function doShowTipBox() {
  return { type: types.SHOW_TIP_BOX };
}

export function doHideTipBox() {
  return { type: types.HIDE_TIP_BOX };
}

export function doSendSupport(amount, claim_id) {
  return function(dispatch, getState) {
    const state = getState();
    const balance = selectBalance(state);

    if (balance - amount <= 0) {
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
        dispatch(doHideTipBox);
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
        claim_id: claim_id,
        amount: amount,
      })
      .then(successCallback, errorCallback);
  };
}
