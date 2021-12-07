// @flow
import * as ACTIONS from 'constants/action_types';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectClaimForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import { doResolveUris } from 'redux/actions/claims';
import { buildURI, isURIValid } from 'util/lbryURI';
import { batchActions } from 'util/batch-actions';
import { makeSelectSearchUrisForQuery, selectSearchValue } from 'redux/selectors/search';
import handleFetchResponse from 'util/handle-fetch';
import { getSearchQueryString } from 'util/query-params';
import { getRecommendationSearchOptions } from 'util/search';
import { SEARCH_SERVER_API, SEARCH_SERVER_API_ALT } from 'config';
import { SEARCH_OPTIONS } from 'constants/search';

type Dispatch = (action: any) => any;
type GetState = () => { claims: any, search: SearchState };

type SearchOptions = {
  size?: number,
  from?: number,
  related_to?: string,
  nsfw?: boolean,
  isBackgroundSearch?: boolean,
};

let lighthouse = {
  CONNECTION_STRING: SEARCH_SERVER_API,
  user_id: '',

  search: (queryString: string) => fetch(`${lighthouse.CONNECTION_STRING}?${queryString}`).then(handleFetchResponse),

  searchRecommendations: (queryString: string) => {
    if (lighthouse.user_id) {
      return fetch(`${SEARCH_SERVER_API_ALT}?${queryString}${lighthouse.user_id}`).then(handleFetchResponse);
    } else {
      return fetch(`${SEARCH_SERVER_API_ALT}?${queryString}`).then(handleFetchResponse);
    }
  },
};

export const setSearchApi = (endpoint: string) => {
  lighthouse.CONNECTION_STRING = endpoint.replace(/\/*$/, '/'); // exactly one slash at the end;
};

export const setSearchUserId = (userId: ?string) => {
  lighthouse.user_id = userId ? `&user_id=${userId}` : '';
};

export const doSearch = (rawQuery: string, searchOptions: SearchOptions) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const query = rawQuery.replace(/^lbry:\/\//i, '').replace(/\//, ' ');

  if (!query) {
    dispatch({
      type: ACTIONS.SEARCH_FAIL,
    });
    return;
  }

  const state = getState();

  const queryWithOptions = getSearchQueryString(query, searchOptions);

  const size = searchOptions.size;
  const from = searchOptions.from;

  // If we have already searched for something, we don't need to do anything
  const urisForQuery = makeSelectSearchUrisForQuery(queryWithOptions)(state);
  if (urisForQuery && !!urisForQuery.length) {
    if (!size || !from || from + size < urisForQuery.length) {
      return;
    }
  }

  dispatch({
    type: ACTIONS.SEARCH_START,
  });

  const cmd = searchOptions.hasOwnProperty(SEARCH_OPTIONS.RELATED_TO)
    ? lighthouse.searchRecommendations
    : lighthouse.search;

  cmd(queryWithOptions)
    .then((data: { body: Array<{ name: string, claimId: string }>, poweredBy: string }) => {
      const { body: result, poweredBy } = data;
      const uris = [];
      const actions = [];

      result.forEach((item) => {
        if (item) {
          const { name, claimId } = item;
          const urlObj: LbryUrlObj = {};

          if (name.startsWith('@')) {
            urlObj.channelName = name;
            urlObj.channelClaimId = claimId;
          } else {
            urlObj.streamName = name;
            urlObj.streamClaimId = claimId;
          }

          const url = buildURI(urlObj);
          if (isURIValid(url)) {
            uris.push(url);
          }
        }
      });

      actions.push(doResolveUris(uris));

      actions.push({
        type: ACTIONS.SEARCH_SUCCESS,
        data: {
          query: queryWithOptions,
          from: from,
          size: size,
          uris,
          recsys: poweredBy,
        },
      });
      dispatch(batchActions(...actions));
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.SEARCH_FAIL,
      });
    });
};

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

export const doSetMentionSearchResults = (uris: Array<string>) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.SET_MENTION_SEARCH_RESULTS,
    data: { uris },
  });
};

export const doFetchRecommendedContent = (uri: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const claim = selectClaimForUri(state, uri);
  const matureEnabled = selectShowMatureContent(state);
  const claimIsMature = selectClaimIsNsfwForUri(state, uri);

  if (claim && claim.value && claim.claim_id) {
    const options: SearchOptions = getRecommendationSearchOptions(matureEnabled, claimIsMature, claim.claim_id);
    const { title } = claim.value;

    if (title && options) {
      dispatch(doSearch(title, options));
    }
  }
};

export { lighthouse };
