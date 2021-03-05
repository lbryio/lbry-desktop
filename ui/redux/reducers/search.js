// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';
import { SEARCH_OPTIONS } from 'constants/search';

const defaultState: SearchState = {
  // $FlowFixMe
  options: {
    [SEARCH_OPTIONS.RESULT_COUNT]: 30,
    [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS,
    [SEARCH_OPTIONS.MEDIA_AUDIO]: true,
    [SEARCH_OPTIONS.MEDIA_VIDEO]: true,
    [SEARCH_OPTIONS.MEDIA_TEXT]: true,
    [SEARCH_OPTIONS.MEDIA_IMAGE]: true,
    [SEARCH_OPTIONS.MEDIA_APPLICATION]: true,
  },
  urisByQuery: {},
  searching: false,
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
