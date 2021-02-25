// @flow
import * as ACTIONS from 'constants/action_types';
import { selectPrefsReady } from 'redux/selectors/sync';
import { doAlertWaitingForSync } from 'redux/actions/app';

export const doToggleMuteChannel = (uri: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);

  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.TOGGLE_BLOCK_CHANNEL,
    data: {
      uri,
    },
  });
};
