// @flow
import * as ACTIONS from 'constants/action_types';
import { selectPrefsReady } from 'redux/selectors/sync';
import { doAlertWaitingForSync } from 'redux/actions/app';

export const doAddBtcAddress = (btcAddress: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.ADD_BTC_ADDRESS,
    data: {
      btcAddress,
    },
  });
};

export const doRemoveBtcAddress = (btcAddress: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.REMOVE_BTC_ADDRESS,
    data: {
      btcAddress,
    },
  });
};
