import { handleActions } from 'util/redux-utils';
import * as ACTIONS from 'constants/action_types';

const defaultState = {
  fetchingViewCount: false,
  viewCountError: undefined,
  viewCountById: {},
  fetchingSubCount: false,
  subCountError: undefined,
  subCountById: {},
  subCountLastFetchedById: {},
};

export const statsReducer = handleActions(
  {
    [ACTIONS.FETCH_VIEW_COUNT_STARTED]: (state) => ({ ...state, fetchingViewCount: true }),

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

    [ACTIONS.FETCH_SUB_COUNT_STARTED]: (state) => ({ ...state, fetchingSubCount: true }),

    [ACTIONS.FETCH_SUB_COUNT_FAILED]: (state, action) => ({
      ...state,
      subCountError: action.data,
    }),

    [ACTIONS.FETCH_SUB_COUNT_COMPLETED]: (state, action) => {
      const { claimIds, subCounts, fetchDate } = action.data;

      const subCountById = Object.assign({}, state.subCountById);
      const subCountLastFetchedById = Object.assign({}, state.subCountLastFetchedById);
      let dataChanged = false;

      if (claimIds.length === subCounts.length) {
        claimIds.forEach((claimId, index) => {
          if (subCountById[claimId] !== subCounts[index]) {
            subCountById[claimId] = subCounts[index];
            dataChanged = true;
          }
          subCountLastFetchedById[claimId] = fetchDate;
        });
      }

      const newState = {
        ...state,
        fetchingSubCount: false,
        subCountLastFetchedById,
      };

      if (dataChanged) {
        newState.subCountById = subCountById;
      }

      return newState;
    },
  },
  defaultState
);
