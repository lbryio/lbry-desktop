import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState = {
  loading: false,
  filteredOutpoints: undefined,
};

export const filteredReducer = handleActions(
  {
    [ACTIONS.FETCH_FILTERED_CONTENT_STARTED]: state => ({
      ...state,
      loading: true,
    }),
    [ACTIONS.FETCH_FILTERED_CONTENT_COMPLETED]: (state, action) => {
      const { outpoints } = action.data;
      return {
        ...state,
        loading: false,
        filteredOutpoints: outpoints,
      };
    },
    [ACTIONS.FETCH_FILTERED_CONTENT_FAILED]: (state, action) => {
      const { error } = action.data;

      return {
        ...state,
        loading: false,
        fetchingFilteredOutpointsError: error,
      };
    },
  },
  defaultState
);
