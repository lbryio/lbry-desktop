import { createSelector } from 'reselect';
import { makeSelectClaimForUri, selectClaimsByUri } from 'lbry-redux';
import { HISTORY_ITEMS_PER_PAGE } from 'constants/content';

export const selectState = state => state.content || {};

export const selectFeaturedUris = createSelector(selectState, state => state.featuredUris);

export const selectFetchingFeaturedUris = createSelector(
  selectState,
  state => state.fetchingFeaturedContent
);

export const selectPlayingUri = createSelector(selectState, state => state.playingUri);

export const selectChannelClaimCounts = createSelector(
  selectState,
  state => state.channelClaimCounts || {}
);

export const makeSelectTotalItemsForChannel = uri =>
  createSelector(selectChannelClaimCounts, byUri => byUri && byUri[uri]);

export const makeSelectTotalPagesForChannel = uri =>
  createSelector(
    selectChannelClaimCounts,
    byUri => byUri && byUri[uri] && Math.ceil(byUri[uri] / 10)
  );

export const selectRewardContentClaimIds = createSelector(
  selectState,
  state => state.rewardedContentClaimIds
);

export const makeSelectContentPositionForUri = uri =>
  createSelector(selectState, makeSelectClaimForUri(uri), (state, claim) => {
    if (!claim) {
      return null;
    }
    const outpoint = `${claim.txid}:${claim.nout}`;
    const id = claim.claim_id;
    return state.positions[id] ? state.positions[id][outpoint] : null;
  });

export const selectHistoryPageCount = createSelector(selectState, state =>
  Math.ceil(state.history.length / HISTORY_ITEMS_PER_PAGE)
);

export const makeSelectHistoryForPage = page =>
  createSelector(selectState, selectClaimsByUri, (state, claimsByUri) => {
    const left = page * HISTORY_ITEMS_PER_PAGE;
    const historyItems = state.history.slice(left, left + HISTORY_ITEMS_PER_PAGE);
    
    // See if we have the claim info for the uris in your history
    // If not, it will need to be fetched in the component
    return historyItems.map((historyItem) => {
      const { uri, lastViewed } = historyItem;
      const claimAtUri = claimsByUri[uri];
      
      if (claimAtUri) {
        return { lastViewed, uri, ...claimAtUri }
      } else {
        console.log("jsut returning item")
        return historyItem;
      }
    })
  });

export const makeSelectHistoryForUri = uri =>
  createSelector(selectState, state => state.history.find(i => i.uri === uri));
