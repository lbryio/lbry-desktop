// @flow
import { createSelector } from 'reselect';
import {
  makeSelectClaimForUri,
  selectClaimsByUri,
  makeSelectClaimsInChannelForCurrentPageState,
  makeSelectClaimIsNsfw,
  makeSelectClaimIsMine,
  makeSelectMediaTypeForUri,
  selectBalance,
  parseURI,
  makeSelectContentTypeForUri,
  makeSelectFileNameForUri,
  selectClaimIdsByUri,
} from 'lbry-redux';
import { makeSelectRecommendedContentForUri } from 'redux/selectors/search';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectAllCostInfoByUri, makeSelectCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import * as RENDER_MODES from 'constants/file_render_modes';
import path from 'path';
import { FORCE_CONTENT_TYPE_PLAYER, FORCE_CONTENT_TYPE_COMIC } from 'constants/claim';

const RECENT_HISTORY_AMOUNT = 10;
const HISTORY_ITEMS_PER_PAGE = 50;

export const selectState = (state: any) => state.content || {};

export const selectPlayingUri = createSelector(selectState, (state) => state.playingUri);
export const selectPrimaryUri = createSelector(selectState, (state) => state.primaryUri);

export const selectListLoop = createSelector(selectState, (state) => state.loopList);

export const makeSelectIsPlaying = (uri: string) =>
  createSelector(selectPrimaryUri, (primaryUri) => primaryUri === uri);

export const makeSelectIsPlayerFloating = (location: UrlLocation) =>
  createSelector(selectPrimaryUri, selectPlayingUri, selectClaimsByUri, (primaryUri, playingUri, claimsByUri) => {
    const isInlineSecondaryPlayer =
      playingUri &&
      playingUri.uri !== primaryUri &&
      location.pathname === playingUri.pathname &&
      (playingUri.source === 'comment' || playingUri.source === 'markdown');

    if ((playingUri && playingUri.uri === primaryUri) || isInlineSecondaryPlayer) {
      return false;
    }

    return true;
  });

export const makeSelectContentPositionForUri = (uri: string) =>
  createSelector(selectState, makeSelectClaimForUri(uri), (state, claim) => {
    if (!claim) {
      return null;
    }
    const outpoint = `${claim.txid}:${claim.nout}`;
    const id = claim.claim_id;
    return state.positions[id] ? state.positions[id][outpoint] : null;
  });

export const selectHistory = createSelector(selectState, (state) => state.history || []);

export const selectHistoryPageCount = createSelector(selectHistory, (history) =>
  Math.ceil(history.length / HISTORY_ITEMS_PER_PAGE)
);

export const makeSelectHistoryForPage = (page: number) =>
  createSelector(selectHistory, selectClaimsByUri, (history, claimsByUri) => {
    const left = page * HISTORY_ITEMS_PER_PAGE;
    const historyItemsForPage = history.slice(left, left + HISTORY_ITEMS_PER_PAGE);
    return historyItemsForPage;
  });

export const makeSelectHistoryForUri = (uri: string) =>
  createSelector(selectHistory, (history) => history.find((i) => i.uri === uri));

export const makeSelectHasVisitedUri = (uri: string) =>
  createSelector(makeSelectHistoryForUri(uri), (history) => Boolean(history));

export const makeSelectNextUnplayedRecommended = (uri: string) =>
  createSelector(
    makeSelectRecommendedContentForUri(uri),
    selectHistory,
    selectClaimsByUri,
    selectAllCostInfoByUri,
    selectMutedChannels,
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
          const claim = claimsByUri[recommendedUri];

          if (!claim) {
            continue;
          }

          const { isChannel } = parseURI(recommendedUri);
          if (isChannel) {
            continue;
          }

          const costInfo = costInfoByUri[recommendedUri];
          if (!costInfo || costInfo.cost !== 0) {
            continue;
          }

          // We already check if it's a channel above
          // $FlowFixMe
          const isVideo = claim.value && claim.value.stream_type === 'video';
          // $FlowFixMe
          const isAudio = claim.value && claim.value.stream_type === 'audio';
          if (!isVideo && !isAudio) {
            continue;
          }

          const channel = claim && claim.signing_channel;
          if (channel && blockedChannels.some((blockedUri) => blockedUri === channel.permanent_url)) {
            continue;
          }

          const recommendedUriInfo = parseURI(recommendedUri);
          const recommendedUriShort = recommendedUriInfo.claimName + '#' + recommendedUriInfo.claimId.substring(0, 1);

          if (claimsByUri[uri] && claimsByUri[uri].claim_id === recommendedUriInfo.claimId) {
            // Skip myself (same claim ID)
            continue;
          }

          if (
            !history.some((h) => {
              const directMatch = h.uri === recommendedForUri[i];
              const shortUriMatch = h.uri.includes(recommendedUriShort);
              const idMatch = claimsByUri[h.uri] && claimsByUri[h.uri].claim_id === recommendedUriInfo.claimId;

              return directMatch || shortUriMatch || idMatch;
            })
          ) {
            return recommendedForUri[i];
          }
        }
      }
    }
  );

