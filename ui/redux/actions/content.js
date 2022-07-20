// @flow
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { COL_TYPES } from 'constants/collections';
import * as PAGES from 'constants/pages';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
import { push } from 'connected-react-router';
import { doOpenModal, doAnalyticsView, doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import {
  makeSelectClaimForUri,
  selectClaimIsMineForUri,
  selectClaimWasPurchasedForUri,
  selectPermanentUrlForUri,
  selectCanonicalUrlForUri,
  selectClaimForUri,
} from 'redux/selectors/claims';
import {
  makeSelectFileInfoForUri,
  selectFileInfosByOutpoint,
  makeSelectUriIsStreamable,
} from 'redux/selectors/file_info';
import {
  selectUrlsForCollectionId,
  selectCollectionForIdHasClaimUrl,
  selectFirstItemUrlForCollection,
} from 'redux/selectors/collections';
import { doCollectionEdit, doLocalCollectionCreate } from 'redux/actions/collections';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { doToast } from 'redux/actions/notifications';
import { doPurchaseUri } from 'redux/actions/file';
import { doGetClaimFromUriResolve } from 'redux/actions/claims';
import Lbry from 'lbry';
import RecSys from 'recsys';
import * as SETTINGS from 'constants/settings';
import { selectCostInfoForUri, Lbryio, doFetchCostInfoForUri } from 'lbryinc';
import { selectClientSetting, selectosNotificationsEnabled, selectDaemonSettings } from 'redux/selectors/settings';
import { selectIsActiveLivestreamForUri } from 'redux/selectors/livestream';
import {
  selectRecsysEntries,
  selectPlayingUri,
  selectListIsShuffledForId,
  selectListIsLoopedForId,
  selectPlayingCollectionId,
  selectIsUriCurrentlyPlaying,
  makeSelectIsPlayerFloating,
} from 'redux/selectors/content';
import { isCanonicalUrl } from 'util/claim';

const DOWNLOAD_POLL_INTERVAL = 1000;

export function doUpdateLoadStatus(uri: string, outpoint: string) {
  // Updates the loading status for a uri as it's downloading
  // Calls file_list and checks the written_bytes value to see if the number has increased
  // Not needed on web as users aren't actually downloading the file
  // @if TARGET='app'
  return (dispatch: Dispatch, getState: GetState) => {
    const setNextStatusUpdate = () =>
      setTimeout(() => {
        // We need to check if outpoint still exists first because user are able to delete file (outpoint) while downloading.
        // If a file is already deleted, no point to still try update load status
        const byOutpoint = selectFileInfosByOutpoint(getState());
        if (byOutpoint[outpoint]) {
          dispatch(doUpdateLoadStatus(uri, outpoint));
        }
      }, DOWNLOAD_POLL_INTERVAL);

    Lbry.file_list({
      outpoint,
      full_status: true,
      page: 1,
      page_size: 1,
    }).then((result) => {
      const { items: fileInfos } = result;
      const fileInfo = fileInfos[0];
      if (!fileInfo || fileInfo.written_bytes === 0) {
        // download hasn't started yet
        setNextStatusUpdate();
      } else if (fileInfo.completed) {
        // TODO this isn't going to get called if they reload the client before
        // the download finished
        dispatch({
          type: ACTIONS.DOWNLOADING_COMPLETED,
          data: {
            uri,
            outpoint,
            fileInfo,
          },
        });

        // If notifications are disabled(false) just return
        if (!selectosNotificationsEnabled(getState()) || !fileInfo.written_bytes) return;

        const notif = new window.Notification(__('LBRY Download Complete'), {
          body: fileInfo.metadata.title,
          silent: false,
        });

        // @if TARGET='app'
        notif.onclick = () => {
          ipcRenderer.send('focusWindow', 'main');
        };
        // @ENDIF
      } else {
        // ready to play
        const { total_bytes: totalBytes, written_bytes: writtenBytes } = fileInfo;
        const progress = (writtenBytes / totalBytes) * 100;

        dispatch({
          type: ACTIONS.DOWNLOADING_PROGRESSED,
          data: {
            uri,
            outpoint,
            fileInfo,
            progress,
          },
        });

        setNextStatusUpdate();
      }
    });
  };
  // @endif
}

export function doSetPrimaryUri(uri: ?string) {
  return async (dispatch: Dispatch, getState: GetState) => {
    let url = uri;

    if (uri && !isCanonicalUrl(uri)) {
      // -- sanitization --
      // only set canonical urls
      const state = getState();
      url = selectCanonicalUrlForUri(state, uri);

      if (!url) {
        const claim = await dispatch(doGetClaimFromUriResolve(url));
        if (claim) url = claim.canonical_url;
      }
      // -------------------
    }

    dispatch({
      type: ACTIONS.SET_PRIMARY_URI,
      data: { uri: url },
    });
  };
}

export const doClearPlayingUri = () => (dispatch: Dispatch) => dispatch(doSetPlayingUri({ uri: null, collection: {} }));
export const doClearPlayingCollection = () => (dispatch: Dispatch) =>
  dispatch(doChangePlayingUriParam({ collection: { collectionId: null } }));

export const doPopOutInlinePlayer = ({ source }: { source: string }) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const isFloating = makeSelectIsPlayerFloating(window.location)(state);
  const playingUri = selectPlayingUri(state);

  if (playingUri.source === source && !isFloating) {
    const floatingPlayerEnabled = selectClientSetting(state, SETTINGS.FLOATING_PLAYER);

    if (floatingPlayerEnabled) return dispatch(doChangePlayingUriParam({ source: null }));

    return dispatch(doClearPlayingUri());
  }
};

