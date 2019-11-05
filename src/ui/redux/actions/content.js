// @flow
import * as SETTINGS from 'constants/settings';
import * as NOTIFICATION_TYPES from 'constants/subscriptions';
import { PAGE_SIZE } from 'constants/claim';
import * as MODALS from 'constants/modal_types';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
import { doOpenModal } from 'redux/actions/app';
import { push } from 'connected-react-router';
import { setSubscriptionLatest, doUpdateUnreadSubscriptions } from 'redux/actions/subscriptions';
import { makeSelectUnreadByChannel } from 'redux/selectors/subscriptions';
import {
  ACTIONS,
  Lbry,
  Lbryapi,
  makeSelectFileInfoForUri,
  selectFileInfosByOutpoint,
  makeSelectChannelForClaimUri,
  parseURI,
  doPurchaseUri,
  makeSelectUriIsStreamable,
  selectDownloadingByOutpoint,
  makeSelectClaimForUri,
} from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { makeSelectClientSetting, selectosNotificationsEnabled, selectDaemonSettings } from 'redux/selectors/settings';
import { formatLbryUriForWeb } from 'util/uri';

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
    }).then(([fileInfo]) => {
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
              dispatch(push(formatLbryUriForWeb(uri)));
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

export function doFetchClaimsByChannel(uri: string, page: number = 1, pageSize: number = PAGE_SIZE) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_CLAIMS_STARTED,
      data: { uri, page },
    });

    Lbry.claim_search({
      channel: uri,
      page,
      page_size: pageSize,
      valid_channel_signature: true,
      order_by: ['release_time'],
    }).then(result => {
      const { items: claimsInChannel, page: returnedPage } = result;

      if (claimsInChannel && claimsInChannel.length) {
        if (page === 1) {
          const latest = claimsInChannel[0];
          dispatch(
            setSubscriptionLatest(
              {
                channelName: latest.signing_channel.name,
                uri: latest.signing_channel.permanent_url,
              },
              latest.permanent_url
            )
          );
        }
      }

      dispatch({
        type: ACTIONS.FETCH_CHANNEL_CLAIMS_COMPLETED,
        data: {
          uri,
          claims: claimsInChannel || [],
          page: returnedPage || undefined,
        },
      });
    });
  };
}

export function doPurchaseUriWrapper(uri: string, cost: number, saveFile: boolean) {
  return (dispatch: Dispatch, getState: () => any) => {
    function onSuccess(fileInfo) {
      dispatch(doUpdateLoadStatus(uri, fileInfo.outpoint));
    }

    // Only pass the success callback if we are saving the file, otherwise we don't show the download percentage
    const successCallBack = saveFile ? onSuccess : undefined;
    dispatch(doPurchaseUri(uri, { costInfo: cost }, saveFile, successCallBack));
  };
}

export function doPlayUri(uri: string, skipCostCheck: boolean = false, saveFileOverride: boolean = false) {
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
      dispatch(doPurchaseUriWrapper(uri, cost, saveFile));
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

    if (instantPurchaseEnabled || instantPurchaseMax.currency === 'LBC') {
      attemptPlay(instantPurchaseMax.amount);
    } else {
      // Need to convert currency of instant purchase maximum before trying to play
      Lbryapi.getExchangeRates().then(({ LBC_USD }) => {
        attemptPlay(instantPurchaseMax.amount / LBC_USD);
      });
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

export function doSetHistoryPage(page: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_CONTENT_HISTORY_PAGE,
      data: { page },
    });
  };
}
