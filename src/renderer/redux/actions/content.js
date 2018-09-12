// @flow
import * as NOTIFICATION_TYPES from 'constants/notification_types';
import { ipcRenderer } from 'electron';
import Lbryio from 'lbryio';
import { doAlertError } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import {
  setSubscriptionLatest,
  setSubscriptionNotification,
  setSubscriptionNotifications,
} from 'redux/actions/subscriptions';
import { selectNotifications } from 'redux/selectors/subscriptions';
import { selectBadgeNumber } from 'redux/selectors/app';
import {
  ACTIONS,
  SETTINGS,
  Lbry,
  Lbryapi,
  buildURI,
  batchActions,
  doResolveUris,
  doFetchClaimListMine,
  makeSelectCostInfoForUri,
  makeSelectFileInfoForUri,
  selectDownloadingByOutpoint,
  selectTotalDownloadProgress,
  selectBalance,
  MODALS,
  doNotify,
} from 'lbry-redux';
import { makeSelectClientSetting, selectosNotificationsEnabled } from 'redux/selectors/settings';
import setBadge from 'util/setBadge';
import setProgressBar from 'util/setProgressBar';
import analytics from 'analytics';

const DOWNLOAD_POLL_INTERVAL = 250;

export function doFetchFeaturedUris() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_FEATURED_CONTENT_STARTED,
    });

    const success = ({ Uris }) => {
      const urisToResolve = Object.keys(Uris).reduce(
        (resolve, category) => [...resolve, ...Uris[category]],
        []
      );

      const actions = [
        doResolveUris(urisToResolve),
        {
          type: ACTIONS.FETCH_FEATURED_CONTENT_COMPLETED,
          data: {
            uris: Uris,
            success: true,
          },
        },
      ];
      dispatch(batchActions(...actions));
    };

    const failure = () => {
      dispatch({
        type: ACTIONS.FETCH_FEATURED_CONTENT_COMPLETED,
        data: {
          uris: {},
        },
      });
    };

    Lbryio.call('file', 'list_homepage').then(success, failure);
  };
}

export function doFetchRewardedContent() {
  return dispatch => {
    const success = nameToClaimId => {
      dispatch({
        type: ACTIONS.FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: Object.values(nameToClaimId),
          success: true,
        },
      });
    };

    const failure = () => {
      dispatch({
        type: ACTIONS.FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: [],
          success: false,
        },
      });
    };

    Lbryio.call('reward', 'list_featured').then(success, failure);
  };
}

