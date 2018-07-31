import { createSelector } from 'reselect';
import { makeSelectClaimForUri } from 'lbry-redux';
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

export const makeSelectHistoryForPage = (page = 1) =>
  createSelector(selectState, state =>
    state.history.slice((page - 1) * HISTORY_ITEMS_PER_PAGE, HISTORY_ITEMS_PER_PAGE)
  );

export const makeSelectHistoryForUri = uri =>
  createSelector(selectState, state => state.history.find(i => i.uri === uri));
