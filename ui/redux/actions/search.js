// @flow
import * as ACTIONS from 'constants/action_types';
import { SEARCH_OPTIONS } from 'constants/search';
import { buildURI, doResolveUris, batchActions, isURIValid, makeSelectClaimForUri } from 'lbry-redux';
import {
  makeSelectSearchUris,
  makeSelectQueryWithOptions,
  selectSearchValue,
  selectSearchOptions,
} from 'redux/selectors/search';
import handleFetchResponse from 'util/handle-fetch';

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
  CONNECTION_STRING: 'https://lighthouse.lbry.com/search',
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

  const mainOptions: any = selectSearchOptions(state);
  const queryWithOptions = makeSelectQueryWithOptions(query, searchOptions)(state);

  const size = mainOptions.size;
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
    .then((data: Array<{ name: string, claimId: string }>) => {
      const uris = [];
      const actions = [];

      data.forEach((result) => {
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
        },
      });
      dispatch(batchActions(...actions));
    })
    .catch((e) => {
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

    options[SEARCH_OPTIONS.CLAIM_TYPE] = SEARCH_OPTIONS.INCLUDE_FILES;
    options[SEARCH_OPTIONS.MEDIA_VIDEO] = true;

    const { title } = claim.value;
    if (title && options) {
      dispatch(doSearch(title, options));
    }
  }
};

export { lighthouse };
