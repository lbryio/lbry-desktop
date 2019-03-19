// @flow
import { createSelector } from 'reselect';
import {
  makeSelectClaimForUri,
  selectClaimsByUri,
  makeSelectClaimsInChannelForCurrentPage,
} from 'lbry-redux';
import { HISTORY_ITEMS_PER_PAGE } from 'constants/content';

export const selectState = (state: any) => state.content || {};

export const selectPlayingUri = createSelector(
  selectState,
  state => state.playingUri
);

export const selectRewardContentClaimIds = createSelector(
  selectState,
  state => state.rewardedContentClaimIds
);

export const makeSelectContentPositionForUri = (uri: string) =>
  createSelector(
    selectState,
    makeSelectClaimForUri(uri),
    (state, claim) => {
      if (!claim) {
        return null;
      }
      const outpoint = `${claim.txid}:${claim.nout}`;
      const id = claim.claim_id;
      return state.positions[id] ? state.positions[id][outpoint] : null;
    }
  );

export const selectHistoryPageCount = createSelector(
  selectState,
  state => Math.ceil(state.history.length / HISTORY_ITEMS_PER_PAGE)
);

export const makeSelectHistoryForPage = (page: number) =>
  createSelector(
    selectState,
    selectClaimsByUri,
    (state, claimsByUri) => {
      const left = page * HISTORY_ITEMS_PER_PAGE;
      const historyItems = state.history.slice(left, left + HISTORY_ITEMS_PER_PAGE);

      // See if we have the claim info for the uris in your history
      // If not, it will need to be fetched in the component
      return historyItems.map(historyItem => {
        const { uri, lastViewed } = historyItem;
        const claimAtUri = claimsByUri[uri];

        if (claimAtUri) {
          return { lastViewed, uri, ...claimAtUri };
        }
        return historyItem;
      });
    }
  );

export const makeSelectHistoryForUri = (uri: string) =>
  createSelector(
    selectState,
    state => state.history.find(i => i.uri === uri)
  );

export const makeSelectCategoryListUris = (uris: ?Array<string>, channel: string) =>
  createSelector(
    makeSelectClaimsInChannelForCurrentPage(channel),
    channelClaims => {
      if (uris) return uris;

      if (channelClaims) {
        const CATEGORY_LIST_SIZE = 10;
        return channelClaims
          .slice(0, CATEGORY_LIST_SIZE)
          .map(({ name, claim_id: claimId }) => `${name}#${claimId}`);
      }

      return null;
    }
  );
