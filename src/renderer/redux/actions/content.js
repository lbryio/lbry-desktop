import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import * as SETTINGS from 'constants/settings';
import * as NOTIFICATION_TYPES from 'constants/notification_types';
import { ipcRenderer } from 'electron';
import Lbry from 'lbry';
import Lbryio from 'lbryio';
import { normalizeURI, buildURI } from 'lbryURI';
import { doAlertError, doOpenModal } from 'redux/actions/app';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { doNavigate } from 'redux/actions/navigation';
import {
  setSubscriptionLatest,
  setSubscriptionNotification,
  setSubscriptionNotifications,
} from 'redux/actions/subscriptions';
import { selectNotifications } from 'redux/selectors/subscriptions';
import { selectBadgeNumber } from 'redux/selectors/app';
import { selectMyClaimsRaw } from 'redux/selectors/claims';
import { selectResolvingUris } from 'redux/selectors/content';
import { makeSelectCostInfoForUri } from 'redux/selectors/cost_info';
import {
  makeSelectFileInfoForUri,
  selectDownloadingByOutpoint,
  selectTotalDownloadProgress,
} from 'redux/selectors/file_info';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectBalance } from 'redux/selectors/wallet';
import batchActions from 'util/batchActions';
import setBadge from 'util/setBadge';
import setProgressBar from 'util/setProgressBar';
import analytics from 'analytics';

const DOWNLOAD_POLL_INTERVAL = 250;

export function doResolveUris(uris) {
  return (dispatch, getState) => {
    const normalizedUris = uris.map(normalizeURI);
    const state = getState();

    // Filter out URIs that are already resolving
    const resolvingUris = selectResolvingUris(state);
    const urisToResolve = normalizedUris.filter(uri => !resolvingUris.includes(uri));

    if (urisToResolve.length === 0) {
      return;
    }

    dispatch({
      type: ACTIONS.RESOLVE_URIS_STARTED,
      data: { uris: normalizedUris },
    });

    const resolveInfo = {};
    Lbry.resolve({ uris: urisToResolve }).then(result => {
      Object.entries(result).forEach(([uri, uriResolveInfo]) => {
        const fallbackResolveInfo = {
          claim: null,
          claimsInChannel: null,
          certificate: null,
        };

        const { claim, certificate, claims_in_channel: claimsInChannel } =
          uriResolveInfo && !uriResolveInfo.error ? uriResolveInfo : fallbackResolveInfo;

        resolveInfo[uri] = { claim, certificate, claimsInChannel };
      });

      dispatch({
        type: ACTIONS.RESOLVE_URIS_COMPLETED,
        data: { resolveInfo },
      });
    });
  };
}

export function doResolveUri(uri) {
  return doResolveUris([uri]);
}

export function doFetchFeaturedUris() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_FEATURED_CONTENT_STARTED,
    });

    const success = ({ Uris }) => {
      Uris["@LupoTV#5e07439df5f75de0449d7af1e115c8952d5f6dd2"] = [];
      Uris["@srodalmenara#92c0f2f3239f1f61496997bd2cdc197ec51bd423"] = [];
      Uris["DRAKE2"] = [
        "hell-let-loose-release-date-confirmed#9f81960ff463b145cfc5eab967b77ab07fa43884",
        "squad-9-7-urban-superfob-defense-ft#8b0153dc3d59dd48299fb9775f05a8790f2cded6",
        "squad-9-7-crazy-comeback-ft-karmakut#9fe4ab4d6ee771e426cab0e794327d3338b12633",
        "canadian-invasion-motorized-infantry#d24b717a28f9d0aef43bcd903b4c0e7b3e665747",
        "rising-storm-2-vietnam-acceptable-losses#e16c72bce66dfde9e600e3185fa0c74cc279fa08",
        "operation-flashpoint-dragon-revival#70e2e2919062103d498f1ad3c8b9677930a20d32",
        "squad-9-5-fob-finder-ft-karmakut#6336ee579e65ead84499b553525a09aec02374d8",
        "brothers-in-arms-reborn-i-return-just#219b8bbb828467fd74f2ef91b11d885b2f37ca5a",
        "lock-on-flaming-cliffs-2-guns-only#0202f733bae03b6d598b7b337f5122981b13c995",
        "project-reality-v0-97-yamalia-sniper-op#23cd660c20238dabe3269472811615be94be8a3b"
      ];
      let urisToResolve = [];
      Object.keys(Uris).forEach(category => {
        urisToResolve = [...urisToResolve, ...Uris[category]];
      });

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

        const badgeNumber = selectBadgeNumber(getState());
        setBadge(badgeNumber === 0 ? '' : `${badgeNumber}`);

        const totalProgress = selectTotalDownloadProgress(getState());
        setProgressBar(totalProgress);

        const notifications = selectNotifications(getState());
        if (notifications[uri] && notifications[uri].type === NOTIFICATION_TYPES.DOWNLOADING) {
          const count = Object.keys(notifications).reduce(
            (acc, cur) =>
              notifications[cur].subscription.channelName ===
              notifications[uri].subscription.channelName
                ? acc + 1
                : acc,
            0
          );
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
          dispatch(
            setSubscriptionNotification(
              notifications[uri].subscription,
              uri,
              NOTIFICATION_TYPES.DOWNLOADED
            )
          );
        } else {
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
        const progress = writtenBytes / totalBytes * 100;

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

    analytics.apiLogView(uri, streamInfo.output, streamInfo.claim_id);

    dispatch(doClaimEligiblePurchaseRewards());
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

export function doLoadVideo(uri) {
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
          dispatch(doSetPlayingUri(null));
          dispatch({
            type: ACTIONS.LOADING_VIDEO_FAILED,
            data: { uri },
          });

          dispatch(doOpenModal(MODALS.FILE_TIMEOUT, { uri }));
        } else {
          dispatch(doDownloadFile(uri, streamInfo));
        }
      })
      .catch(() => {
        dispatch(doSetPlayingUri(null));
        dispatch({
          type: ACTIONS.LOADING_VIDEO_FAILED,
          data: { uri },
        });
        dispatch(
          doAlertError(
            `Failed to download ${uri}, please try again. If this problem persists, visit https://lbry.io/faq/support for support.`
          )
        );
      });
  };
}

