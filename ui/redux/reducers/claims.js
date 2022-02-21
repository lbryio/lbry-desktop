// @flow

// This file has a lot of FlowFixMe comments
// It's due to Flow's support of Object.{values,entries}
// https://github.com/facebook/flow/issues/2221
// We could move to es6 Sets/Maps, but those are not recommended for redux
// https://github.com/reduxjs/redux/issues/1499
// Unsure of the best solution at the momentf
// - Sean

import * as ACTIONS from 'constants/action_types';
import mergeClaim from 'util/merge-claim';

type State = {
  createChannelError: ?string,
  createCollectionError: ?string,
  channelClaimCounts: { [string]: number },
  claimsByUri: { [string]: string },
  byId: { [string]: Claim },
  pendingById: { [string]: Claim }, // keep pending claims
  resolvingUris: Array<string>,
  reflectingById: { [string]: ReflectingUpdate },
  myClaims: ?Array<string>,
  myChannelClaims: ?Array<string>,
  myCollectionClaims: ?Array<string>,
  abandoningById: { [string]: boolean },
  fetchingChannelClaims: { [string]: number },
  fetchingMyChannels: boolean,
  fetchingMyCollections: boolean,
  fetchingClaimSearchByQuery: { [string]: boolean },
  purchaseUriSuccess: boolean,
  myPurchases: ?Array<string>,
  myPurchasesPageNumber: ?number,
  myPurchasesPageTotalResults: ?number,
  fetchingMyPurchases: boolean,
  fetchingMyPurchasesError: ?string,
  claimSearchByQuery: { [string]: Array<string> },
  claimSearchByQueryLastPageReached: { [string]: Array<boolean> },
  creatingChannel: boolean,
  creatingCollection: boolean,
  paginatedClaimsByChannel: {
    [string]: {
      all: Array<string>,
      pageCount: number,
      itemCount: number,
      [number]: Array<string>,
    },
  },
  updateChannelError: ?string,
  updateCollectionError: ?string,
  updatingChannel: boolean,
  updatingCollection: boolean,
  pendingChannelImport: string | boolean,
  repostLoading: boolean,
  repostError: ?string,
  fetchingClaimListMinePageError: ?string,
  myClaimsPageResults: Array<string>,
  myClaimsPageNumber: ?number,
  myClaimsPageTotalResults: ?number,
  isFetchingClaimListMine: boolean,
  isCheckingNameForPublish: boolean,
  checkingPending: boolean,
  checkingReflecting: boolean,
};

const reducers = {};
const defaultState = {
  byId: {},
  claimsByUri: {},
  paginatedClaimsByChannel: {},
  channelClaimCounts: {},
  fetchingChannelClaims: {},
  resolvingUris: [],
  myChannelClaims: undefined,
  myCollectionClaims: [],
  myClaims: undefined,
  myPurchases: undefined,
  myPurchasesPageNumber: undefined,
  myPurchasesPageTotalResults: undefined,
  purchaseUriSuccess: false,
  fetchingMyPurchases: false,
  fetchingMyPurchasesError: undefined,
  fetchingMyChannels: false,
  fetchingMyCollections: false,
  abandoningById: {},
  pendingById: {},
  reflectingById: {},
  claimSearchError: false,
  claimSearchByQuery: {},
  claimSearchByQueryLastPageReached: {},
  fetchingClaimSearchByQuery: {},
  updateChannelError: '',
  updateCollectionError: '',
  updatingChannel: false,
  creatingChannel: false,
  createChannelError: undefined,
  updatingCollection: false,
  creatingCollection: false,
  createCollectionError: undefined,
  pendingChannelImport: false,
  repostLoading: false,
  repostError: undefined,
  fetchingClaimListMinePageError: undefined,
  myClaimsPageResults: [],
  myClaimsPageNumber: undefined,
  myClaimsPageTotalResults: undefined,
  isFetchingClaimListMine: false,
  isFetchingMyPurchases: false,
  isCheckingNameForPublish: false,
  checkingPending: false,
  checkingReflecting: false,
};

// ****************************************************************************
// Helpers
// ****************************************************************************

function isObjEmpty(object: any) {
  return Object.keys(object).length === 0;
}

function resolveDelta(original: any, delta: any) {
  if (isObjEmpty(delta)) {
    // Don't invalidate references when there are no changes, so return original.
    return original;
  } else {
    // When there are changes: create a new object, spread existing references,
    // and overwrite specific items with new data.
    return { ...original, ...delta };
  }
}

