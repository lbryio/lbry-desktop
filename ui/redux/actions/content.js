// @flow
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
import { doOpenModal, doAnalyticsView, doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import { makeSelectClaimForUri, selectClaimIsMineForUri, makeSelectClaimWasPurchased } from 'redux/selectors/claims';
import {
  makeSelectFileInfoForUri,
  selectFileInfosByOutpoint,
  makeSelectUriIsStreamable,
  selectDownloadingByOutpoint,
} from 'redux/selectors/file_info';
import { makeSelectUrlsForCollectionId } from 'redux/selectors/collections';
import { doToast } from 'redux/actions/notifications';
import { doPurchaseUri } from 'redux/actions/file';
import Lbry from 'lbry';
import * as SETTINGS from 'constants/settings';
import { selectCostInfoForUri, Lbryio } from 'lbryinc';
import { selectClientSetting, selectosNotificationsEnabled, selectDaemonSettings } from 'redux/selectors/settings';
import { selectIsActiveLivestreamForUri } from 'redux/selectors/livestream';

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
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_PRIMARY_URI,
      data: { uri },
    });
  };
}

export const doClearPlayingUri = () => (dispatch: Dispatch) => dispatch(doSetPlayingUri({ uri: null }));

export function doSetPlayingUri({
  uri,
  source,
  pathname,
  commentId,
  collectionId,
}: {
  uri: ?string,
  source?: string,
  commentId?: string,
  pathname?: string,
  collectionId?: string,
}) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_PLAYING_URI,
      data: { uri, source, pathname, commentId, collectionId },
    });
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

export function doUriInitiatePlay(uri: string, collectionId?: string, isPlayable?: boolean, isFloating?: boolean) {
  return (dispatch: Dispatch, getState: () => any) => {
    const state = getState();
    const isLive = selectIsActiveLivestreamForUri(state, uri);

    if (!isFloating) dispatch(doSetPrimaryUri(uri));

    if (isPlayable) {
      dispatch(doSetPlayingUri({ uri, collectionId }));
    }

    if (!isLive) dispatch(doPlayUri(uri, false, true, (fileInfo) => dispatch(doAnaltyicsPurchaseEvent(fileInfo))));
  };
}

export function doPlayUri(
  uri: string,
  skipCostCheck: boolean = false,
  saveFileOverride: boolean = false,
  cb?: () => void,
  hideFailModal: boolean = false
) {
  return (dispatch: Dispatch, getState: () => any) => {
    const state = getState();
    const isMine = selectClaimIsMineForUri(state, uri);
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const uriIsStreamable = makeSelectUriIsStreamable(uri)(state);
    const downloadingByOutpoint = selectDownloadingByOutpoint(state);
    const claimWasPurchased = makeSelectClaimWasPurchased(uri)(state);
    const alreadyDownloaded = fileInfo && (fileInfo.completed || (fileInfo.blobs_remaining === 0 && uriIsStreamable));
    const alreadyDownloading = fileInfo && !!downloadingByOutpoint[fileInfo.outpoint];

    if (!IS_WEB && (alreadyDownloading || alreadyDownloaded)) {
      return;
    }

    const daemonSettings = selectDaemonSettings(state);
    const costInfo = selectCostInfoForUri(state, uri);
    const cost = (costInfo && Number(costInfo.cost)) || 0;
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

export function doToggleLoopList(collectionId: string, loop: boolean, hideToast: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.TOGGLE_LOOP_LIST,
      data: { collectionId, loop },
    });
    if (!hideToast) {
      dispatch(
        doToast({
          message: loop ? __('Loop is on.') : __('Loop is off.'),
        })
      );
    }
  };
}

export function doToggleShuffleList(currentUri: string, collectionId: string, shuffle: boolean, hideToast: boolean) {
  return (dispatch: Dispatch, getState: () => any) => {
    if (shuffle) {
      const state = getState();
      const urls = makeSelectUrlsForCollectionId(collectionId)(state);

      let newUrls = urls
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);

      // the currently playing URI should be first in list or else
      // can get in strange position where it might be in the middle or last
      // and the shuffled list ends before scrolling through all entries
      if (currentUri && currentUri !== '') {
        newUrls.splice(newUrls.indexOf(currentUri), 1);
        newUrls.splice(0, 0, currentUri);
      }

      dispatch({
        type: ACTIONS.TOGGLE_SHUFFLE_LIST,
        data: { collectionId, newUrls },
      });
    } else {
      dispatch({
        type: ACTIONS.TOGGLE_SHUFFLE_LIST,
        data: { collectionId, newUrls: false },
      });
    }
    if (!hideToast) {
      dispatch(
        doToast({
          message: shuffle ? __('Shuffle is on.') : __('Shuffle is off.'),
        })
      );
    }
  };
}
