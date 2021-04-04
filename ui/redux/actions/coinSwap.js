// @flow
import * as ACTIONS from 'constants/action_types';
import { selectPrefsReady } from 'redux/selectors/sync';
import { doAlertWaitingForSync } from 'redux/actions/app';

export const doAddCoinSwap = (coinSwap: CoinSwapInfo) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.ADD_COIN_SWAP,
    data: {
      coin: coinSwap.coin,
      sendAddress: coinSwap.sendAddress,
      sendAmount: coinSwap.sendAmount,
      lbcAmount: coinSwap.lbcAmount,
    },
  });
};

export const doRemoveCoinSwap = (sendAddress: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.REMOVE_COIN_SWAP,
    data: {
      sendAddress,
    },
  });
};
