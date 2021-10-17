import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState = {
  fetchingBlackListedOutpoints: false,
  fetchingBlackListedOutpointsSucceed: undefined,
  blackListedOutpoints: undefined,
};

export const blacklistReducer = handleActions(
  {
    [ACTIONS.FETCH_BLACK_LISTED_CONTENT_STARTED]: state => ({
      ...state,
      fetchingBlackListedOutpoints: true,
    }),
    [ACTIONS.FETCH_BLACK_LISTED_CONTENT_COMPLETED]: (state, action) => {
      const { outpoints, success } = action.data;
      return {
        ...state,
        fetchingBlackListedOutpoints: false,
        fetchingBlackListedOutpointsSucceed: success,
        blackListedOutpoints: outpoints,
      };
    },
    [ACTIONS.FETCH_BLACK_LISTED_CONTENT_FAILED]: (state, action) => {
      const { error, success } = action.data;

      return {
        ...state,
        fetchingBlackListedOutpoints: false,
        fetchingBlackListedOutpointsSucceed: success,
        fetchingBlackListedOutpointsError: error,
      };
    },
  },
  defaultState
);
