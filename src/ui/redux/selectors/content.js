// @flow
import { createSelector } from 'reselect';
import {
  makeSelectClaimForUri,
  selectClaimsByUri,
  makeSelectClaimsInChannelForCurrentPageState,
  makeSelectClaimIsNsfw,
} from 'lbry-redux';
import { selectShowMatureContent } from 'redux/selectors/settings';

const RECENT_HISTORY_AMOUNT = 10;
const HISTORY_ITEMS_PER_PAGE = 50;

export const selectState = (state: any) => state.content || {};

export const selectPlayingUri = createSelector(
  selectState,
  state => state.playingUri
);

export const makeSelectIsPlaying = (uri: string) =>
  createSelector(
    selectPlayingUri,
    playingUri => playingUri === uri
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

export const selectHistory = createSelector(
  selectState,
  state => state.history || []
);

export const selectHistoryPageCount = createSelector(
  selectHistory,
  history => Math.ceil(history.length / HISTORY_ITEMS_PER_PAGE)
);

export const makeSelectHistoryForPage = (page: number) =>
  createSelector(
    selectHistory,
    selectClaimsByUri,
    (history, claimsByUri) => {
      const left = page * HISTORY_ITEMS_PER_PAGE;
      const historyItemsForPage = history.slice(left, left + HISTORY_ITEMS_PER_PAGE);
      return historyItemsForPage;
    }
  );

export const makeSelectHistoryForUri = (uri: string) =>
  createSelector(
    selectHistory,
    history => history.find(i => i.uri === uri)
  );

export const makeSelectHasVisitedUri = (uri: string) =>
  createSelector(
    makeSelectHistoryForUri(uri),
    history => Boolean(history)
  );

export const selectRecentHistory = createSelector(
  selectHistory,
  history => {
    return history.slice(0, RECENT_HISTORY_AMOUNT);
  }
);

export const makeSelectCategoryListUris = (uris: ?Array<string>, channel: string) =>
  createSelector(
    makeSelectClaimsInChannelForCurrentPageState(channel),
    channelClaims => {
      if (uris) return uris;

      if (channelClaims) {
        const CATEGORY_LIST_SIZE = 10;
        return channelClaims.slice(0, CATEGORY_LIST_SIZE).map(({ name, claim_id: claimId }) => `${name}#${claimId}`);
      }

      return null;
    }
  );

export const makeSelectShouldObscurePreview = (uri: string) =>
  createSelector(
    selectShowMatureContent,
    makeSelectClaimIsNsfw(uri),
    (showMatureContent, isClaimMature) => {
      return isClaimMature && !showMatureContent;
    }
  );
