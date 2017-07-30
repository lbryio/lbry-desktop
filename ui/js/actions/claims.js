import * as types from "constants/action_types";
import lbry from "lbry";
import { selectClaimSupport, selectClaimSupportAmount } from "selectors/claims";
import { selectBalance } from "selectors/wallet";
import { doOpenModal } from "actions/app";

export function doClaimNewSupport() {
  return function(dispatch, getState) {
    const state = getState();
    const claimSupport = selectClaimSupport(state);
    const balance = selectBalance(state);
    const amount = selectClaimSupportAmount(state);

    if (balance - amount < 1) {
      return dispatch(doOpenModal("insufficientBalance"));
    }

    dispatch({
      type: types.CLAIM_SUPPORT_STARTED,
    });

    const successCallback = results => {
      // txid hash present indicates successful request
      if (results.txid && results.txid.length > 0) {
        dispatch({
          type: types.CLAIM_SUPPORT_COMPLETED,
        });
        dispatch(doOpenModal("transactionSuccessful"));
      } else {
        dispatch({
          type: types.CLAIM_SUPPORT_FAILED,
          data: { error: results },
        });
        dispatch(doOpenModal("transactionFailed"));
      }
    };

    const errorCallback = error => {
      dispatch({
        type: types.CLAIM_SUPPORT_FAILED,
        data: { error: error.message },
      });
      dispatch(doOpenModal("transactionFailed"));
    };

    lbry
      .claim_new_support({
        name: claimSupport.name,
        claim_id: claimSupport.claim_id,
        amount: claimSupport.amount,
      })
      .then(successCallback, errorCallback);
  };
}

export function doSetClaimSupportAmount(amount) {
  return {
    type: types.SET_CLAIM_SUPPORT_AMOUNT,
    data: { amount },
  };
}

export function doSetClaimSupportClaim(claim_id, name) {
  return {
    type: types.SET_CLAIM_SUPPORT_CLAIM,
    data: { claim_id, name },
  };
}
