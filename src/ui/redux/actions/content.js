// @flow
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
  SETTINGS,
  Lbry,
  Lbryapi,
  buildURI,
  makeSelectFileInfoForUri,
  selectFileInfosByOutpoint,
  selectDownloadingByOutpoint,
  selectBalance,
  makeSelectChannelForClaimUri,
  parseURI,
  creditsToString,
  doError,
} from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { makeSelectClientSetting, selectosNotificationsEnabled } from 'redux/selectors/settings';
import analytics from 'analytics';
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
        const { claimName: channelName } = parseURI(channelUri);

        const unreadForChannel = makeSelectUnreadByChannel(channelUri)(state);
        if (unreadForChannel && unreadForChannel.type === NOTIFICATION_TYPES.DOWNLOADING) {
          const count = unreadForChannel.uris.length;

          if (selectosNotificationsEnabled(state)) {
            const notif = new window.Notification(channelName, {
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
          if (!selectosNotificationsEnabled(getState())) return;

          const notif = new window.Notification('LBRY Download Complete', {
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

export function doStartDownload(uri: string, outpoint: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();

    if (!outpoint) {
      throw new Error('outpoint is required to begin a download');
    }

    const { downloadingByOutpoint = {} } = state.fileInfo;

    if (downloadingByOutpoint[outpoint]) return;

    Lbry.file_list({ outpoint, full_status: true }).then(([fileInfo]) => {
      dispatch({
        type: ACTIONS.DOWNLOADING_STARTED,
        data: {
          uri,
          outpoint,
          fileInfo,
        },
      });

      dispatch(doUpdateLoadStatus(uri, outpoint));
    });
  };
}

export function doDownloadFile(uri: string, streamInfo: { outpoint: string }) {
  return (dispatch: Dispatch) => {
    dispatch(doStartDownload(uri, streamInfo.outpoint));
  };
}

export function doSetPlayingUri(uri: ?string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.SET_PLAYING_URI,
      data: { uri },
    });
  };
}

function handleLoadVideoError(uri: string, errorType: string = '') {
  return (dispatch: Dispatch, getState: GetState) => {
    // suppress error when another media is playing
    const { playingUri } = getState().content;
    const errorText = typeof errorType === 'object' ? errorType.message : errorType;
    if (playingUri && playingUri === uri) {
      dispatch({
        type: ACTIONS.LOADING_VIDEO_FAILED,
        data: { uri },
      });
      dispatch(doSetPlayingUri(null));
      // this is not working, but should be it's own separate modal in the future (https://github.com/lbryio/lbry-desktop/issues/892)
      if (errorType === 'timeout') {
        doOpenModal(MODALS.FILE_TIMEOUT, { uri });
      } else {
        dispatch(
          doError(
            `Failed to download ${uri}, please try again or see error details:\n\n${errorText}\n\nIf this problem persists, visit https://lbry.com/faq/support for help. `
          )
        );
      }
    }
  };
}

export function doLoadVideo(uri: string, shouldRecordViewEvent: boolean = false) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.LOADING_VIDEO_STARTED,
      data: {
        uri,
      },
    });

    Lbry.get({ uri })
      .then(streamInfo => {
        // need error code from SDK to capture properly
        const timeout =
          streamInfo === null || typeof streamInfo !== 'object' || streamInfo.error === 'Timeout';

        if (timeout) {
          dispatch(handleLoadVideoError(uri, 'timeout'));
        } else {
          dispatch(doDownloadFile(uri, streamInfo));

          if (shouldRecordViewEvent) {
            analytics.apiLogView(
              `${streamInfo.claim_name}#${streamInfo.claim_id}`,
              streamInfo.outpoint,
              streamInfo.claim_id
            );
          }
        }
      })
      .catch(error => {
        dispatch(handleLoadVideoError(uri, error));
      });
  };
}

export function doPurchaseUri(
  uri: string,
  specificCostInfo?: ?{},
  shouldRecordViewEvent?: boolean = false
) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const balance = selectBalance(state);
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const downloadingByOutpoint = selectDownloadingByOutpoint(state);
    const alreadyDownloading = fileInfo && !!downloadingByOutpoint[fileInfo.outpoint];

    function attemptPlay(cost, instantPurchaseMax = null) {
      // If you have a file entry with correct manifest, you won't pay for the key fee again
      if (cost > 0 && (!instantPurchaseMax || cost > instantPurchaseMax) && !fileInfo) {
        dispatch(doOpenModal(MODALS.AFFIRM_PURCHASE, { uri }));
      } else {
        dispatch(doLoadVideo(uri, shouldRecordViewEvent));
      }
    }

    // we already fully downloaded the file.
    if (fileInfo && fileInfo.completed) {
      // If path is null or bytes written is 0 means the user has deleted/moved the
      // file manually on their file system, so we need to dispatch a
      // doLoadVideo action to reconstruct the file from the blobs
      if (!fileInfo.download_path || !fileInfo.written_bytes) {
        dispatch(doLoadVideo(uri, shouldRecordViewEvent));
      }

      Promise.resolve();
      return;
    }

    // we are already downloading the file
    if (alreadyDownloading) {
      Promise.resolve();
      return;
    }

    const costInfo = makeSelectCostInfoForUri(uri)(state) || specificCostInfo;
    const { cost } = costInfo;

    if (cost > balance) {
      dispatch(doSetPlayingUri(null));
      Promise.resolve();
      return;
    }

    if (cost === 0 || !makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state)) {
      attemptPlay(cost);
    } else {
      const instantPurchaseMax = makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state);
      if (instantPurchaseMax.currency === 'LBC') {
        attemptPlay(cost, instantPurchaseMax.amount);
      } else {
        // Need to convert currency of instant purchase maximum before trying to play
        Lbryapi.getExchangeRates().then(({ LBC_USD }) => {
          attemptPlay(cost, instantPurchaseMax.amount / LBC_USD);
        });
      }
    }
  };
}

export function doFetchClaimsByChannel(
  uri: string,
  page: number = 1,
  pageSize: number = PAGE_SIZE
) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_CLAIMS_STARTED,
      data: { uri, page },
    });

    // TODO: can we keep uri?
    // claim_search should accept a uri (this allows for fetching vanity channel content)
    const { claimId } = parseURI(uri);

    Lbry.claim_search({ channel_id: claimId, page, page_size: pageSize }).then(result => {
      const { items: claimsInChannel, page: returnedPage } = result;

      if (claimsInChannel && claimsInChannel.length) {
        if (page === 1) {
          const latest = claimsInChannel[0];
          dispatch(
            setSubscriptionLatest(
              {
                channelName: latest.channel_name,
                uri: buildURI(
                  {
                    contentName: latest.channel_name,
                    claimId: latest.claim_id,
                  },
                  false
                ),
              },
              buildURI({ contentName: latest.name, claimId: latest.claim_id }, false)
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

export function doPlayUri(uri: string) {
  return (dispatch: Dispatch) => {
    dispatch(doSetPlayingUri(uri));
    // @if TARGET='app'
    dispatch(doPurchaseUri(uri));
    // @endif
  };
}

export function savePosition(claimId: string, outpoint: string, position: number) {
  return (dispatch: Dispatch) => {
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
