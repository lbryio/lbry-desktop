// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

type SearchState = {
  isActive: boolean,
  searchQuery: string,
  searchingForSuggestions: boolean,
  suggestions: Array<string>,
  urisByQuery: {},
};

const defaultState = {
  isActive: false,
  searchQuery: '', // needs to be an empty string for input focusing
  searchingForSuggestions: false,
  suggestions: [],
  urisByQuery: {},
};

export default handleActions(
  {
    [ACTIONS.SEARCH_START]: (state: SearchState): SearchState => ({
      ...state,
      searching: true,
    }),
    [ACTIONS.SEARCH_SUCCESS]: (state: SearchState, action): SearchState => {
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

    [ACTIONS.UPDATE_SEARCH_QUERY]: (state: SearchState, action): SearchState => ({
      ...state,
      searchQuery: action.data.searchQuery,
      suggestions: [],
      isActive: true,
    }),

    [ACTIONS.SEARCH_SUGGESTIONS_START]: (state: SearchState): SearchState => ({
      ...state,
      searchingForSuggestions: true,
      suggestions: [],
    }),
    [ACTIONS.GET_SEARCH_SUGGESTIONS_SUCCESS]: (state: SearchState, action): SearchState => ({
      ...state,
      searchingForSuggestions: false,
      suggestions: action.data,
    }),
    [ACTIONS.GET_SEARCH_SUGGESTIONS_FAIL]: (state: SearchState): SearchState => ({
      ...state,
      searchingForSuggestions: false,
      // error, TODO: figure this out on the search page
    }),

    // clear the searchQuery on back/forward
    // it may be populated by the page title for search/file pages
    // if going home, it should be blank
    [ACTIONS.HISTORY_NAVIGATE]: (state: SearchState): SearchState => ({
      ...state,
      searchQuery: '',
      isActive: false,
    }),
  },
  defaultState
);