export function doSetPlayingUri({ uri, source, sourceId, location, commentId, collection }: PlayingUri) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    let url = uri;

    if (uri && !isCanonicalUrl(uri)) {
      // -- sanitization --
      // only set canonical urls
      if (uri) {
        url = selectCanonicalUrlForUri(state, uri);

        if (!url) {
          const claim = await dispatch(doGetClaimFromUriResolve(url));
          if (claim) url = claim.canonical_url;
        }
      }
      // -------------------
    }

    dispatch({
      type: ACTIONS.SET_PLAYING_URI,
      data: { uri: url, source, sourceId, location, commentId, collection },
    });
  };
}

export function doChangePlayingUriParam(newParams: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const playingUri = selectPlayingUri(state);

    return dispatch(doSetPlayingUri({ ...playingUri, ...newParams }));
  };
}

export function doPurchaseUriWrapper(uri: string, cost: number, saveFile: boolean, cb: ?(GetResponse) => void) {
  return (dispatch: Dispatch, getState: () => any) => {
    function onSuccess(fileInfo) {
      if (saveFile) {
        dispatch(doUpdateLoadStatus(uri, fileInfo.outpoint));
      }

      if (cb) {
        cb(fileInfo);
      }
    }

    dispatch(doPurchaseUri(uri, { cost }, saveFile, onSuccess));
  };
}

export function doDownloadUri(uri: string) {
  return (dispatch: Dispatch) => dispatch(doPlayUri(uri, false, true, () => dispatch(doAnalyticsView(uri))));
}

export function doUriInitiatePlay(
  playingOptions: PlayingUri,
  isPlayable?: boolean,
  isFloating?: boolean,
  cb?: (url: string) => void
) {
  return async (dispatch: Dispatch, getState: () => any) => {
    const { uri: url, source, collection } = playingOptions;

    const state = getState();

    let uri = url;
    if (url && !isCanonicalUrl(url)) {
      // -- sanitization --
      // only set canonical urls
      uri = selectCanonicalUrlForUri(state, url);

      if (!uri) {
        const claim = await dispatch(doGetClaimFromUriResolve(url));
        if (claim) uri = claim.canonical_url;
      }
      // -------------------
    }

    if (!uri) return;

    if (!isFloating && (!source || source === COLLECTIONS_CONSTS.QUEUE_ID)) dispatch(doSetPrimaryUri(uri));

    const isLive = selectIsActiveLivestreamForUri(state, uri);
    let willPlayCollection;

    if (isPlayable) {
      const willPlayCollection = Boolean(collection.collectionId);
      const playingUri = selectPlayingUri(state);
      const playingCollection = playingUri.collection;
      const playingOtherThanCurrentQueue =
        collection.collectionId !== COLLECTIONS_CONSTS.QUEUE_ID &&
        playingCollection.collectionId === COLLECTIONS_CONSTS.QUEUE_ID;

      if (playingOtherThanCurrentQueue) {
        // If the current playing uri is from Queue mode and the next isn't, it will continue playing on queue
        // until the player is closed or the page is refreshed, and queue is cleared
        const permanentUrl = selectPermanentUrlForUri(state, uri);
        const hasClaimInQueue = selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, permanentUrl);
        const itemsToAdd = !willPlayCollection
          ? hasClaimInQueue
            ? undefined
            : [permanentUrl]
          : selectUrlsForCollectionId(state, collection.collectionId || '').filter(
              (url) => !selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, url)
            );

        if (itemsToAdd) {
          dispatch(doCollectionEdit(COLLECTIONS_CONSTS.QUEUE_ID, { uris: [...itemsToAdd], type: COL_TYPES.PLAYLIST }));
        }
        dispatch(doChangePlayingUriParam({ ...playingOptions, collection: { ...playingCollection } }));
      } else {
        if (collection.collectionId === playingCollection.collectionId) {
          // keep current playingCollection data like loop or shuffle if plpaying the same
          dispatch(doChangePlayingUriParam({ ...playingOptions, collection: { ...playingCollection, ...collection } }));
        } else {
          dispatch(doChangePlayingUriParam({ ...playingOptions, collection: willPlayCollection ? collection : {} }));
        }
      }
    }

    if (!isLive) {
      const isAuthenticated = selectUserVerifiedEmail(state);
      const playCb = isAuthenticated ? (fileInfo) => dispatch(doAnaltyicsPurchaseEvent(fileInfo)) : undefined;
      dispatch(doPlayUri(uri, false, true, playCb, willPlayCollection));
    }

    if (cb) cb(uri);
  };
}