function claimHasNewData(original, fresh) {
  // Don't blow away 'is_my_output' just because the next query didn't ask for it.
  const ignoreIsMyOutput = original.is_my_output !== undefined && fresh.is_my_output === undefined;

  // Something is causing the tags to be re-ordered differently
  // (https://github.com/OdyseeTeam/odysee-frontend/issues/116#issuecomment-962747147).
  // Just do a length comparison for now, which covers 99% of cases while we
  // figure out what's causing the order to change.
  const ignoreTags =
    original &&
    original.value &&
    original.value.tags &&
    original.value.tags.length &&
    fresh &&
    fresh.value &&
    fresh.value.tags &&
    fresh.value.tags.length &&
    original.value.tags.length !== fresh.value.tags.length;

  const excludeKeys = (key, value) => {
    if (key === 'confirmations' || (ignoreTags && key === 'tags') || (ignoreIsMyOutput && key === 'is_my_output')) {
      return undefined;
    }

    return value;
  };

  const originalStringified = JSON.stringify(original, excludeKeys);
  const freshStringified = JSON.stringify(fresh, excludeKeys);

  return originalStringified !== freshStringified;
}

/**
 * Adds the new value to the delta if the value is different from the original.
 *
 * @param original The original state object.
 * @param delta The delta state object containing a list of changes.
 * @param key
 * @param newValue
 */
function updateIfValueChanged(original, delta, key, newValue) {
  if (original[key] !== newValue) {
    delta[key] = newValue;
  }
}

/**
 * Adds the new claim to the delta if the claim contains changes that the GUI
 * would care about.
 *
 * @param original The original state object.
 * @param delta The delta state object containing a list of changes.
 * @param key
 * @param newClaim
 */
function updateIfClaimChanged(original, delta, key, newClaim) {
  if (!original[key] || claimHasNewData(original[key], newClaim)) {
    delta[key] = newClaim;
  }
}

// ****************************************************************************
// handleClaimAction
// ****************************************************************************

function handleClaimAction(state: State, action: any): State {
  const { resolveInfo }: ClaimActionResolveInfo = action.data;

  const byUriDelta = {};
  const byIdDelta = {};
  const channelClaimCounts = Object.assign({}, state.channelClaimCounts);
  const pendingById = state.pendingById;
  let newResolvingUrls = new Set(state.resolvingUris);
  let myClaimIds = new Set(state.myClaims);

  Object.entries(resolveInfo).forEach(([url, resolveResponse]) => {
    // $FlowFixMe
    const { claimsInChannel, stream, channel: channelFromResolve, collection } = resolveResponse;
    const channel = channelFromResolve || (stream && stream.signing_channel);

    if (stream) {
      if (pendingById[stream.claim_id]) {
        byIdDelta[stream.claim_id] = mergeClaim(stream, state.byId[stream.claim_id]);
      } else {
        updateIfClaimChanged(state.byId, byIdDelta, stream.claim_id, stream);
      }

      updateIfValueChanged(state.claimsByUri, byUriDelta, url, stream.claim_id);

      // If url isn't a canonical_url, make sure that is added too
      updateIfValueChanged(state.claimsByUri, byUriDelta, stream.canonical_url, stream.claim_id);

      // Also add the permanent_url here until lighthouse returns canonical_url for search results
      updateIfValueChanged(state.claimsByUri, byUriDelta, stream.permanent_url, stream.claim_id);
      newResolvingUrls.delete(stream.canonical_url);
      newResolvingUrls.delete(stream.permanent_url);

      if (stream.is_my_output) {
        myClaimIds.add(stream.claim_id);
      }
    }

    if (channel && channel.claim_id) {
      if (!stream) {
        updateIfValueChanged(state.claimsByUri, byUriDelta, url, channel.claim_id);
      }

      if (claimsInChannel) {
        channelClaimCounts[url] = claimsInChannel;
        channelClaimCounts[channel.canonical_url] = claimsInChannel;
      }

      if (pendingById[channel.claim_id]) {
        byIdDelta[channel.claim_id] = mergeClaim(channel, state.byId[channel.claim_id]);
      } else {
        updateIfClaimChanged(state.byId, byIdDelta, channel.claim_id, channel);
      }

      updateIfValueChanged(state.claimsByUri, byUriDelta, channel.permanent_url, channel.claim_id);
      updateIfValueChanged(state.claimsByUri, byUriDelta, channel.canonical_url, channel.claim_id);
      newResolvingUrls.delete(channel.canonical_url);
      newResolvingUrls.delete(channel.permanent_url);
    }

    if (collection) {
      if (pendingById[collection.claim_id]) {
        byIdDelta[collection.claim_id] = mergeClaim(collection, state.byId[collection.claim_id]);
      } else {
        updateIfClaimChanged(state.byId, byIdDelta, collection.claim_id, collection);
      }

      updateIfValueChanged(state.claimsByUri, byUriDelta, url, collection.claim_id);
      updateIfValueChanged(state.claimsByUri, byUriDelta, collection.canonical_url, collection.claim_id);
      updateIfValueChanged(state.claimsByUri, byUriDelta, collection.permanent_url, collection.claim_id);
      newResolvingUrls.delete(collection.canonical_url);
      newResolvingUrls.delete(collection.permanent_url);

      if (collection.is_my_output) {
        myClaimIds.add(collection.claim_id);
      }
    }

    newResolvingUrls.delete(url);
    if (!stream && !channel && !collection && !pendingById[state.claimsByUri[url]]) {
      updateIfValueChanged(state.claimsByUri, byUriDelta, url, null);
    }
  });

  return Object.assign({}, state, {
    byId: resolveDelta(state.byId, byIdDelta),
    claimsByUri: resolveDelta(state.claimsByUri, byUriDelta),
    channelClaimCounts,
    resolvingUris: Array.from(newResolvingUrls),
    ...(!state.myClaims || myClaimIds.size !== state.myClaims.length ? { myClaims: Array.from(myClaimIds) } : {}),
  });
}

