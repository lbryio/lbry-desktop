// @flow
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectClaimForUri, selectClaimIdForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import { doClaimSearch, doResolveClaimIds, doResolveUris } from 'redux/actions/claims';
import { buildURI, isURIValid } from 'util/lbryURI';
import { batchActions } from 'util/batch-actions';
import { makeSelectSearchUrisForQuery, selectPersonalRecommendations, selectSearchValue } from 'redux/selectors/search';
import { selectUser } from 'redux/selectors/user';
import handleFetchResponse from 'util/handle-fetch';
import { getSearchQueryString } from 'util/query-params';
import { getRecommendationSearchOptions } from 'util/search';
import { SEARCH_SERVER_API, SEARCH_SERVER_API_ALT, RECSYS_FYP_ENDPOINT } from 'config';
import { SEARCH_OPTIONS } from 'constants/search';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';
import { getAuthToken } from 'util/saved-passwords';

// ****************************************************************************
// FYP
// ****************************************************************************
// TODO: This should be part of `extras/recsys/recsys`, but due to the circular
// dependency problem with `extras`, I'm temporarily placing it. The recsys
// object should be moved into `ui`, but that change will require more testing.

console.assert(RECSYS_FYP_ENDPOINT, 'RECSYS_FYP_ENDPOINT not defined!');

const recsysFyp = {
  fetchPersonalRecommendations: (userId: string) => {
    return fetch(`${RECSYS_FYP_ENDPOINT}/${userId}/fyp`, { headers: { [X_LBRY_AUTH_TOKEN]: getAuthToken() } })
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => {
        console.log('FYP: fetch', { error, userId });
        return {};
      });
  },

  markPersonalRecommendations: (userId: string, gid: string) => {
    return fetch(`${RECSYS_FYP_ENDPOINT}/${userId}/fyp/${gid}/mark`, {
      method: 'POST',
      headers: { [X_LBRY_AUTH_TOKEN]: getAuthToken() },
    }).catch((error) => {
      console.log('FYP: mark', { error, userId, gid });
      return {};
    });
  },

  ignoreRecommendation: (userId: string, gid: string, claimId: string, ignoreChannel: boolean) => {
    let endpoint = `${RECSYS_FYP_ENDPOINT}/${userId}/fyp/${gid}/c/${claimId}/ignore`;
    if (ignoreChannel) {
      endpoint += '?entire_channel=1';
    }

    return fetch(endpoint, {
      method: 'POST',
      headers: { [X_LBRY_AUTH_TOKEN]: getAuthToken() },
    })
      .then((result) => result)
      .catch((error) => {
        console.log('FYP: ignore', { error, userId, gid, claimId });
        return {};
      });
  },
};

// ****************************************************************************
// ****************************************************************************

type Dispatch = (action: any) => any;
type GetState = () => { claims: any, search: SearchState, user: UserState };

type SearchOptions = {
  size?: number,
  from?: number,
  related_to?: string,
  nsfw?: boolean,
  isBackgroundSearch?: boolean,
  gid?: string, // for fyp only
  uuid?: string, // for fyp only
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

/**
 * Processes a lighthouse-formatted search result to an array of uris.
 * @param results
 */
const processLighthouseResults = (results: Array<any>) => {
  const uris = [];

  results.forEach((item) => {
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

  return uris;
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

  const isSearchingRecommendations = searchOptions.hasOwnProperty(SEARCH_OPTIONS.RELATED_TO);
  const cmd = isSearchingRecommendations ? lighthouse.searchRecommendations : lighthouse.search;

  cmd(queryWithOptions)
    .then((data: SearchResults) => {
      const { body: result, poweredBy, uuid } = data;
      const uris = processLighthouseResults(result);

      if (isSearchingRecommendations) {
        // Temporarily resolve using `claim_search` until the SDK bug is fixed.
        const claimIds = result.map((x) => x.claimId);
        dispatch(doResolveClaimIds(claimIds)).finally(() => {
          dispatch({
            type: ACTIONS.SEARCH_SUCCESS,
            data: {
              query: queryWithOptions,
              from: from,
              size: size,
              uris,
              poweredBy,
              uuid,
            },
          });
        });
        return;
      }

      const actions = [];
      actions.push(doResolveUris(uris));
      actions.push({
        type: ACTIONS.SEARCH_SUCCESS,
        data: {
          query: queryWithOptions,
          from: from,
          size: size,
          uris,
          poweredBy,
          uuid,
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

export const doSetMentionSearchResults = (query: string, uris: Array<string>) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.SET_MENTION_SEARCH_RESULTS,
    data: { query, uris },
  });
};

export const doFetchRecommendedContent = (uri: string, fyp: ?FypParam = null) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const claim = selectClaimForUri(state, uri);
  const matureEnabled = selectShowMatureContent(state);
  const claimIsMature = selectClaimIsNsfwForUri(state, uri);

  if (claim && claim.value && claim.claim_id) {
    const options: SearchOptions = getRecommendationSearchOptions(matureEnabled, claimIsMature, claim.claim_id);

    if (fyp) {
      options['gid'] = fyp.gid;
      options['uuid'] = fyp.uuid;
    }

    const { title } = claim.value;

    if (title && options) {
      dispatch(doSearch(title, options));
    }
  }
};

export const doFetchPersonalRecommendations = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const user = selectUser(state);

  if (!user || !user.id) {
    dispatch({ type: ACTIONS.FYP_FETCH_FAILED });
    return;
  }

  recsysFyp
    .fetchPersonalRecommendations(user.id)
    .then((data) => {
      const { gid, recs } = data;
      if (gid && recs) {
        const uris = processLighthouseResults(recs);
        dispatch(
          doClaimSearch({
            claim_ids: recs.map((r) => r.claimId),
            page: 1,
            page_size: 50,
            no_totals: true,
          })
        ).finally(() => {
          dispatch({
            type: ACTIONS.FYP_FETCH_SUCCESS,
            data: { gid, uris },
          });
        });
      } else {
        dispatch({ type: ACTIONS.FYP_FETCH_FAILED });
      }
    })
    .catch(() => {
      dispatch({ type: ACTIONS.FYP_FETCH_FAILED });
    });
};

export const doRemovePersonalRecommendation = (uri: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const user = selectUser(state);
  const personalRecommendations = selectPersonalRecommendations(state);
  const claimId = selectClaimIdForUri(state, uri);

  if (!user || !user.id || !personalRecommendations.gid || !claimId) {
    return;
  }

  dispatch(
    doOpenModal(MODALS.HIDE_RECOMMENDATION, {
      uri,
      onConfirm: (hideChannel) => {
        recsysFyp
          .ignoreRecommendation(user.id, personalRecommendations.gid, claimId, hideChannel)
          .then((res) => {
            dispatch({ type: ACTIONS.FYP_HIDE_URI, data: { uri } });
            dispatch(
              doToast({
                message: __('Recommendation removed.'),
                subMessage: __('Thanks for the feedback!'),
              })
            );
          })
          .catch((err) => {
            console.log('doRemovePersonalRecommendation:', err);
          });
      },
    })
  );
};

export { lighthouse, recsysFyp };