export function doPlaylistAddAndAllowPlaying({
  uri,
  collectionName,
  collectionId: id,
  createNew,
  push: pushPlay,
}: {
  uri?: string,
  collectionName: string,
  collectionId?: string,
  createNew?: boolean,
  push?: (uri: string) => void,
}) {
  return (dispatch: Dispatch, getState: () => any) => {
    const state = getState();
    const remove = Boolean(id && uri && selectCollectionForIdHasClaimUrl(state, id, uri));

    let collectionId = id;
    if (createNew) {
      dispatch(
        doLocalCollectionCreate(
          { name: collectionName, items: uri ? [uri] : [], type: COL_TYPES.PLAYLIST },
          (newId) => {
            collectionId = newId;
          }
        )
      );
    } else if (collectionId && uri) {
      if (collectionId === COLLECTIONS_CONSTS.QUEUE_ID) {
        const playingUri = selectPlayingUri(state);
        const { collectionId: playingCollectionId } = playingUri.collection || {};
        const { permanent_url: playingUrl } = selectClaimForUri(state, playingUri.uri) || {};

        // $FlowFixMe
        const playingCollectionUrls = selectUrlsForCollectionId(state, playingCollectionId);
        const itemsToAdd = playingCollectionUrls || [playingUrl];
        const hasPlayingUriInQueue = Boolean(
          playingUrl && selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, playingUrl)
        );
        // $FlowFixMe
        const hasClaimInQueue = selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, uri);

        dispatch(
          doCollectionEdit(COLLECTIONS_CONSTS.QUEUE_ID, {
            uris: playingUrl && playingUrl !== uri && !hasPlayingUriInQueue ? [...itemsToAdd, uri] : [uri],
            remove: hasClaimInQueue,
            type: COL_TYPES.PLAYLIST,
          })
        );
      } else {
        dispatch(doCollectionEdit(collectionId, { uris: [uri], remove, type: COL_TYPES.PLAYLIST }));
      }
    }

    if (!uri && createNew) return;

    const collectionPlayingId = selectPlayingCollectionId(state);
    const playingUri = selectPlayingUri(state);
    const isUriPlaying = uri && selectIsUriCurrentlyPlaying(state, uri);
    const firstItemUri = selectFirstItemUrlForCollection(state, collectionId);

    const isPlayingCollection = collectionPlayingId && collectionId && collectionPlayingId === collectionId;
    const hasItemPlaying = playingUri.uri && !isUriPlaying;
    const floatingPlayerEnabled =
      playingUri.collection.collectionId === 'queue' || selectClientSetting(state, SETTINGS.FLOATING_PLAYER);

    const startPlaying = () => {
      if (isUriPlaying) {
        dispatch(doChangePlayingUriParam({ collection: { collectionId } }));
      } else {
        dispatch(
          doUriInitiatePlay(
            { uri: createNew ? uri : firstItemUri, collection: { collectionId } },
            true,
            true,
            !floatingPlayerEnabled && pushPlay ? (url) => pushPlay(url) : undefined
          )
        );
      }
    };

    if (collectionId === COLLECTIONS_CONSTS.QUEUE_ID) {
      const { permanent_url: playingUrl } = selectClaimForUri(state, playingUri.uri) || {};
      const hasPlayingUriInQueue = Boolean(
        playingUrl && selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, playingUrl)
      );
      // $FlowFixMe
      const hasClaimInQueue = selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, uri);
      if (!hasClaimInQueue) {
        const paramsToAdd = {
          collection: { collectionId: COLLECTIONS_CONSTS.QUEUE_ID },
          source: COLLECTIONS_CONSTS.QUEUE_ID,
        };

        if (playingUrl) {
          // adds the queue collection id to the playingUri data so it can be used and updated by other components
          if (!hasPlayingUriInQueue) dispatch(doChangePlayingUriParam({ ...paramsToAdd }));
        } else {
          // There is nothing playing and added a video to queue -> the first item will play on the floating player with the list open
          dispatch(doUriInitiatePlay({ uri, ...paramsToAdd }, true, true));
        }
      }
    } else {
      const handleEdit = () =>
        // $FlowFixMe
        dispatch(push({ pathname: `/$/${PAGES.PLAYLIST}/${collectionId}`, state: { showEdit: true } }));

      dispatch(
        doToast({
          message: __(remove ? 'Removed from %playlist_name%' : 'Added to %playlist_name%', {
            playlist_name: collectionName,
          }),
          actionText: isPlayingCollection || hasItemPlaying || remove ? __('Edit Playlist') : __('Start Playing'),
          action: isPlayingCollection || hasItemPlaying || remove ? handleEdit : startPlaying,
          secondaryActionText: isPlayingCollection || hasItemPlaying || remove ? undefined : __('Edit Playlist'),
          secondaryAction: isPlayingCollection || hasItemPlaying || remove ? undefined : handleEdit,
        })
      );
    }
  };
}

