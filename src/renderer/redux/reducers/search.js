// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

type SearchSuccess = {
  type: ACTIONS.SEARCH_SUCCESS,
  data: {
    query: string,
    uris: Array<string>,
  },
};

type UpdateSearchQuery = {
  type: ACTIONS.UPDATE_SEARCH_QUERY,
  data: {
    query: string,
  },
};

type SearchSuggestion = {
  value: string,
  shorthand: string,
  type: string,
};

type UpdateSearchSuggestions = {
  type: ACTIONS.UPDATE_SEARCH_SUGGESTIONS,
  data: {
    suggestions: Array<SearchSuggestion>,
  },
};

type SearchState = {
  isActive: boolean,
  searchQuery: string,
  suggestions: Array<SearchSuggestion>,
  urisByQuery: {},
};

const defaultState = {
  isActive: false,
  searchQuery: '', // needs to be an empty string for input focusing
  suggestions: [],
  urisByQuery: {},
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

    [ACTIONS.UPDATE_SEARCH_QUERY]: (
      state: SearchState,
      action: UpdateSearchQuery
    ): SearchState => ({
      ...state,
      searchQuery: action.data.query,
      isActive: true,
    }),

    [ACTIONS.UPDATE_SEARCH_SUGGESTIONS]: (
      state: SearchState,
      action: UpdateSearchSuggestions
    ): SearchState => ({
      ...state,
      suggestions: action.data.suggestions,
    }),

    // clear the searchQuery on back/forward
    // it may be populated by the page title for search/file pages
    // if going home, it should be blank
    [ACTIONS.HISTORY_NAVIGATE]: (state: SearchState): SearchState => ({
      ...state,
      searchQuery: '',
      suggestions: [],
      isActive: false,
    }),
    // sets isActive to false so the uri will be populated correctly if the
    // user is on a file page. The search query will still be present on any
    // other page
    [ACTIONS.CLOSE_MODAL]: (state: SearchState): SearchState => ({
      ...state,
      isActive: false,
    }),
  },
  defaultState
);