// ****************************************************************************
// Reducers
// ****************************************************************************

reducers[ACTIONS.RESOLVE_URIS_STARTED] = (state: State, action: any): State => {
  const { uris }: { uris: Array<string> } = action.data;

  const oldResolving = state.resolvingUris || [];
  const newResolving = oldResolving.slice();

  uris.forEach((uri) => {
    if (!newResolving.includes(uri)) {
      newResolving.push(uri);
    }
  });

  return Object.assign({}, state, {
    resolvingUris: newResolving,
  });
};

reducers[ACTIONS.RESOLVE_URIS_COMPLETED] = (state: State, action: any): State => {
  return {
    ...handleClaimAction(state, action),
  };
};

reducers[ACTIONS.FETCH_CLAIM_LIST_MINE_STARTED] = (state: State): State =>
  Object.assign({}, state, {
    isFetchingClaimListMine: true,
  });

reducers[ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED] = (state: State, action: any): State => {
  const { result }: { result: ClaimListResponse } = action.data;
  const claims = result.items;
  const page = result.page;
  const totalItems = result.total_items;

  const byIdDelta = {};
  const byUriDelta = {};
  const pendingByIdDelta = {};

  let myClaimIds = new Set(state.myClaims);
  let urlsForCurrentPage = [];

  claims.forEach((claim: Claim) => {
    const { permanent_url: permanentUri, claim_id: claimId, canonical_url: canonicalUri } = claim;
    if (claim.type && claim.type.match(/claim|update/)) {
      urlsForCurrentPage.push(permanentUri);

      if (claim.confirmations < 1) {
        pendingByIdDelta[claimId] = claim;

        if (state.byId[claimId]) {
          byIdDelta[claimId] = mergeClaim(claim, state.byId[claimId]);
        } else {
          byIdDelta[claimId] = claim;
        }
      } else {
        updateIfClaimChanged(state.byId, byIdDelta, claimId, claim);
      }

      updateIfValueChanged(state.claimsByUri, byUriDelta, permanentUri, claimId);
      updateIfValueChanged(state.claimsByUri, byUriDelta, canonicalUri, claimId);
      myClaimIds.add(claimId);
    }
  });

  return Object.assign({}, state, {
    isFetchingClaimListMine: false,
    myClaims: Array.from(myClaimIds),
    byId: resolveDelta(state.byId, byIdDelta),
    pendingById: resolveDelta(state.pendingById, pendingByIdDelta),
    claimsByUri: resolveDelta(state.claimsByUri, byUriDelta),
    myClaimsPageResults: urlsForCurrentPage,
    myClaimsPageNumber: page,
    myClaimsPageTotalResults: totalItems,
  });
};