export const selectRecentHistory = createSelector(selectHistory, (history) => {
  return history.slice(0, RECENT_HISTORY_AMOUNT);
});

export const makeSelectCategoryListUris = (uris: ?Array<string>, channel: string) =>
  createSelector(makeSelectClaimsInChannelForCurrentPageState(channel), (channelClaims) => {
    if (uris) return uris;

    if (channelClaims) {
      const CATEGORY_LIST_SIZE = 10;
      return channelClaims.slice(0, CATEGORY_LIST_SIZE).map(({ name, claim_id: claimId }) => `${name}#${claimId}`);
    }

    return null;
  });

export const makeSelectShouldObscurePreview = (uri: string) =>
  createSelector(selectShowMatureContent, makeSelectClaimIsNsfw(uri), (showMatureContent, isClaimMature) => {
    return isClaimMature && !showMatureContent;
  });

// should probably be in lbry-redux, yarn link was fighting me
export const makeSelectFileExtensionForUri = (uri: string) =>
  createSelector(makeSelectFileNameForUri(uri), (fileName) => {
    return fileName && path.extname(fileName).substring(1);
  });

export const makeSelectFileRenderModeForUri = (uri: string) =>
  createSelector(
    makeSelectContentTypeForUri(uri),
    makeSelectMediaTypeForUri(uri),
    makeSelectFileExtensionForUri(uri),
    (contentType, mediaType, extension) => {
      if (mediaType === 'video' || FORCE_CONTENT_TYPE_PLAYER.includes(contentType)) {
        return RENDER_MODES.VIDEO;
      }
      if (mediaType === 'audio') {
        return RENDER_MODES.AUDIO;
      }
      if (mediaType === 'image') {
        return RENDER_MODES.IMAGE;
      }
      if (['md', 'markdown'].includes(extension) || ['text/md', 'text/markdown'].includes(contentType)) {
        return RENDER_MODES.MARKDOWN;
      }
      if (contentType === 'application/pdf') {
        return RENDER_MODES.PDF;
      }
      if (['text/htm', 'text/html'].includes(contentType)) {
        return RENDER_MODES.HTML;
      }
      if (['text', 'document', 'script'].includes(mediaType)) {
        return RENDER_MODES.DOCUMENT;
      }
      if (extension === 'docx') {
        return RENDER_MODES.DOCX;
      }

      // when writing this my local copy of Lbry.getMediaType had '3D-file', but I was receiving model...'
      if (['3D-file', 'model'].includes(mediaType)) {
        return RENDER_MODES.CAD;
      }
      // Force content type for fallback support of older claims
      if (mediaType === 'comic-book' || FORCE_CONTENT_TYPE_COMIC.includes(contentType)) {
        return RENDER_MODES.COMIC;
      }
      if (
        [
          'application/zip',
          'application/x-gzip',
          'application/x-gtar',
          'application/x-tgz',
          'application/vnd.rar',
          'application/x-7z-compressed',
        ].includes(contentType)
      ) {
        return RENDER_MODES.DOWNLOAD;
      }

      if (mediaType === 'application') {
        return RENDER_MODES.APPLICATION;
      }

      return RENDER_MODES.UNSUPPORTED;
    }
  );

export const makeSelectInsufficientCreditsForUri = (uri: string) =>
  createSelector(
    makeSelectClaimIsMine(uri),
    makeSelectCostInfoForUri(uri),
    selectBalance,
    (isMine, costInfo, balance) => {
      return !isMine && costInfo && costInfo.cost > 0 && costInfo.cost > balance;
    }
  );

export const makeSelectRecommendationId = (claimId: string) =>
  createSelector(selectState, (state) => state.recommendationId[claimId]);

export const makeSelectRecommendationParentId = (claimId: string) =>
  createSelector(selectState, (state) => state.recommendationParentId[claimId]);

export const makeSelectRecommendedClaimIds = (claimId: string) =>
  createSelector(selectState, selectClaimIdsByUri, (state, claimIdsByUri) => {
    const recommendationUrls = state.recommendationUrls[claimId];
    if (recommendationUrls) {
      return recommendationUrls.map((url) => claimIdsByUri[url]);
    }
    return undefined;
  });

export const makeSelectRecommendationClicks = (claimId: string) =>
  createSelector(selectState, (state) => state.recommendationClicks[claimId]);