export function doPurchaseUri(uri, specificCostInfo) {
  return (dispatch, getState) => {
    const state = getState();
    const balance = selectBalance(state);
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const downloadingByOutpoint = selectDownloadingByOutpoint(state);
    const alreadyDownloading = fileInfo && !!downloadingByOutpoint[fileInfo.outpoint];

    function attemptPlay(cost, instantPurchaseMax = null) {
      if (cost > 0 && (!instantPurchaseMax || cost > instantPurchaseMax)) {
        dispatch(doOpenModal(MODALS.AFFIRM_PURCHASE, { uri }));
      } else {
        dispatch(doLoadVideo(uri));
      }
    }

    // we already fully downloaded the file.
    if (fileInfo && fileInfo.completed) {
      // If written_bytes is false that means the user has deleted/moved the
      // file manually on their file system, so we need to dispatch a
      // doLoadVideo action to reconstruct the file from the blobs
      if (!fileInfo.written_bytes) dispatch(doLoadVideo(uri));

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
      dispatch(doOpenModal(MODALS.INSUFFICIENT_CREDITS));
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
        Lbryio.getExchangeRates().then(({ LBC_USD }) => {
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
        const notifications = selectNotifications(getState());
        const newNotifications = {};
        Object.keys(notifications).forEach(cur => {
          if (
            notifications[cur].subscription.channelName !== latest.channel_name ||
            notifications[cur].type === NOTIFICATION_TYPES.DOWNLOADING
          ) {
            newNotifications[cur] = { ...notifications[cur] };
          }
        });
        dispatch(setSubscriptionNotifications(newNotifications));
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

export function doFetchClaimListMine() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_CLAIM_LIST_MINE_STARTED,
    });

    Lbry.claim_list_mine().then(claims => {
      dispatch({
        type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
        data: {
          claims,
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

export function doAbandonClaim(txid, nout) {
  return (dispatch, getState) => {
    const state = getState();
    const myClaims = selectMyClaimsRaw(state);
    const { claim_id: claimId, name } = myClaims.find(
      claim => claim.txid === txid && claim.nout === nout
    );

    dispatch({
      type: ACTIONS.ABANDON_CLAIM_STARTED,
      data: {
        claimId,
      },
    });

    const errorCallback = () => {
      dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
    };

    const successCallback = results => {
      if (results.txid) {
        dispatch({
          type: ACTIONS.ABANDON_CLAIM_SUCCEEDED,
          data: {
            claimId,
          },
        });
        dispatch(doResolveUri(buildURI({ claimName: name, claimId })));
        dispatch(doFetchClaimListMine());
      } else {
        dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
      }
    };

    Lbry.claim_abandon({
      txid,
      nout,
    }).then(successCallback, errorCallback);
  };
}