reducers[ACTIONS.FETCH_CHANNEL_LIST_STARTED] = (state: State): State =>
  Object.assign({}, state, { fetchingMyChannels: true });

reducers[ACTIONS.FETCH_CHANNEL_LIST_COMPLETED] = (state: State, action: any): State => {
  const { claims }: { claims: Array<ChannelClaim> } = action.data;
  let myClaimIds = new Set(state.myClaims);
  const pendingByIdDelta = {};
  let myChannelClaims;
  const byIdDelta = {};
  const byUriDelta = {};
  const channelClaimCounts = Object.assign({}, state.channelClaimCounts);

  if (!claims.length) {
    // $FlowFixMe
    myChannelClaims = null;
  } else {
    myChannelClaims = new Set(state.myChannelClaims);
    claims.forEach((claim) => {
      const { meta } = claim;
      const { claims_in_channel: claimsInChannel } = meta;
      const { canonical_url: canonicalUrl, permanent_url: permanentUrl, claim_id: claimId, confirmations } = claim;

      updateIfValueChanged(state.claimsByUri, byUriDelta, canonicalUrl, claimId);
      updateIfValueChanged(state.claimsByUri, byUriDelta, permanentUrl, claimId);
      channelClaimCounts[canonicalUrl] = claimsInChannel;
      channelClaimCounts[permanentUrl] = claimsInChannel;

      // $FlowFixMe
      myChannelClaims.add(claimId);

      if (confirmations < 1) {
        pendingByIdDelta[claimId] = claim;

        if (state.byId[claimId]) {
          byIdDelta[claimId] = mergeClaim(claim, state.byId[claimId]);
        } else {
          byIdDelta[claimId] = claim;
        }
      } else {
        updateIfClaimChanged(state.byId, byIdDelta, claimId, claim);
      }

      myClaimIds.add(claimId);
    });
  }

  return Object.assign({}, state, {
    byId: resolveDelta(state.byId, byIdDelta),
    pendingById: resolveDelta(state.pendingById, pendingByIdDelta),
    claimsByUri: resolveDelta(state.claimsByUri, byUriDelta),
    channelClaimCounts,
    fetchingMyChannels: false,
    myChannelClaims: myChannelClaims ? Array.from(myChannelClaims) : null,
    myClaims: myClaimIds ? Array.from(myClaimIds) : null,
  });
};

reducers[ACTIONS.FETCH_CHANNEL_LIST_FAILED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    fetchingMyChannels: false,
  });
};

reducers[ACTIONS.FETCH_COLLECTION_LIST_STARTED] = (state: State): State => ({
  ...state,
  fetchingMyCollections: true,
});

reducers[ACTIONS.FETCH_COLLECTION_LIST_COMPLETED] = (state: State, action: any): State => {
  const { claims }: { claims: Array<CollectionClaim> } = action.data;
  const myClaims = state.myClaims || [];
  let myClaimIds = new Set(myClaims);
  const pendingByIdDelta = {};
  let myCollectionClaimsSet = new Set([]);
  const byIdDelta = {};
  const byUriDelta = {};

  if (claims.length) {
    myCollectionClaimsSet = new Set(state.myCollectionClaims);
    claims.forEach((claim) => {
      const { canonical_url: canonicalUrl, permanent_url: permanentUrl, claim_id: claimId, confirmations } = claim;

      updateIfValueChanged(state.claimsByUri, byUriDelta, canonicalUrl, claimId);
      updateIfValueChanged(state.claimsByUri, byUriDelta, permanentUrl, claimId);

      // $FlowFixMe
      myCollectionClaimsSet.add(claimId);

      // we don't want to overwrite a pending result with a resolve
      if (confirmations < 1) {
        pendingByIdDelta[claimId] = claim;

        if (state.byId[claimId]) {
          byIdDelta[claimId] = mergeClaim(claim, state.byId[claimId]);
        } else {
          byIdDelta[claimId] = claim;
        }
      } else {
        updateIfClaimChanged(state.byId, byIdDelta, claimId, claim);
      }

      myClaimIds.add(claimId);
    });
  }

  return {
    ...state,
    byId: resolveDelta(state.byId, byIdDelta),
    pendingById: resolveDelta(state.pendingById, pendingByIdDelta),
    claimsByUri: resolveDelta(state.claimsByUri, byUriDelta),
    fetchingMyCollections: false,
    myCollectionClaims: Array.from(myCollectionClaimsSet),
    myClaims: myClaimIds ? Array.from(myClaimIds) : null,
  };
};

