import { handleActions } from 'util/redux-utils';
import * as ACTIONS from 'constants/action_types';

const defaultState = {
  fetchingViewCount: false,
  viewCountError: undefined,
  viewCountById: {},
  fetchingSubCount: false,
  subCountError: undefined,
  subCountById: {},
};

export const statsReducer = handleActions(
  {
    [ACTIONS.FETCH_VIEW_COUNT_STARTED]: state => ({ ...state, fetchingViewCount: true }),
    [ACTIONS.FETCH_VIEW_COUNT_FAILED]: (state, action) => ({
      ...state,
      viewCountError: action.data,
    }),
    [ACTIONS.FETCH_VIEW_COUNT_COMPLETED]: (state, action) => {
      const { claimIdCsv, viewCounts } = action.data;

      const viewCountById = Object.assign({}, state.viewCountById);
      const claimIds = claimIdCsv.split(',');

      if (claimIds.length === viewCounts.length) {
        claimIds.forEach((claimId, index) => {
          viewCountById[claimId] = viewCounts[index];
        });
      }

      return {
        ...state,
        fetchingViewCount: false,
        viewCountById,
      };
    },
    [ACTIONS.FETCH_SUB_COUNT_STARTED]: state => ({ ...state, fetchingSubCount: true }),
    [ACTIONS.FETCH_SUB_COUNT_FAILED]: (state, action) => ({
      ...state,
      subCountError: action.data,
    }),
    [ACTIONS.FETCH_SUB_COUNT_COMPLETED]: (state, action) => {
      const { claimId, subCount } = action.data;

      const subCountById = { ...state.subCountById, [claimId]: subCount };
      return {
        ...state,
        fetchingSubCount: false,
        subCountById,
      };
    },
  },
  defaultState
);