export function doPlayUri(
  url: string,
  skipCostCheck: boolean = false,
  saveFileOverride: boolean = false,
  cb?: () => void,
  hideFailModal: boolean = false
) {
  return async (dispatch: Dispatch, getState: () => any) => {
    const state = getState();

    let uri = url;
    if (url && !isCanonicalUrl(url)) {
      // -- sanitization --
      // only set canonical urls
      uri = selectCanonicalUrlForUri(state, url);

      if (!uri) {
        const claim = await dispatch(doGetClaimFromUriResolve(url));
        if (claim) url = claim.canonical_url;
      }
      // -------------------
    }

    const isMine = selectClaimIsMineForUri(state, uri);
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const uriIsStreamable = makeSelectUriIsStreamable(uri)(state);
    const claimWasPurchased = selectClaimWasPurchasedForUri(state, uri);

    const daemonSettings = selectDaemonSettings(state);
    let costInfo = selectCostInfoForUri(state, uri);
    if (!costInfo) {
      costInfo = await dispatch(doFetchCostInfoForUri(uri));
    }
    const cost = costInfo && Number(costInfo.cost);
    const saveFile = !IS_WEB && (!uriIsStreamable ? true : daemonSettings.save_files || saveFileOverride || cost > 0);
    const instantPurchaseEnabled = selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_ENABLED);
    const instantPurchaseMax = selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_MAX);

    function beginGetFile() {
      dispatch(doPurchaseUriWrapper(uri, cost, saveFile, cb));
    }

    function attemptPlay(instantPurchaseMax = null) {
      // If you have a file_list entry, you have already purchased the file
      if (
        !isMine &&
        !fileInfo &&
        !claimWasPurchased &&
        (!instantPurchaseMax || !instantPurchaseEnabled || cost > instantPurchaseMax)
      ) {
        if (!hideFailModal) dispatch(doOpenModal(MODALS.AFFIRM_PURCHASE, { uri }));
      } else {
        beginGetFile();
      }
    }

    if (fileInfo && saveFile && (!fileInfo.download_path || !fileInfo.written_bytes)) {
      beginGetFile();
      return;
    }

    if (cost === 0 || skipCostCheck) {
      beginGetFile();
      return;
    }

    if (instantPurchaseEnabled) {
      if (instantPurchaseMax.currency === 'LBC') {
        attemptPlay(instantPurchaseMax.amount);
      } else {
        // Need to convert currency of instant purchase maximum before trying to play
        Lbryio.getExchangeRates().then(({ LBC_USD }) => {
          attemptPlay(instantPurchaseMax.amount / LBC_USD);
        });
      }
    } else {
      attemptPlay();
    }
  };
}