reducers[ACTIONS.FETCH_COLLECTION_LIST_FAILED] = (state: State): State => {
  return { ...state, fetchingMyCollections: false };
};

reducers[ACTIONS.FETCH_CHANNEL_CLAIMS_STARTED] = (state: State, action: any): State => {
  const { uri, page } = action.data;
  const fetchingChannelClaims = Object.assign({}, state.fetchingChannelClaims);

  fetchingChannelClaims[uri] = page;

  return Object.assign({}, state, {
    fetchingChannelClaims,
    currentChannelPage: page,
  });
};

reducers[ACTIONS.FETCH_CHANNEL_CLAIMS_COMPLETED] = (state: State, action: any): State => {
  const {
    uri,
    claims,
    claimsInChannel,
    page,
    totalPages,
  }: {
    uri: string,
    claims: Array<StreamClaim>,
    claimsInChannel?: number,
    page: number,
    totalPages: number,
  } = action.data;

  // byChannel keeps claim_search relevant results by page. If the total changes, erase it.
  const channelClaimCounts = Object.assign({}, state.channelClaimCounts);

  const paginatedClaimsByChannel = Object.assign({}, state.paginatedClaimsByChannel);
  // check if count has changed - that means cached pagination will be wrong, so clear it
  const previousCount = paginatedClaimsByChannel[uri] && paginatedClaimsByChannel[uri]['itemCount'];
  const byChannel = claimsInChannel === previousCount ? Object.assign({}, paginatedClaimsByChannel[uri]) : {};
  const allClaimIds = new Set(byChannel.all);
  const currentPageClaimIds = [];
  const byIdDelta = {};
  const fetchingChannelClaims = Object.assign({}, state.fetchingChannelClaims);
  const claimsByUriDelta = {};

  if (claims !== undefined) {
    claims.forEach((claim) => {
      allClaimIds.add(claim.claim_id);
      currentPageClaimIds.push(claim.claim_id);
      updateIfClaimChanged(state.byId, byIdDelta, claim.claim_id, claim);
      updateIfValueChanged(state.claimsByUri, claimsByUriDelta, claim.canonical_url, claim.claim_id);
    });
  }

  byChannel.all = allClaimIds;
  byChannel.pageCount = totalPages;
  byChannel.itemCount = claimsInChannel;
  byChannel[page] = currentPageClaimIds;
  paginatedClaimsByChannel[uri] = byChannel;
  delete fetchingChannelClaims[uri];

  return Object.assign({}, state, {
    paginatedClaimsByChannel,
    byId: resolveDelta(state.byId, byIdDelta),
    fetchingChannelClaims,
    claimsByUri: resolveDelta(state.claimsByUri, claimsByUriDelta),
    channelClaimCounts,
    currentChannelPage: page,
  });
};

reducers[ACTIONS.ABANDON_CLAIM_STARTED] = (state: State, action: any): State => {
  const { claimId }: { claimId: string } = action.data;
  const abandoningById = Object.assign({}, state.abandoningById);

  abandoningById[claimId] = true;

  return Object.assign({}, state, {
    abandoningById,
  });
};

reducers[ACTIONS.UPDATE_PENDING_CLAIMS] = (state: State, action: any): State => {
  const { claims: pendingClaims }: { claims: Array<Claim> } = action.data;
  const byIdDelta = {};
  const pendingById = Object.assign({}, state.pendingById);
  const byUriDelta = {};
  let myClaimIds = new Set(state.myClaims);
  const myChannelClaims = new Set(state.myChannelClaims);

  // $FlowFixMe
  pendingClaims.forEach((claim: Claim) => {
    let newClaim;
    const { permanent_url: uri, claim_id: claimId, type, value_type: valueType } = claim;
    pendingById[claimId] = claim; // make sure we don't need to merge?
    const oldClaim = state.byId[claimId];
    if (oldClaim && oldClaim.canonical_url) {
      newClaim = mergeClaim(oldClaim, claim);
    } else {
      newClaim = claim;
    }
    if (valueType === 'channel') {
      myChannelClaims.add(claimId);
    }

    if (type && type.match(/claim|update/)) {
      updateIfClaimChanged(state.byId, byIdDelta, claimId, newClaim);
      updateIfValueChanged(state.claimsByUri, byUriDelta, uri, claimId);
    }
    myClaimIds.add(claimId);
  });
  return Object.assign({}, state, {
    myClaims: Array.from(myClaimIds),
    byId: resolveDelta(state.byId, byIdDelta),
    pendingById,
    myChannelClaims: Array.from(myChannelClaims),
    claimsByUri: resolveDelta(state.claimsByUri, byUriDelta),
  });
};

