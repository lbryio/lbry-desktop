// @flow
import { selectPrefsReady } from 'redux/selectors/sync';
import * as ACTIONS from 'constants/action_types';

import { doAlertWaitingForSync } from 'redux/actions/app';

export const doToggleTagFollowDesktop = (name: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const ready = selectPrefsReady(state);
  if (!ready) {
    return dispatch(doAlertWaitingForSync());
  }

  dispatch({
    type: ACTIONS.TOGGLE_TAG_FOLLOW,
    data: {
      name,
    },
  });
};

export const doAddTag = (name: string) => ({
  type: ACTIONS.TAG_ADD,
  data: {
    name,
  },
});

export const doDeleteTag = (name: string) => ({
  type: ACTIONS.TAG_DELETE,
  data: {
    name,
  },
});