export function doUpdateLoadStatus(uri, outpoint) {
  return (dispatch, getState) => {
    Lbry.file_list({
      outpoint,
      full_status: true,
    }).then(([fileInfo]) => {
      if (!fileInfo || fileInfo.written_bytes === 0) {
        // download hasn't started yet
        setTimeout(() => {
          dispatch(doUpdateLoadStatus(uri, outpoint));
        }, DOWNLOAD_POLL_INTERVAL);
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

        const badgeNumber = selectBadgeNumber(state);
        setBadge(badgeNumber === 0 ? '' : `${badgeNumber}`);

        const totalProgress = selectTotalDownloadProgress(state);
        setProgressBar(totalProgress);

        const notifications = selectNotifications(state);
        if (notifications[uri] && notifications[uri].type === NOTIFICATION_TYPES.DOWNLOADING) {
          const count = Object.keys(notifications).reduce(
            (acc, cur) =>
              notifications[cur].subscription.channelName ===
              notifications[uri].subscription.channelName
                ? acc + 1
                : acc,
            0
          );

          if (selectosNotificationsEnabled(state)) {
            const notif = new window.Notification(notifications[uri].subscription.channelName, {
              body: `Posted ${fileInfo.metadata.title}${
                count > 1 && count < 10 ? ` and ${count - 1} other new items` : ''
              }${count > 9 ? ' and 9+ other new items' : ''}`,
              silent: false,
            });
            notif.onclick = () => {
              dispatch(
                doNavigate('/show', {
                  uri,
                })
              );
            };
          }
          if (state.navigation.currentPath !== '/subscriptions') {
            dispatch(
              setSubscriptionNotification(
                notifications[uri].subscription,
                uri,
                NOTIFICATION_TYPES.DOWNLOADED
              )
            );
          }
        } else {
          // If notifications are disabled(false) just return
          if (!selectosNotificationsEnabled(getState())) return;
          const notif = new window.Notification('LBRY Download Complete', {
            body: fileInfo.metadata.title,
            silent: false,
          });
          notif.onclick = () => {
            ipcRenderer.send('focusWindow', 'main');
          };
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

        const totalProgress = selectTotalDownloadProgress(getState());
        setProgressBar(totalProgress);

        setTimeout(() => {
          dispatch(doUpdateLoadStatus(uri, outpoint));
        }, DOWNLOAD_POLL_INTERVAL);
      }
    });
  };
}

export function doStartDownload(uri, outpoint) {
  return (dispatch, getState) => {
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

export function doDownloadFile(uri, streamInfo) {
  return dispatch => {
    dispatch(doStartDownload(uri, streamInfo.outpoint));
  };
}

export function doSetPlayingUri(uri) {
  return dispatch => {
    dispatch({
      type: ACTIONS.SET_PLAYING_URI,
      data: { uri },
    });
  };
}

function handleLoadVideoError(uri, errorType = '') {
  return (dispatch, getState) => {
    // suppress error when another media is playing
    const { playingUri } = getState().content;
    if (playingUri && playingUri === uri) {
      dispatch({
        type: ACTIONS.LOADING_VIDEO_FAILED,
        data: { uri },
      });
      dispatch(doSetPlayingUri(null));
      if (errorType === 'timeout') {
        doNotify({ id: MODALS.FILE_TIMEOUT }, { uri });
      } else {
        dispatch(
          doAlertError(
            `Failed to download ${uri}, please try again. If this problem persists, visit https://lbry.io/faq/support for support.`
          )
        );
      }
    }
  };
}

export function doLoadVideo(uri, shouldRecordViewEvent) {
  return dispatch => {
    dispatch({
      type: ACTIONS.LOADING_VIDEO_STARTED,
      data: {
        uri,
      },
    });

    Lbry.get({ uri })
      .then(streamInfo => {
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
      .catch(() => {
        dispatch(handleLoadVideoError(uri));
      });
  };
}

export function doPurchaseUri(uri, specificCostInfo, shouldRecordViewEvent) {
  return (dispatch, getState) => {
    const state = getState();
    const balance = selectBalance(state);
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const downloadingByOutpoint = selectDownloadingByOutpoint(state);
    const alreadyDownloading = fileInfo && !!downloadingByOutpoint[fileInfo.outpoint];

    function attemptPlay(cost, instantPurchaseMax = null) {
      if (cost > 0 && (!instantPurchaseMax || cost > instantPurchaseMax)) {
        dispatch(doNotify({ id: MODALS.AFFIRM_PURCHASE }, { uri }));
      } else {
        dispatch(doLoadVideo(uri, shouldRecordViewEvent));
      }
    }

    // we already fully downloaded the file.
    if (fileInfo && fileInfo.completed) {
      // If written_bytes is false that means the user has deleted/moved the
      // file manually on their file system, so we need to dispatch a
      // doLoadVideo action to reconstruct the file from the blobs
      if (!fileInfo.written_bytes) dispatch(doLoadVideo(uri, shouldRecordViewEvent));

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
      dispatch(doNotify({ id: MODALS.INSUFFICIENT_CREDITS }));
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

export function doFetchClaimsByChannel(uri, page) {
  return (dispatch, getState) => {
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_CLAIMS_STARTED,
      data: { uri, page },
    });

    Lbry.claim_list_by_channel({ uri, page: page || 1 }).then(result => {
      const claimResult = result[uri] || {};
      const { claims_in_channel: claimsInChannel, returned_page: returnedPage } = claimResult;

      if (claimsInChannel && claimsInChannel.length) {
        const latest = claimsInChannel[0];
        dispatch(
          setSubscriptionLatest(
            {
              channelName: latest.channel_name,
              uri: buildURI(
                {
                  contentName: latest.channel_name,
                  claimId: latest.value.publisherSignature.certificateId,
                },
                false
              ),
            },
            buildURI({ contentName: latest.name, claimId: latest.claim_id }, false)
          )
        );
        // commented out as a note for @sean, notification will be clared individually
        // const notifications = selectNotifications(getState());
        // const newNotifications = {};
        // Object.keys(notifications).forEach(cur => {
        //   if (
        //     notifications[cur].subscription.channelName !== latest.channel_name ||
        //     notifications[cur].type === NOTIFICATION_TYPES.DOWNLOADING
        //   ) {
        //     newNotifications[cur] = { ...notifications[cur] };
        //   }
        // });
        // dispatch(setSubscriptionNotifications(newNotifications));
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

export function doFetchClaimCountByChannel(uri) {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_CLAIM_COUNT_STARTED,
      data: { uri },
    });

    Lbry.claim_list_by_channel({ uri }).then(result => {
      const claimResult = result[uri];
      const totalClaims = claimResult ? claimResult.claims_in_channel : 0;

      dispatch({
        type: ACTIONS.FETCH_CHANNEL_CLAIM_COUNT_COMPLETED,
        data: {
          uri,
          totalClaims,
        },
      });
    });
  };
}

export function doPlayUri(uri) {
  return dispatch => {
    dispatch(doSetPlayingUri(uri));
    dispatch(doPurchaseUri(uri));
  };
}

export function doFetchChannelListMine() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_LIST_STARTED,
    });

    const callback = channels => {
      dispatch({
        type: ACTIONS.FETCH_CHANNEL_LIST_COMPLETED,
        data: { claims: channels },
      });
    };

    Lbry.channel_list().then(callback);
  };
}

export function doCreateChannel(name, amount) {
  return dispatch => {
    dispatch({
      type: ACTIONS.CREATE_CHANNEL_STARTED,
    });

    return new Promise((resolve, reject) => {
      Lbry.channel_new({
        channel_name: name,
        amount: parseFloat(amount),
      }).then(
        newChannelClaim => {
          const channelClaim = newChannelClaim;
          channelClaim.name = name;
          dispatch({
            type: ACTIONS.CREATE_CHANNEL_COMPLETED,
            data: { channelClaim },
          });
          resolve(channelClaim);
        },
        error => {
          reject(error);
        }
      );
    });
  };
}

export function doPublish(params) {
  return dispatch =>
    new Promise((resolve, reject) => {
      const success = claim => {
        resolve(claim);

        if (claim === true) dispatch(doFetchClaimListMine());
        else
          setTimeout(() => dispatch(doFetchClaimListMine()), 20000, {
            once: true,
          });
      };
      const failure = err => reject(err);

      Lbry.publishDeprecated(params, null, success, failure);
    });
}

export function savePosition(claimId: string, outpoint: string, position: number) {
  return dispatch => {
    dispatch({
      type: ACTIONS.SET_CONTENT_POSITION,
      data: { claimId, outpoint, position },
    });
  };
}

export function doSetContentHistoryItem(uri: string) {
  return dispatch => {
    dispatch({
      type: ACTIONS.SET_CONTENT_LAST_VIEWED,
      data: { uri, lastViewed: Date.now() },
    });
  };
}

export function doClearContentHistoryUri(uri: string) {
  return dispatch => {
    dispatch({
      type: ACTIONS.CLEAR_CONTENT_HISTORY_URI,
      data: { uri },
    });
  };
}

export function doClearContentHistoryAll() {
  return dispatch => {
    dispatch({ type: ACTIONS.CLEAR_CONTENT_HISTORY_ALL });
  };
}

export function doSetHistoryPage(page) {
  return dispatch => {
    dispatch({
      type: ACTIONS.SET_CONTENT_HISTORY_PAGE,
      data: { page },
    });
  };
}
