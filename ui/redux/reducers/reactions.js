// @flow
import { handleActions } from 'util/redux-utils';
import * as ACTIONS from 'constants/action_types';
import * as REACTION_TYPES from 'constants/reactions';

const defaultState = {
  fetchingReactions: false,
  reactionsError: undefined,
  reactionsById: {},
};

export default handleActions(
  {
    [ACTIONS.REACTIONS_LIST_STARTED]: state => ({ ...state, fetchingReactions: true }),
    [ACTIONS.REACTIONS_LIST_FAILED]: (state, action) => ({
      ...state,
      reactionsError: action.data,
    }),
    [ACTIONS.REACTIONS_LIST_COMPLETED]: (state, action) => {
      const { claimId, reactions } = action.data;

      const reactionsById = { ...state.reactionsById, [claimId]: reactions };
      return {
        ...state,
        fetchingreactions: false,
        reactionsById,
      };
    },
    [ACTIONS.REACTIONS_LIKE_COMPLETED]: (state, action) => {
      const { claimId, shouldRemove } = action.data;
      const reactionsById = { ...state.reactionsById };
      reactionsById[claimId].my_reactions[claimId][REACTION_TYPES.LIKE] = shouldRemove ? 0 : 1;
      reactionsById[claimId].my_reactions[claimId][REACTION_TYPES.DISLIKE] = 0;

      return {
        ...state,
        fetchingreactions: false,
        reactionsById,
      };
    },
    [ACTIONS.REACTIONS_DISLIKE_COMPLETED]: (state, action) => {
      const { claimId, shouldRemove } = action.data;
      const reactionsById = { ...state.reactionsById };
      reactionsById[claimId].my_reactions[claimId][REACTION_TYPES.DISLIKE] = shouldRemove ? 0 : 1;
      reactionsById[claimId].my_reactions[claimId][REACTION_TYPES.LIKE] = 0;

      return {
        ...state,
        fetchingreactions: false,
        reactionsById,
      };
    },
  },
  defaultState
);
