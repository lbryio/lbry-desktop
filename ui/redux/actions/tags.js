// @flow
import { selectFollowedTagsList } from 'redux/selectors/tags';
import { selectPrefsReady } from 'redux/selectors/sync';
import * as ACTIONS from 'constants/action_types';

import analytics from 'analytics';
import { doAlertWaitingForSync } from 'redux/actions/app';

export const doToggleTagFollowDesktop = (name: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const tags = selectFollowedTagsList(state);
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

  const stringOfTags = tags.join(',');
  if (stringOfTags) {
    analytics.apiSyncTags({ content_tags: stringOfTags });
  }
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
