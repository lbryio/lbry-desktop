// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: BlocklistState = {
  blockedChannels: [],
};

export default handleActions(
  {
    [ACTIONS.TOGGLE_BLOCK_CHANNEL]: (state: BlocklistState, action: BlocklistAction): BlocklistState => {
      const { blockedChannels } = state;
      const { uri } = action.data;
      let newBlockedChannels = blockedChannels.slice();

      if (newBlockedChannels.includes(uri)) {
        newBlockedChannels = newBlockedChannels.filter((id) => id !== uri);
      } else {
        newBlockedChannels.unshift(uri);
      }

      return {
        blockedChannels: newBlockedChannels,
      };
    },
    [ACTIONS.USER_STATE_POPULATE]: (state: BlocklistState, action: { data: { blocked: ?Array<string> } }) => {
      const { blocked } = action.data;
      const sanitizedBlocked = blocked && blocked.filter((e) => typeof e === 'string');

      const next = sanitizedBlocked;
      const prev = state.blockedChannels;

      if (next && prev && prev.length === next.length && prev.every((value, index) => value === next[index])) {
        return state;
      }

      return {
        ...state,
        blockedChannels: sanitizedBlocked && sanitizedBlocked.length ? sanitizedBlocked : state.blockedChannels,
      };
    },
  },
  defaultState
);
