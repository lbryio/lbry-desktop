// @flow
import * as ACTIONS from 'constants/action_types';
import { SEARCH_OPTIONS } from 'constants/search';
import { buildURI, doResolveUris, batchActions, isURIValid, makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectSearchUris, selectSearchValue } from 'redux/selectors/search';
import handleFetchResponse from 'util/handle-fetch';
import { getSearchQueryString } from 'util/query-params';
import { SIMPLE_SITE, SEARCH_SERVER_API } from 'config';

type Dispatch = (action: any) => any;
type GetState = () => { search: SearchState };

type SearchOptions = {
  size?: number,
  from?: number,
  related_to?: string,
  nsfw?: boolean,
  isBackgroundSearch?: boolean,
};

let lighthouse = {
  CONNECTION_STRING: SEARCH_SERVER_API,
  search: (queryString: string) => fetch(`${lighthouse.CONNECTION_STRING}?${queryString}`).then(handleFetchResponse),
};

export const setSearchApi = (endpoint: string) => {
  lighthouse.CONNECTION_STRING = endpoint.replace(/\/*$/, '/'); // exactly one slash at the end;
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
  const urisForQuery = makeSelectSearchUris(queryWithOptions)(state);
  if (urisForQuery && !!urisForQuery.length) {
    if (!size || !from || from + size < urisForQuery.length) {
      return;
    }
  }

  dispatch({
    type: ACTIONS.SEARCH_START,
  });

  lighthouse
    .search(queryWithOptions)
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

export const doFetchRecommendedContent = (uri: string, mature: boolean) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const claim = makeSelectClaimForUri(uri)(state);

  if (claim && claim.value && claim.claim_id) {
    const options: SearchOptions = { size: 20, related_to: claim.claim_id, isBackgroundSearch: true };
    if (!mature) {
      options['nsfw'] = false;
    }

    if (SIMPLE_SITE) {
      options[SEARCH_OPTIONS.CLAIM_TYPE] = SEARCH_OPTIONS.INCLUDE_FILES;
      options[SEARCH_OPTIONS.MEDIA_VIDEO] = true;
    }
    const { title } = claim.value;
    if (title && options) {
      dispatch(doSearch(title, options));
    }
  }
};

export { lighthouse };
