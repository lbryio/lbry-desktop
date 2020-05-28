import { handleActions } from 'util/redux-utils';
import * as ACTIONS from 'constants/action_types';

const defaultState = {
  fetching: {},
  byUri: {},
};

export const costInfoReducer = handleActions(
  {
    [ACTIONS.FETCH_COST_INFO_STARTED]: (state, action) => {
      const { uri } = action.data;
      const newFetching = Object.assign({}, state.fetching);
      newFetching[uri] = true;

      return {
        ...state,
        fetching: newFetching,
      };
    },

    [ACTIONS.FETCH_COST_INFO_COMPLETED]: (state, action) => {
      const { uri, costInfo } = action.data;
      const newByUri = Object.assign({}, state.byUri);
      const newFetching = Object.assign({}, state.fetching);

      newByUri[uri] = costInfo;
      delete newFetching[uri];

      return {
        ...state,
        byUri: newByUri,
        fetching: newFetching,
      };
    },
  },
  defaultState
);
