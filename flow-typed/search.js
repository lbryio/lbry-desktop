// @flow
import * as ACTIONS from 'constants/action_types';

declare type SearchOptions = {
  // :(
  // https://github.com/facebook/flow/issues/6492
  RESULT_COUNT: number,
  CLAIM_TYPE: string,
  INCLUDE_FILES: string,
  INCLUDE_CHANNELS: string,
  INCLUDE_FILES_AND_CHANNELS: string,
  MEDIA_AUDIO: string,
  MEDIA_VIDEO: string,
  MEDIA_TEXT: string,
  MEDIA_IMAGE: string,
  MEDIA_APPLICATION: string,
  SORT: string,
  SORT_ACCENDING: string,
  SORT_DESCENDING: string,
};

declare type SearchState = {
  options: SearchOptions,
  urisByQuery: {},
  searching: boolean,
};

declare type SearchSuccess = {
  type: ACTIONS.SEARCH_SUCCESS,
  data: {
    query: string,
    uris: Array<string>,
  },
};

declare type UpdateSearchOptions = {
  type: ACTIONS.UPDATE_SEARCH_OPTIONS,
  data: SearchOptions,
};