export function savePosition(uri: string, position: number) {
  return (dispatch: Dispatch, getState: () => any) => {
    const state = getState();
    const claim = makeSelectClaimForUri(uri)(state);
    const { claim_id: claimId, txid, nout } = claim;
    const outpoint = `${txid}:${nout}`;

    try {
      localStorage.setItem(
        ACTIONS.SET_CONTENT_POSITION,
        JSON.stringify({
          claimId,
          outpoint,
          position,
        })
      );
    } catch (e) {
      console.error('localStorage not available');
    }

    dispatch({
      type: ACTIONS.SET_CONTENT_POSITION,
      data: { claimId, outpoint, position },
    });
  };
}

export function clearPosition(uri: string) {
  return (dispatch: Dispatch, getState: () => any) => {
    const state = getState();
    const claim = makeSelectClaimForUri(uri)(state);
    const { claim_id: claimId, txid, nout } = claim;
    const outpoint = `${txid}:${nout}`;

    dispatch({
      type: ACTIONS.CLEAR_CONTENT_POSITION,
      data: { claimId, outpoint },
    });
  };
}

export function doSetContentHistoryItem(uri: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_CONTENT_LAST_VIEWED,
      data: { uri, lastViewed: Date.now() },
    });
  };
}

export function doClearContentHistoryUri(uri: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.CLEAR_CONTENT_HISTORY_URI,
      data: { uri },
    });
  };
}

export function doClearContentHistoryAll() {
  return (dispatch: Dispatch) => {
    dispatch({ type: ACTIONS.CLEAR_CONTENT_HISTORY_ALL });
  };
}

export const doRecommendationUpdate = (claimId: string, urls: Array<string>, id: string, parentId: string) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: ACTIONS.RECOMMENDATION_UPDATED,
    data: { claimId, urls, id, parentId },
  });
};

export const doRecommendationClicked = (claimId: string, index: number) => (dispatch: Dispatch) => {
  if (index !== undefined && index !== null) {
    dispatch({
      type: ACTIONS.RECOMMENDATION_CLICKED,
      data: { claimId, index },
    });
  }
};

export const doToggleLoopList = (params: { collectionId: string, hideToast?: boolean }) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const { collectionId, hideToast } = params;
  const state = getState();
  const playingUri = selectPlayingUri(state);
  const { collection: playingCollection } = playingUri;
  const loopOn = selectListIsLoopedForId(state, collectionId);

  dispatch(doChangePlayingUriParam({ collection: { ...playingCollection, collectionId, loop: !loopOn } }));

  if (!hideToast) {
    return dispatch(doToast({ message: !loopOn ? __('Loop is on.') : __('Loop is off.') }));
  }
};

export const doToggleShuffleList = (params: { currentUri?: string, collectionId: string, hideToast?: boolean }) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const { currentUri, collectionId, hideToast } = params;
  const state = getState();
  const playingUri = selectPlayingUri(state);
  const { collection: playingCollection } = playingUri;
  // const collectionIsPlaying = selectIsCollectionPlayingForId(state, collectionId);
  const listIsShuffledForId = selectListIsShuffledForId(state, collectionId);

  if (!listIsShuffledForId) {
    const urls = selectUrlsForCollectionId(state, collectionId);

    let newUrls = urls
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);

    // the currently playing URI should be first in list or else
    // can get in strange position where it might be in the middle or last
    // and the shuffled list ends before scrolling through all entries
    if (currentUri) {
      newUrls.splice(newUrls.indexOf(currentUri), 1);
      newUrls.splice(0, 0, currentUri);
    }

    dispatch(doChangePlayingUriParam({ collection: { ...playingCollection, collectionId, shuffle: { newUrls } } }));
  } else {
    dispatch(doChangePlayingUriParam({ collection: { ...playingCollection, collectionId, shuffle: undefined } }));
  }

  if (!hideToast) {
    return dispatch(doToast({ message: !listIsShuffledForId ? __('Shuffle is on.') : __('Shuffle is off.') }));
  }
};

export function doSetLastViewedAnnouncement(hash: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_LAST_VIEWED_ANNOUNCEMENT,
      data: hash,
    });
  };
}

export function doSetRecsysEntries(entries: { [ClaimId]: RecsysEntry }) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_RECSYS_ENTRIES,
      data: entries,
    });
  };
}

/**
 * Sends any lingering recsys entries from the previous session and deletes it.
 *
 * Should only be called on startup, before a new cycle of recsys data is
 * collected.
 *
 * @returns {(function(Dispatch, GetState): void)|*}
 */
export function doSendPastRecsysEntries() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const entries = selectRecsysEntries(state);
    if (entries) {
      RecSys.sendEntries(entries, true);
    }
  };
}
