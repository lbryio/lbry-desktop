// @flow
import { createSelector } from 'reselect';
import {
  selectClaimsByUri,
  selectClaimIsNsfwForUri,
  selectClaimIsMineForUri,
  makeSelectContentTypeForUri,
  selectClaimForUri,
  selectCanonicalUrlForUri,
} from 'redux/selectors/claims';
import { makeSelectMediaTypeForUri, makeSelectFileNameForUri } from 'redux/selectors/file_info';
import { selectBalance } from 'redux/selectors/wallet';
import { selectCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import path from 'path';
import { FORCE_CONTENT_TYPE_PLAYER, FORCE_CONTENT_TYPE_COMIC } from 'constants/claim';

const RECENT_HISTORY_AMOUNT = 10;
const HISTORY_ITEMS_PER_PAGE = 50;

type State = { claims: any, content: ContentState, user: UserState };

export const selectState = (state: State) => state.content || {};

export const selectPlayingUri = (state: State) => selectState(state).playingUri;
export const selectPlayingCollection = (state: State) => selectPlayingUri(state).collection;
export const selectPlayingCollectionId = (state: State) => selectPlayingCollection(state).collectionId;
export const selectPrimaryUri = (state: State) => selectState(state).primaryUri;
export const selectLastViewedAnnouncement = (state: State) => selectState(state).lastViewedAnnouncement;
export const selectRecsysEntries = (state: State) => selectState(state).recsysEntries;

export const selectIsPlayingCollectionForId = (state: State, id: string) => selectPlayingCollectionId(state) === id;

export const selectPlayingCollectionIfPlayingForId = (state: State, id: string) => {
  const playingCollection = selectPlayingCollection(state);
  return playingCollection.collectionId === id && playingCollection;
};
export const selectIsCollectionPlayingForId = (state: State, id: string) =>
  Boolean(selectPlayingCollectionIfPlayingForId(state, id));

export const selectListShuffleForId = (state: State, id: string) => {
  const playingCollection = selectPlayingCollectionIfPlayingForId(state, id);
  return playingCollection && playingCollection.shuffle;
};
export const selectListIsShuffledForId = (state: State, id: string) => Boolean(selectListShuffleForId(state, id));

export const selectListIsLoopedForId = (state: State, id: string) => {
  const playingCollection = selectPlayingCollectionIfPlayingForId(state, id);
  return Boolean(playingCollection && playingCollection.loop);
};

export const makeSelectIsPlaying = (uri: string) =>
  createSelector(selectPrimaryUri, (primaryUri) => primaryUri === uri);

export const selectIsUriCurrentlyPlaying = (state: State, uri: string) => {
  const { uri: playingUrl } = selectPlayingUri(state);
  if (!playingUrl) return false;

  const canonicalUrl = selectCanonicalUrlForUri(state, uri);
  return canonicalUrl === playingUrl;
};

export const makeSelectIsPlayerFloating = (location: UrlLocation) =>
  createSelector(selectPrimaryUri, selectPlayingUri, (primaryUri, playingUri) => {
    if (!playingUri.uri) return false;

    const { source, uri, primaryUri: playingPrimaryUri, pathname: playingPathName, collection } = playingUri;

    const { pathname, search } = location;
    const urlParams = new URLSearchParams(search);
    const discussionPage = urlParams.get('view') === 'discussion';
    const pageCollectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

    const hasSecondarySource = Boolean(source);
    const isComment = source === 'comment';
    const isQueue = source === 'queue';
    const isInlineSecondaryPlayer = hasSecondarySource && uri !== primaryUri && playingPathName === pathname;

    if ((isQueue && primaryUri !== playingUri.uri) || (isComment && isInlineSecondaryPlayer && discussionPage)) {
      return true;
    }

    if (
      (isQueue && (primaryUri === uri || pageCollectionId !== collection.collectionId)) ||
      isInlineSecondaryPlayer ||
      (hasSecondarySource && !isComment && primaryUri ? playingPrimaryUri === primaryUri : uri === primaryUri)
    ) {
      return false;
    }

    return true;
  });

export const selectContentPositionForUri = (state: State, uri: string) => {
  const claim = selectClaimForUri(state, uri);
  if (claim) {
    const outpoint = `${claim.txid}:${claim.nout}`;
    const id = claim.claim_id;
    const positions = selectState(state).positions;
    return positions[id] ? positions[id][outpoint] : null;
  }
  return null;
};

export const selectHistory = (state: State) => selectState(state).history || [];

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

export const selectWatchHistoryUris = createSelector(selectHistory, (history) => {
  const uris = [];
  for (let entry of history) {
    if (entry.uri.indexOf('@') !== -1) {
      uris.push(entry.uri);
    }
  }
  return uris;
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
      if (mediaType === 'video' || FORCE_CONTENT_TYPE_PLAYER.includes(contentType) || mediaType === 'livestream') {
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
