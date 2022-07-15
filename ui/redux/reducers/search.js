// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';
import { SEARCH_OPTIONS, SEARCH_PAGE_SIZE } from 'constants/search';
import { createNormalizedSearchKey } from 'util/search';
import { LIGHTHOUSE_DEFAULT_TYPES } from 'config';
const defaultSearchTypes = LIGHTHOUSE_DEFAULT_TYPES && LIGHTHOUSE_DEFAULT_TYPES.split(',');

const defaultState: SearchState = {
  // $FlowFixMe
  options: {
    [SEARCH_OPTIONS.RESULT_COUNT]: SEARCH_PAGE_SIZE,
    [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS,
    [SEARCH_OPTIONS.MEDIA_AUDIO]: defaultSearchTypes.includes(SEARCH_OPTIONS.MEDIA_AUDIO),
    [SEARCH_OPTIONS.MEDIA_VIDEO]: defaultSearchTypes.includes(SEARCH_OPTIONS.MEDIA_VIDEO),
    [SEARCH_OPTIONS.MEDIA_TEXT]: defaultSearchTypes.includes(SEARCH_OPTIONS.MEDIA_TEXT),
    [SEARCH_OPTIONS.MEDIA_IMAGE]: defaultSearchTypes.includes(SEARCH_OPTIONS.MEDIA_IMAGE),
    [SEARCH_OPTIONS.MEDIA_APPLICATION]: defaultSearchTypes.includes(SEARCH_OPTIONS.MEDIA_APPLICATION),
  },
  resultsByQuery: {},
  hasReachedMaxResultsLength: {},
  searching: false,
  results: [],
  mentionQuery: '',
  personalRecommendations: { gid: '', uris: [], fetched: false },
};

export default handleActions(
  {
    [ACTIONS.SEARCH_START]: (state: SearchState): SearchState => ({
      ...state,
      searching: true,
    }),
    [ACTIONS.SEARCH_SUCCESS]: (state: SearchState, action: SearchSuccess): SearchState => {
      const { query, uris, from, size, poweredBy: recsys, uuid } = action.data;
      const normalizedQuery = createNormalizedSearchKey(query);
      const urisForQuery = state.resultsByQuery[normalizedQuery] && state.resultsByQuery[normalizedQuery]['uris'];

      let newUris = uris;
      if (from !== 0 && urisForQuery) {
        newUris = Array.from(new Set(urisForQuery.concat(uris)));
      }

      // The returned number of urls is less than the page size, so we're on the last page
      const noMoreResults = size && uris.length < size;

      const results = { uris: newUris, recsys, uuid };
      return {
        ...state,
        searching: false,
        resultsByQuery: Object.assign({}, state.resultsByQuery, { [normalizedQuery]: results }),
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

    [ACTIONS.SET_MENTION_SEARCH_RESULTS]: (state: SearchState, action: SearchSuccess): SearchState => ({
      ...state,
      results: action.data.uris,
      mentionQuery: action.data.query,
    }),

    [ACTIONS.FYP_FETCH_SUCCESS]: (state: SearchState, action: any): SearchState => {
      return {
        ...state,
        personalRecommendations: {
          gid: action.data.gid,
          uris: action.data.uris,
          fetched: true,
        },
      };
    },

    [ACTIONS.FYP_FETCH_FAILED]: (state: SearchState, action: any): SearchState => ({
      ...state,
      personalRecommendations: {
        ...defaultState.personalRecommendations,
        fetched: true,
      },
    }),

    [ACTIONS.FYP_HIDE_URI]: (state: SearchState, action: any): SearchState => {
      const { uri } = action.data;
      const uris = state.personalRecommendations.uris.slice();
      const index = uris.findIndex((x) => x === uri);
      if (index !== -1) {
        uris.splice(index, 1);
        return {
          ...state,
          personalRecommendations: {
            ...state.personalRecommendations,
            gid: state.personalRecommendations.gid,
            uris,
          },
        };
      }

      return state;
    },
  },
  defaultState
);
