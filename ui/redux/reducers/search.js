// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';
import { SEARCH_OPTIONS } from 'constants/search';

const defaultState = {
  isActive: false, // does the user have any typed text in the search input
  focused: false, // is the search input focused
  searchQuery: '', // needs to be an empty string for input focusing
  options: {
    [SEARCH_OPTIONS.RESULT_COUNT]: 50,
    [SEARCH_OPTIONS.CLAIM_TYPE]: 'file,channel',
    [SEARCH_OPTIONS.MEDIA_AUDIO]: false,
    [SEARCH_OPTIONS.MEDIA_VIDEO]: true,
    [SEARCH_OPTIONS.MEDIA_TEXT]: false,
    [SEARCH_OPTIONS.MEDIA_IMAGE]: false,
    [SEARCH_OPTIONS.MEDIA_APPLICATION]: false,
  },
  suggestions: {},
  urisByQuery: {},
  resolvedResultsByQuery: {},
  resolvedResultsByQueryLastPageReached: {},
};

export default handleActions(
  {
    [ACTIONS.SEARCH_START]: (state: SearchState): SearchState => ({
      ...state,
      searching: true,
    }),
    [ACTIONS.SEARCH_SUCCESS]: (state: SearchState, action: SearchSuccess): SearchState => {
      const { query, uris } = action.data;

      return {
        ...state,
        searching: false,
        urisByQuery: Object.assign({}, state.urisByQuery, { [query]: uris }),
      };
    },

    [ACTIONS.SEARCH_FAIL]: (state: SearchState): SearchState => ({
      ...state,
      searching: false,
    }),

    [ACTIONS.RESOLVED_SEARCH_START]: (state: SearchState): SearchState => ({
      ...state,
      searching: true,
    }),
    [ACTIONS.RESOLVED_SEARCH_SUCCESS]: (state: SearchState, action: ResolvedSearchSuccess): SearchState => {
      const resolvedResultsByQuery = Object.assign({}, state.resolvedResultsByQuery);
      const resolvedResultsByQueryLastPageReached = Object.assign({}, state.resolvedResultsByQueryLastPageReached);
      const { append, query, results, pageSize } = action.data;

      if (append) {
        // todo: check for duplicates when concatenating?
        resolvedResultsByQuery[query] =
          resolvedResultsByQuery[query] && resolvedResultsByQuery[query].length
            ? resolvedResultsByQuery[query].concat(results)
            : results;
      } else {
        resolvedResultsByQuery[query] = results;
      }

      // the returned number of urls is less than the page size, so we're on the last page
      resolvedResultsByQueryLastPageReached[query] = results.length < pageSize;

      return {
        ...state,
        searching: false,
        resolvedResultsByQuery,
        resolvedResultsByQueryLastPageReached,
      };
    },

    [ACTIONS.RESOLVED_SEARCH_FAIL]: (state: SearchState): SearchState => ({
      ...state,
      searching: false,
    }),

    [ACTIONS.UPDATE_SEARCH_QUERY]: (state: SearchState, action: UpdateSearchQuery): SearchState => ({
      ...state,
      searchQuery: action.data.query,
      isActive: true,
    }),

    [ACTIONS.UPDATE_SEARCH_SUGGESTIONS]: (state: SearchState, action: UpdateSearchSuggestions): SearchState => ({
      ...state,
      suggestions: {
        ...state.suggestions,
        [action.data.query]: action.data.suggestions,
      },
    }),

    // sets isActive to false so the uri will be populated correctly if the
    // user is on a file page. The search query will still be present on any
    // other page
    [ACTIONS.SEARCH_FOCUS]: (state: SearchState): SearchState => ({
      ...state,
      focused: true,
    }),
    [ACTIONS.SEARCH_BLUR]: (state: SearchState): SearchState => ({
      ...state,
      focused: false,
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
