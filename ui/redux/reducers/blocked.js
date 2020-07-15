// @flow
import * as ACTIONS from 'constants/action_types';
import { ACTIONS as LBRY_REDUX_ACTIONS } from 'lbry-redux';
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
        newBlockedChannels = newBlockedChannels.filter(id => id !== uri);
      } else {
        newBlockedChannels.push(uri);
      }

      return {
        blockedChannels: newBlockedChannels,
      };
    },
    [LBRY_REDUX_ACTIONS.USER_STATE_POPULATE]: (
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