reducers[ACTIONS.UPDATE_CONFIRMED_CLAIMS] = (state: State, action: any): State => {
  const {
    claims: confirmedClaims,
    pending: pendingClaims,
  }: { claims: Array<Claim>, pending: { [string]: Claim } } = action.data;
  const byIdDelta = {};

  confirmedClaims.forEach((claim: GenericClaim) => {
    const { claim_id: claimId, type } = claim;
    let newClaim = claim;
    const oldClaim = state.byId[claimId];
    if (oldClaim && oldClaim.canonical_url) {
      newClaim = mergeClaim(oldClaim, claim);
    }
    if (type && type.match(/claim|update|channel/)) {
      updateIfClaimChanged(state.byId, byIdDelta, claimId, newClaim);
    }
  });

  return Object.assign({}, state, {
    pendingById: pendingClaims,
    byId: resolveDelta(state.byId, byIdDelta),
  });
};

reducers[ACTIONS.ABANDON_CLAIM_SUCCEEDED] = (state: State, action: any): State => {
  const { claimId }: { claimId: string } = action.data;
  const byId = Object.assign({}, state.byId);
  const newMyClaims = state.myClaims ? state.myClaims.slice() : [];
  const newMyChannelClaims = state.myChannelClaims ? state.myChannelClaims.slice() : [];
  const claimsByUri = Object.assign({}, state.claimsByUri);
  const abandoningById = Object.assign({}, state.abandoningById);
  const newMyCollectionClaims = state.myCollectionClaims ? state.myCollectionClaims.slice() : [];

  Object.keys(claimsByUri).forEach((uri) => {
    if (claimsByUri[uri] === claimId) {
      delete claimsByUri[uri];
    }
  });

  if (abandoningById[claimId]) {
    delete abandoningById[claimId];
  }

  const myClaims = newMyClaims.filter((i) => i !== claimId);
  const myChannelClaims = newMyChannelClaims.filter((i) => i !== claimId);
  const myCollectionClaims = newMyCollectionClaims.filter((i) => i !== claimId);

  delete byId[claimId];

  return Object.assign({}, state, {
    myClaims,
    myChannelClaims,
    myCollectionClaims,
    byId,
    claimsByUri,
    abandoningById,
  });
};

reducers[ACTIONS.CLEAR_CHANNEL_ERRORS] = (state: State): State => ({
  ...state,
  createChannelError: null,
  updateChannelError: null,
});

reducers[ACTIONS.CREATE_CHANNEL_STARTED] = (state: State): State => ({
  ...state,
  creatingChannel: true,
  createChannelError: null,
});

reducers[ACTIONS.CREATE_CHANNEL_COMPLETED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    creatingChannel: false,
  });
};

reducers[ACTIONS.CREATE_CHANNEL_FAILED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    creatingChannel: false,
    createChannelError: action.data,
  });
};

reducers[ACTIONS.UPDATE_CHANNEL_STARTED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    updateChannelError: '',
    updatingChannel: true,
  });
};

reducers[ACTIONS.UPDATE_CHANNEL_COMPLETED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    updateChannelError: '',
    updatingChannel: false,
  });
};

reducers[ACTIONS.UPDATE_CHANNEL_FAILED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    updateChannelError: action.data.message,
    updatingChannel: false,
  });
};

reducers[ACTIONS.CLEAR_COLLECTION_ERRORS] = (state: State): State => ({
  ...state,
  createCollectionError: null,
  updateCollectionError: null,
});

reducers[ACTIONS.COLLECTION_PUBLISH_STARTED] = (state: State): State => ({
  ...state,
  creatingCollection: true,
  createCollectionError: null,
});

reducers[ACTIONS.COLLECTION_PUBLISH_COMPLETED] = (state: State, action: any): State => {
  const myCollections = state.myCollectionClaims || [];
  const myClaims = state.myClaims || [];
  const { claimId } = action.data;
  let myClaimIds = new Set(myClaims);
  let myCollectionClaimsSet = new Set(myCollections);
  myClaimIds.add(claimId);
  myCollectionClaimsSet.add(claimId);
  return Object.assign({}, state, {
    creatingCollection: false,
    myClaims: Array.from(myClaimIds),
    myCollectionClaims: Array.from(myCollectionClaimsSet),
  });
};

