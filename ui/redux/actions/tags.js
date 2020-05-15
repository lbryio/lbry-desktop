// @flow
import { doToggleTagFollow, selectFollowedTagsList } from 'lbry-redux';

import analytics from 'analytics';

export const doToggleTagFollowDesktop = (name: string) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(doToggleTagFollow(name));

  const state = getState();
  const tags = selectFollowedTagsList(state);
  const stringOfTags = tags.join(',');
  if (stringOfTags) {
    analytics.apiSyncTags({ content_tags: stringOfTags });
  }
};
