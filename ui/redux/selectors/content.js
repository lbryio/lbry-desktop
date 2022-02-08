// @flow
import { createSelector } from 'reselect';
import {
  makeSelectClaimForUri,
  selectClaimsByUri,
  selectClaimIsNsfwForUri,
  selectClaimIsMineForUri,
  makeSelectContentTypeForUri,
} from 'redux/selectors/claims';
import { makeSelectMediaTypeForUri, makeSelectFileNameForUri } from 'redux/selectors/file_info';
import { selectBalance } from 'redux/selectors/wallet';
import { selectCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import * as RENDER_MODES from 'constants/file_render_modes';
import path from 'path';
import { FORCE_CONTENT_TYPE_PLAYER, FORCE_CONTENT_TYPE_COMIC } from 'constants/claim';

const RECENT_HISTORY_AMOUNT = 10;
const HISTORY_ITEMS_PER_PAGE = 50;

type State = { claims: any, content: any };

export const selectState = (state: State) => state.content || {};

export const selectPlayingUri = (state: State) => selectState(state).playingUri;
export const selectPrimaryUri = (state: State) => selectState(state).primaryUri;
export const selectListLoop = (state: State) => selectState(state).loopList;
export const selectListShuffle = (state: State) => selectState(state).shuffleList;

export const makeSelectIsPlaying = (uri: string) =>
  createSelector(selectPrimaryUri, (primaryUri) => primaryUri === uri);

export const makeSelectIsUriCurrentlyPlaying = (uri: string) =>
  createSelector(selectPlayingUri, (playingUri) => playingUri && playingUri.uri === uri);

export const makeSelectIsPlayerFloating = (location: UrlLocation) =>
  createSelector(selectPrimaryUri, selectPlayingUri, (primaryUri, playingUri) => {
    if (!playingUri) return false;

    const { pathname, search } = location;
    const hasSecondarySource = Boolean(playingUri.source);
    const isComment = playingUri.source === 'comment';
    const isInlineSecondaryPlayer =
      hasSecondarySource && playingUri.uri !== primaryUri && pathname === playingUri.pathname;

    if (isComment && isInlineSecondaryPlayer && search && search !== '?view=discussion') return true;

    if (
      isInlineSecondaryPlayer ||
      (hasSecondarySource && !isComment ? playingUri.primaryUri === primaryUri : playingUri.uri === primaryUri)
    ) {
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

export const selectRecentHistory = createSelector(selectHistory, (history) => {
  return history.slice(0, RECENT_HISTORY_AMOUNT);
});

export const selectShouldObscurePreviewForUri = (state: State, uri: string) => {
  const showMatureContent = selectShowMatureContent(state);
  const isClaimMature = selectClaimIsNsfwForUri(state, uri);
  return isClaimMature && !showMatureContent;
};

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

export const selectInsufficientCreditsForUri = (state: State, uri: string) => {
  const isMine = selectClaimIsMineForUri(state, uri);
  const costInfo = selectCostInfoForUri(state, uri);
  const balance = selectBalance(state);
  return !isMine && costInfo && costInfo.cost > 0 && costInfo.cost > balance;
};