reducers[ACTIONS.COLLECTION_PUBLISH_FAILED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    creatingCollection: false,
    createCollectionError: action.data.error,
  });
};

reducers[ACTIONS.COLLECTION_PUBLISH_UPDATE_STARTED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    updateCollectionError: '',
    updatingCollection: true,
  });
};

reducers[ACTIONS.COLLECTION_PUBLISH_UPDATE_COMPLETED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    updateCollectionError: '',
    updatingCollection: false,
  });
};

reducers[ACTIONS.COLLECTION_PUBLISH_UPDATE_FAILED] = (state: State, action: any): State => {
  return Object.assign({}, state, {
    updateCollectionError: action.data.error,
    updatingCollection: false,
  });
};

reducers[ACTIONS.IMPORT_CHANNEL_STARTED] = (state: State): State =>
  Object.assign({}, state, { pendingChannelImports: true });

reducers[ACTIONS.IMPORT_CHANNEL_COMPLETED] = (state: State): State =>
  Object.assign({}, state, { pendingChannelImports: false });

reducers[ACTIONS.CLEAR_CLAIM_SEARCH_HISTORY] = (state: State): State => {
  return {
    ...state,
    claimSearchByQuery: {},
    claimSearchByQueryLastPageReached: {},
  };
};

reducers[ACTIONS.CLAIM_SEARCH_STARTED] = (state: State, action: any): State => {
  const fetchingClaimSearchByQuery = Object.assign({}, state.fetchingClaimSearchByQuery);
  fetchingClaimSearchByQuery[action.data.query] = true;

  return Object.assign({}, state, {
    fetchingClaimSearchByQuery,
  });
};

reducers[ACTIONS.CLAIM_SEARCH_COMPLETED] = (state: State, action: any): State => {
  const fetchingClaimSearchByQuery = Object.assign({}, state.fetchingClaimSearchByQuery);
  const claimSearchByQuery = Object.assign({}, state.claimSearchByQuery);
  const claimSearchByQueryLastPageReached = Object.assign({}, state.claimSearchByQueryLastPageReached);
  const { append, query, urls, pageSize } = action.data;

  if (append) {
    // todo: check for duplicate urls when concatenating?
    claimSearchByQuery[query] =
      claimSearchByQuery[query] && claimSearchByQuery[query].length ? claimSearchByQuery[query].concat(urls) : urls;
  } else {
    claimSearchByQuery[query] = urls;
  }

  // the returned number of urls is less than the page size, so we're on the last page
  claimSearchByQueryLastPageReached[query] = urls.length < pageSize;

  delete fetchingClaimSearchByQuery[query];

  return Object.assign({}, state, {
    ...handleClaimAction(state, action),
    claimSearchByQuery,
    claimSearchByQueryLastPageReached,
    fetchingClaimSearchByQuery,
  });
};

reducers[ACTIONS.CLAIM_SEARCH_FAILED] = (state: State, action: any): State => {
  const { query } = action.data;
  const claimSearchByQuery = Object.assign({}, state.claimSearchByQuery);
  const fetchingClaimSearchByQuery = Object.assign({}, state.fetchingClaimSearchByQuery);
  const claimSearchByQueryLastPageReached = Object.assign({}, state.claimSearchByQueryLastPageReached);

  delete fetchingClaimSearchByQuery[query];

  if (claimSearchByQuery[query] && claimSearchByQuery[query].length !== 0) {
    claimSearchByQueryLastPageReached[query] = true;
  } else {
    claimSearchByQuery[query] = null;
  }

  return Object.assign({}, state, {
    fetchingClaimSearchByQuery,
    claimSearchByQuery,
    claimSearchByQueryLastPageReached,
  });
};

