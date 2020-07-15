// @flow
import * as ACTIONS from 'constants/action_types';

export const doToggleBlockChannel = (uri: string) => ({
  type: ACTIONS.TOGGLE_BLOCK_CHANNEL,
  data: {
    uri,
  },
});
