// @flow
import * as ACTIONS from 'constants/action_types';
import * as SETTINGS from 'constants/settings';
import * as NOTIFICATION_TYPES from 'constants/subscriptions';
import * as MODALS from 'constants/modal_types';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
import { doOpenModal } from 'redux/actions/app';
import { push } from 'connected-react-router';
import { doUpdateUnreadSubscriptions } from 'redux/actions/subscriptions';
import { makeSelectUnreadByChannel } from 'redux/selectors/subscriptions';
import {
  Lbry,
  makeSelectFileInfoForUri,
  selectFileInfosByOutpoint,
  makeSelectChannelForClaimUri,
  parseURI,
  doPurchaseUri,
  makeSelectUriIsStreamable,
  selectDownloadingByOutpoint,
  makeSelectClaimForUri,
} from 'lbry-redux';
import { makeSelectCostInfoForUri, Lbryio } from 'lbryinc';
import { makeSelectClientSetting, selectosNotificationsEnabled, selectDaemonSettings } from 'redux/selectors/settings';
import { formatLbryUrlForWeb } from 'util/url';
import { selectFloatingUri } from 'redux/selectors/content';

const DOWNLOAD_POLL_INTERVAL = 250;

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
    }).then(result => {
      const { items: fileInfos } = result;
      const fileInfo = fileInfos[0];
      if (!fileInfo || fileInfo.written_bytes === 0) {
        // download hasn't started yet
        setNextStatusUpdate();
      } else if (fileInfo.completed) {
        const state = getState();
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

        const channelUri = makeSelectChannelForClaimUri(uri, true)(state);
        const { channelName } = parseURI(channelUri);
        const claimName = '@' + channelName;

        const unreadForChannel = makeSelectUnreadByChannel(channelUri)(state);
        if (unreadForChannel && unreadForChannel.type === NOTIFICATION_TYPES.DOWNLOADING) {
          const count = unreadForChannel.uris.length;

          if (selectosNotificationsEnabled(state)) {
            const notif = new window.Notification(claimName, {
              body: `Posted ${fileInfo.metadata.title}${
                count > 1 && count < 10 ? ` and ${count - 1} other new items` : ''
              }${count > 9 ? ' and 9+ other new items' : ''}`,
              silent: false,
            });
            notif.onclick = () => {
              dispatch(push(formatLbryUrlForWeb(uri)));
            };
          }

          dispatch(doUpdateUnreadSubscriptions(channelUri, null, NOTIFICATION_TYPES.DOWNLOADED));
        } else {
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
        }
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

export function doSetPlayingUri(uri: ?string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_PLAYING_URI,
      data: { uri },
    });
  };
}

export function doSetFloatingUri(uri: ?string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_FLOATING_URI,
      data: { uri },
    });
  };
}

export function doCloseFloatingPlayer() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const floatingUri = selectFloatingUri(state);

    if (floatingUri) {
      dispatch(doSetFloatingUri(null));
    } else {
      dispatch(doSetPlayingUri(null));
    }
  };
}

export function doPurchaseUriWrapper(uri: string, cost: number, saveFile: boolean, cb: ?() => void) {
  return (dispatch: Dispatch, getState: () => any) => {
    function onSuccess(fileInfo) {
      if (saveFile) {
        dispatch(doUpdateLoadStatus(uri, fileInfo.outpoint));
      }

      if (cb) {
        cb();
      }
    }

    dispatch(doPurchaseUri(uri, { costInfo: cost }, saveFile, onSuccess));
  };
}

export function doPlayUri(
  uri: string,
  skipCostCheck: boolean = false,
  saveFileOverride: boolean = false,
  cb?: () => void
) {
  return (dispatch: Dispatch, getState: () => any) => {
    const state = getState();
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const uriIsStreamable = makeSelectUriIsStreamable(uri)(state);
    const downloadingByOutpoint = selectDownloadingByOutpoint(state);
    const alreadyDownloaded = fileInfo && (fileInfo.completed || (fileInfo.blobs_remaining === 0 && uriIsStreamable));
    const alreadyDownloading = fileInfo && !!downloadingByOutpoint[fileInfo.outpoint];
    if (alreadyDownloading || alreadyDownloaded) {
      return;
    }

    const daemonSettings = selectDaemonSettings(state);
    const costInfo = makeSelectCostInfoForUri(uri)(state);
    const cost = (costInfo && Number(costInfo.cost)) || 0;
    const saveFile = !uriIsStreamable ? true : daemonSettings.save_files || saveFileOverride || cost > 0;
    const instantPurchaseEnabled = makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state);
    const instantPurchaseMax = makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state);

    function beginGetFile() {
      dispatch(doPurchaseUriWrapper(uri, cost, saveFile, cb));
    }

    function attemptPlay(instantPurchaseMax = null) {
      // If you have a file_list entry, you have already purchased the file
      if (!fileInfo && (!instantPurchaseMax || !instantPurchaseEnabled || cost > instantPurchaseMax)) {
        dispatch(doOpenModal(MODALS.AFFIRM_PURCHASE, { uri }));
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
