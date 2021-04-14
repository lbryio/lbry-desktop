// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';
import { SEARCH_OPTIONS, SEARCH_PAGE_SIZE } from 'constants/search';
import { createNormalizedSearchKey } from 'util/search';

const defaultState: SearchState = {
  // $FlowFixMe
  options: {
    [SEARCH_OPTIONS.RESULT_COUNT]: SEARCH_PAGE_SIZE,
    [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS,
    [SEARCH_OPTIONS.MEDIA_AUDIO]: true,
    [SEARCH_OPTIONS.MEDIA_VIDEO]: true,
    [SEARCH_OPTIONS.MEDIA_TEXT]: false,
    [SEARCH_OPTIONS.MEDIA_IMAGE]: false,
    [SEARCH_OPTIONS.MEDIA_APPLICATION]: false,
  },
  urisByQuery: {},
  hasReachedMaxResultsLength: {},
  searching: false,
};

export default handleActions(
  {
    [ACTIONS.SEARCH_START]: (state: SearchState): SearchState => ({
      ...state,
      searching: true,
    }),
    [ACTIONS.SEARCH_SUCCESS]: (state: SearchState, action: SearchSuccess): SearchState => {
      const { query, uris, from, size } = action.data;
      const normalizedQuery = createNormalizedSearchKey(query);

      let newUris = uris;
      if (from !== 0 && state.urisByQuery[normalizedQuery]) {
        newUris = Array.from(new Set(state.urisByQuery[normalizedQuery].concat(uris)));
      }

      // The returned number of urls is less than the page size, so we're on the last page
      const noMoreResults = size && uris.length < size;

      return {
        ...state,
        searching: false,
        urisByQuery: Object.assign({}, state.urisByQuery, { [normalizedQuery]: newUris }),
        hasReachedMaxResultsLength: Object.assign({}, state.hasReachedMaxResultsLength, {
          [normalizedQuery]: noMoreResults,
        }),
      };
    },

    [ACTIONS.SEARCH_FAIL]: (state: SearchState): SearchState => ({
      ...state,
      searching: false,
    }),

    [ACTIONS.UPDATE_SEARCH_OPTIONS]: (state: SearchState, action: UpdateSearchOptions): SearchState => {
      const { options: oldOptions } = state;
      const newOptions = action.data;
      const options = { ...oldOptions, ...newOptions };
      return {
        ...state,
        options,
      };
    },
  },
  defaultState
);
