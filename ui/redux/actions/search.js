// @flow
import * as ACTIONS from 'constants/action_types';
import { buildURI, doResolveUris, batchActions } from 'lbry-redux';
import {
  makeSelectSearchUris,
  selectSuggestions,
  makeSelectQueryWithOptions,
  selectSearchValue,
} from 'redux/selectors/search';
import debounce from 'util/debounce';
import handleFetchResponse from 'util/handle-fetch';

const DEBOUNCED_SEARCH_SUGGESTION_MS = 300;
type Dispatch = (action: any) => any;
type GetState = () => { search: SearchState };

type SearchOptions = {
  size?: number,
  from?: number,
  related_to?: string,
  nsfw?: boolean,
  isBackgroundSearch?: boolean,
};

// We can't use env's because they aren't passed into node_modules
let CONNECTION_STRING = 'https://lighthouse.lbry.com/';

export const setSearchApi = (endpoint: string) => {
  CONNECTION_STRING = endpoint.replace(/\/*$/, '/'); // exactly one slash at the end;
};

export const getSearchSuggestions = (value: string) => (dispatch: Dispatch, getState: GetState) => {
  const query = value.trim();

  // strip out any basic stuff for more accurate search results
  let searchValue = query.replace(/lbry:\/\//g, '').replace(/-/g, ' ');
  if (searchValue.includes('#')) {
    // This should probably be more robust, but I think it's fine for now
    // Remove everything after # to get rid of the claim id
    searchValue = searchValue.substring(0, searchValue.indexOf('#'));
  }

  const suggestions = selectSuggestions(getState());
  if (suggestions[searchValue]) {
    return;
  }

  fetch(`${CONNECTION_STRING}autocomplete?s=${encodeURIComponent(searchValue)}`)
    .then(handleFetchResponse)
    .then(apiSuggestions => {
      dispatch({
        type: ACTIONS.UPDATE_SEARCH_SUGGESTIONS,
        data: {
          query: searchValue,
          suggestions: apiSuggestions,
        },
      });
    })
    .catch(() => {
      // If the fetch fails, do nothing
      // Basic search suggestions are already populated at this point
    });
};

const throttledSearchSuggestions = debounce((dispatch, query) => {
  dispatch(getSearchSuggestions(query));
}, DEBOUNCED_SEARCH_SUGGESTION_MS);

export const doUpdateSearchQuery = (query: string, shouldSkipSuggestions: ?boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.UPDATE_SEARCH_QUERY,
    data: { query },
  });

  // Don't fetch new suggestions if the user just added a space
  if (!query.endsWith(' ') || !shouldSkipSuggestions) {
    throttledSearchSuggestions(dispatch, query);
  }
};

export const doSearch = (rawQuery: string, searchOptions: SearchOptions) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const query = rawQuery.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
  const isBackgroundSearch = (searchOptions && searchOptions.isBackgroundSearch) || false;

  if (!query) {
    dispatch({
      type: ACTIONS.SEARCH_FAIL,
    });
    return;
  }

  const state = getState();

  let queryWithOptions = makeSelectQueryWithOptions(query, searchOptions)(state);

  // If we have already searched for something, we don't need to do anything
  const urisForQuery = makeSelectSearchUris(queryWithOptions)(state);
  if (urisForQuery && !!urisForQuery.length) {
    return;
  }

  dispatch({
    type: ACTIONS.SEARCH_START,
  });

  // If the user is on the file page with a pre-populated uri and they select
  // the search option without typing anything, searchQuery will be empty
  // We need to populate it so the input is filled on the search page
  // isBackgroundSearch means the search is happening in the background, don't update the search query
  if (!state.search.searchQuery && !isBackgroundSearch) {
    dispatch(doUpdateSearchQuery(query));
  }

  fetch(`${CONNECTION_STRING}search?${queryWithOptions}`)
    .then(handleFetchResponse)
    .then((data: Array<{ name: string, claimId: string }>) => {
      const uris = [];
      const actions = [];

      data.forEach(result => {
        if (result) {
          const { name, claimId } = result;
          const urlObj: LbryUrlObj = {};

          if (name.startsWith('@')) {
            urlObj.channelName = name;
            urlObj.channelClaimId = claimId;
          } else {
            urlObj.streamName = name;
            urlObj.streamClaimId = claimId;
          }

          const url = buildURI(urlObj);
          uris.push(url);
        }
      });

      actions.push(doResolveUris(uris));

      actions.push({
        type: ACTIONS.SEARCH_SUCCESS,
        data: {
          query: queryWithOptions,
          uris,
        },
      });
      dispatch(batchActions(...actions));
    })
    .catch(e => {
      dispatch({
        type: ACTIONS.SEARCH_FAIL,
      });
    });
};

export const doFocusSearchInput = () => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.SEARCH_FOCUS,
  });

export const doBlurSearchInput = () => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.SEARCH_BLUR,
  });

export const doUpdateSearchOptions = (newOptions: SearchOptions, additionalOptions: SearchOptions) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const searchValue = selectSearchValue(state);

  dispatch({
    type: ACTIONS.UPDATE_SEARCH_OPTIONS,
    data: newOptions,
  });

  if (searchValue) {
    // After updating, perform a search with the new options
    dispatch(doSearch(searchValue, additionalOptions));
  }
};
