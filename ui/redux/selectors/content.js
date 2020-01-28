// @flow
import { createSelector } from 'reselect';
import {
  makeSelectClaimForUri,
  selectClaimsByUri,
  makeSelectClaimsInChannelForCurrentPageState,
  makeSelectClaimIsNsfw,
  makeSelectRecommendedContentForUri,
  makeSelectMediaTypeForUri,
  selectBlockedChannels,
  parseURI,
} from 'lbry-redux';
import { selectAllCostInfoByUri } from 'lbryinc';
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

export const makeSelectNextUnplayedRecommended = (uri: string) =>
  createSelector(
    makeSelectRecommendedContentForUri(uri),
    selectHistory,
    selectClaimsByUri,
    selectAllCostInfoByUri,
    selectBlockedChannels,
    (
      recommendedForUri: Array<string>,
      history: Array<{ uri: string }>,
      claimsByUri: { [string]: ?Claim },
      costInfoByUri: { [string]: { cost: 0 | string } },
      blockedChannels: Array<string>
    ) => {
      if (recommendedForUri) {
        // Make sure we don't autoplay paid content, channels, or content from blocked channels
        for (let i = 0; i < recommendedForUri.length; i++) {
          const recommendedUri = recommendedForUri[i];

          const { isChannel } = parseURI(recommendedUri);
          if (isChannel) {
            continue;
          }

          const costInfo = costInfoByUri[recommendedUri];
          if (!costInfo || costInfo.cost !== 0) {
            continue;
          }

          const claim = claimsByUri[recommendedUri];
          const channel = claim && claim.signing_channel;
          if (channel && blockedChannels.find(blockedUri => blockedUri === channel.permanent_url)) {
            continue;
          }

          if (!history.find(item => item.uri === recommendedForUri[i])) {
            return recommendedForUri[i];
          }
        }
      }
    }
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

export const makeSelectCanAutoplay = (uri: string) =>
  createSelector(
    makeSelectMediaTypeForUri(uri),
    mediaType => {
      const canAutoPlay = ['audio', 'video', 'image', 'text', 'document'].includes(mediaType);
      return canAutoPlay;
    }
  );

export const makeSelectIsText = (uri: string) =>
  createSelector(
    makeSelectMediaTypeForUri(uri),
    mediaType => {
      const isText = ['text', 'document'].includes(mediaType);
      return isText;
    }
  );
