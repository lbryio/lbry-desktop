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
  EXACT: string,
  TIME_FILTER: string,
  TIME_FILTER_LAST_HOUR: string,
  TIME_FILTER_TODAY: string,
  TIME_FILTER_THIS_WEEK: string,
  TIME_FILTER_THIS_MONTH: string,
  TIME_FILTER_THIS_YEAR: string,
};

declare type SearchState = {
  options: SearchOptions,
  resultsByQuery: {},
  results: Array<string>,
  hasReachedMaxResultsLength: {},
  searching: boolean,
  mentionQuery: string,
};

declare type SearchSuccess = {
  type: ACTIONS.SEARCH_SUCCESS,
  data: {
    query: string,
    from: number,
    size: number,
    uris: Array<string>,
    recsys: string,
    query: string,
  },
};

declare type UpdateSearchOptions = {
  type: ACTIONS.UPDATE_SEARCH_OPTIONS,
  data: SearchOptions,
};
