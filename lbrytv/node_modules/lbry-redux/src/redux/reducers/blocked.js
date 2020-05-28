// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: BlocklistState = {
  blockedChannels: [],
};

export const blockedReducer = handleActions(
  {
    [ACTIONS.TOGGLE_BLOCK_CHANNEL]: (
      state: BlocklistState,
      action: BlocklistAction
    ): BlocklistState => {
      const { blockedChannels } = state;
      const { uri } = action.data;
      let newBlockedChannels = blockedChannels.slice();

      if (newBlockedChannels.includes(uri)) {
        newBlockedChannels = newBlockedChannels.filter(id => id !== uri);
      } else {
        newBlockedChannels.push(uri);
      }

      return {
        blockedChannels: newBlockedChannels,
      };
    },
    [ACTIONS.USER_STATE_POPULATE]: (
      state: BlocklistState,
      action: { data: { blocked: ?Array<string> } }
    ) => {
      const { blocked } = action.data;
      return {
        ...state,
        blockedChannels: blocked && blocked.length ? blocked : state.blockedChannels,
      };
    },
  },
  defaultState
);
