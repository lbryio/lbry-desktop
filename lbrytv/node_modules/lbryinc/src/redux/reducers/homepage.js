import { handleActions } from 'util/redux-utils';
import * as ACTIONS from 'constants/action_types';

const defaultState = {
  fetchingFeaturedContent: false,
  fetchingFeaturedContentFailed: false,
  featuredUris: undefined,
  fetchingTrendingContent: false,
  fetchingTrendingContentFailed: false,
  trendingUris: undefined,
};

export const homepageReducer = handleActions(
  {
    [ACTIONS.FETCH_FEATURED_CONTENT_STARTED]: state => ({
      ...state,
      fetchingFeaturedContent: true,
    }),

    [ACTIONS.FETCH_FEATURED_CONTENT_COMPLETED]: (state, action) => {
      const { uris, success } = action.data;

      return {
        ...state,
        fetchingFeaturedContent: false,
        fetchingFeaturedContentFailed: !success,
        featuredUris: uris,
      };
    },

    [ACTIONS.FETCH_TRENDING_CONTENT_STARTED]: state => ({
      ...state,
      fetchingTrendingContent: true,
    }),

    [ACTIONS.FETCH_TRENDING_CONTENT_COMPLETED]: (state, action) => {
      const { uris, success } = action.data;

      return {
        ...state,
        fetchingTrendingContent: false,
        fetchingTrendingContentFailed: !success,
        trendingUris: uris,
      };
    },
  },
  defaultState
);
