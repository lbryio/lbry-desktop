// @flow
import * as ACTIONS from 'constants/action_types';
import { selectPrefsReady } from 'redux/selectors/sync';
import { doAlertWaitingForSync } from 'redux/actions/app';
import { Lbryio } from 'lbryinc';

export const doAddCoinSwap = (coinSwapInfo: CoinSwapInfo) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.ADD_COIN_SWAP,
    data: coinSwapInfo,
  });
};

export const doRemoveCoinSwap = (chargeCode: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.REMOVE_COIN_SWAP,
    data: {
      chargeCode,
    },
  });
};

export const doQueryCoinSwapStatus = (chargeCode: string) => (dispatch: Dispatch, getState: GetState) => {
  Lbryio.call('btc', 'status', { charge_code: chargeCode }).then((response) => {
    dispatch({
      type: ACTIONS.COIN_SWAP_STATUS_RECEIVED,
      data: response,
    });
  });
};
