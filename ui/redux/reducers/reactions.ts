import { handleActions } from "util/redux-utils";
import * as ACTIONS from "constants/action_types";
import * as REACTION_TYPES from "constants/reactions";

const defaultState = {
  fetchingReactions: false,
  reactionsError: undefined,
  reactionsById: {},
} as const;

// Returns a copy of reactionsById with `changes` applied to my_reactions[claimId], without mutating
// the objects in the previous state (a shallow spread of reactionsById alone shares them).
function setMyReaction(reactionsById: Record<string, any>, claimId: string, changes: Record<string, number>) {
  const entry = reactionsById[claimId];
  return {
    ...reactionsById,
    [claimId]: {
      ...entry,
      my_reactions: {
        ...entry.my_reactions,
        [claimId]: { ...entry.my_reactions[claimId], ...changes },
      },
    },
  };
}

export default handleActions(
  {
    [ACTIONS.REACTIONS_LIST_STARTED]: (state) => ({ ...state, fetchingReactions: true }),
    [ACTIONS.REACTIONS_LIST_FAILED]: (state, action) => ({
      ...state,
      fetchingReactions: false,
      reactionsError: action.data,
    }),
    [ACTIONS.REACTIONS_LIST_COMPLETED]: (state, action) => {
      const { claimId, reactions } = action.data;

      const reactionsById = { ...state.reactionsById, [claimId]: reactions } as const;
      return {
        ...state,
        fetchingReactions: false,
        reactionsById,
      };
    },
    [ACTIONS.REACTIONS_LIKE_COMPLETED]: (state, action) => {
      const { claimId, shouldRemove } = action.data;
      return {
        ...state,
        reactionsById: setMyReaction(state.reactionsById, claimId, {
          [REACTION_TYPES.LIKE]: shouldRemove ? 0 : 1,
          [REACTION_TYPES.DISLIKE]: 0,
        }),
      };
    },
    [ACTIONS.REACTIONS_DISLIKE_COMPLETED]: (state, action) => {
      const { claimId, shouldRemove } = action.data;
      return {
        ...state,
        reactionsById: setMyReaction(state.reactionsById, claimId, {
          [REACTION_TYPES.DISLIKE]: shouldRemove ? 0 : 1,
          [REACTION_TYPES.LIKE]: 0,
        }),
      };
    },
  },
  defaultState
);