reducers[ACTIONS.CLAIM_REPOST_STARTED] = (state: State): State => {
  return {
    ...state,
    repostLoading: true,
    repostError: null,
  };
};
reducers[ACTIONS.CLAIM_REPOST_COMPLETED] = (state: State, action: any): State => {
  const { originalClaimId, repostClaim } = action.data;
  const byId = { ...state.byId };
  const claimsByUri = { ...state.claimsByUri };
  const claimThatWasReposted = byId[originalClaimId];

  const repostStub = { ...repostClaim, reposted_claim: claimThatWasReposted };
  byId[repostStub.claim_id] = repostStub;
  claimsByUri[repostStub.permanent_url] = repostStub.claim_id;

  return {
    ...state,
    byId,
    claimsByUri,
    repostLoading: false,
    repostError: null,
  };
};
reducers[ACTIONS.CLAIM_REPOST_FAILED] = (state: State, action: any): State => {
  const { error } = action.data;

  return {
    ...state,
    repostLoading: false,
    repostError: error,
  };
};
reducers[ACTIONS.CLEAR_REPOST_ERROR] = (state: State): State => {
  return {
    ...state,
    repostError: null,
  };
};
reducers[ACTIONS.ADD_FILES_REFLECTING] = (state: State, action): State => {
  const pendingClaim = action.data;
  const { reflectingById } = state;
  const claimId = pendingClaim && pendingClaim.claim_id;

  reflectingById[claimId] = { fileListItem: pendingClaim, progress: 0, stalled: false };

  return Object.assign({}, state, {
    ...state,
    reflectingById: reflectingById,
  });
};
reducers[ACTIONS.UPDATE_FILES_REFLECTING] = (state: State, action): State => {
  const newReflectingById = action.data;

  return Object.assign({}, state, {
    ...state,
    reflectingById: newReflectingById,
  });
};
reducers[ACTIONS.TOGGLE_CHECKING_REFLECTING] = (state: State, action): State => {
  const checkingReflecting = action.data;

  return Object.assign({}, state, {
    ...state,
    checkingReflecting,
  });
};
reducers[ACTIONS.TOGGLE_CHECKING_PENDING] = (state: State, action): State => {
  const checking = action.data;

  return Object.assign({}, state, {
    ...state,
    checkingPending: checking,
  });
};

reducers[ACTIONS.PURCHASE_LIST_STARTED] = (state: State): State => {
  return {
    ...state,
    fetchingMyPurchases: true,
    fetchingMyPurchasesError: null,
  };
};

reducers[ACTIONS.PURCHASE_LIST_COMPLETED] = (state: State, action: any): State => {
  const { result }: { result: PurchaseListResponse, resolve: boolean } = action.data;
  const page = result.page;
  const totalItems = result.total_items;

  let byIdDelta = {};
  let byUriDelta = {};
  let urlsForCurrentPage = [];

  result.items.forEach((item) => {
    if (!item.claim) {
      // Abandoned claim
      return;
    }

    const { claim, ...purchaseInfo } = item;
    claim.purchase_receipt = purchaseInfo;
    const claimId = claim.claim_id;
    const uri = claim.canonical_url;

    updateIfClaimChanged(state.byId, byIdDelta, claimId, claim);
    updateIfValueChanged(state.claimsByUri, byUriDelta, uri, claimId);
    urlsForCurrentPage.push(uri);
  });

  return Object.assign({}, state, {
    byId: resolveDelta(state.byId, byIdDelta),
    claimsByUri: resolveDelta(state.claimsByUri, byUriDelta),
    myPurchases: urlsForCurrentPage,
    myPurchasesPageNumber: page,
    myPurchasesPageTotalResults: totalItems,
    fetchingMyPurchases: false,
  });
};

reducers[ACTIONS.PURCHASE_LIST_FAILED] = (state: State, action: any): State => {
  const { error } = action.data;

  return {
    ...state,
    fetchingMyPurchases: false,
    fetchingMyPurchasesError: error,
  };
};

reducers[ACTIONS.PURCHASE_URI_COMPLETED] = (state: State, action: any): State => {
  const { uri, purchaseReceipt } = action.data;

  let byId = Object.assign({}, state.byId);
  let byUri = Object.assign({}, state.claimsByUri);
  let myPurchases = state.myPurchases ? state.myPurchases.slice() : [];

  const claimId = byUri[uri];
  if (claimId) {
    let claim = byId[claimId];
    claim.purchase_receipt = purchaseReceipt;
  }

  myPurchases.push(uri);

  return {
    ...state,
    byId,
    myPurchases,
    purchaseUriSuccess: true,
  };
};

reducers[ACTIONS.PURCHASE_URI_FAILED] = (state: State): State => {
  return {
    ...state,
    purchaseUriSuccess: false,
  };
};

reducers[ACTIONS.CLEAR_PURCHASED_URI_SUCCESS] = (state: State): State => {
  return {
    ...state,
    purchaseUriSuccess: false,
  };
};

export function claimsReducer(state: State = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
