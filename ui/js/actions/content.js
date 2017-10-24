import * as types from "constants/action_types";
import * as settings from "constants/settings";
import lbry from "lbry";
import lbryio from "lbryio";
import lbryuri from "lbryuri";
import { makeSelectClientSetting } from "selectors/settings";
import { selectBalance } from "selectors/wallet";
import {
  makeSelectFileInfoForUri,
  selectDownloadingByOutpoint,
} from "selectors/file_info";
import { selectResolvingUris } from "selectors/content";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { doAlertError, doOpenModal } from "actions/app";
import { doClaimEligiblePurchaseRewards } from "actions/rewards";
import { selectBadgeNumber } from "selectors/app";
import { selectTotalDownloadProgress } from "selectors/file_info";
import setBadge from "util/setBadge";
import setProgressBar from "util/setProgressBar";
import batchActions from "util/batchActions";
import * as modals from "constants/modal_types";

const { ipcRenderer } = require("electron");

const DOWNLOAD_POLL_INTERVAL = 250;

export function doResolveUris(uris) {
  return function(dispatch, getState) {
    uris = uris.map(lbryuri.normalize);
    const state = getState();

    // Filter out URIs that are already resolving
    const resolvingUris = selectResolvingUris(state);
    const urisToResolve = uris.filter(uri => !resolvingUris.includes(uri));

    if (urisToResolve.length === 0) {
      return;
    }

    dispatch({
      type: types.RESOLVE_URIS_STARTED,
      data: { uris },
    });

    let resolveInfo = {};
    lbry.resolve({ uris: urisToResolve }).then(result => {
      for (let [uri, uriResolveInfo] of Object.entries(result)) {
        const fallbackResolveInfo = {
          claim: null,
          claims_in_channel: null,
          certificate: null,
        };

        const { claim, certificate, claims_in_channel } = uriResolveInfo &&
          !uriResolveInfo.error
          ? uriResolveInfo
          : fallbackResolveInfo;
        resolveInfo[uri] = { claim, certificate, claims_in_channel };
      }

      dispatch({
        type: types.RESOLVE_URIS_COMPLETED,
        data: { resolveInfo },
      });
    });
  };
}

export function doResolveUri(uri) {
  return doResolveUris([uri]);
}

export function doFetchFeaturedUris() {
  return function(dispatch, getState) {
    const state = getState();

    dispatch({
      type: types.FETCH_FEATURED_CONTENT_STARTED,
    });

    const success = ({ Categories, Uris }) => {
      let featuredUris = {};
      let urisToResolve = [];
      Categories.forEach(category => {
        if (Uris[category] && Uris[category].length) {
          const uris = Uris[category];

          featuredUris[category] = uris;
          urisToResolve = [...urisToResolve, ...uris];
        }
      });

      const actions = [
        doResolveUris(urisToResolve),
        {
          type: types.FETCH_FEATURED_CONTENT_COMPLETED,
          data: {
            categories: Categories,
            uris: featuredUris,
            success: true,
          },
        },
      ];
      dispatch(batchActions(...actions));
    };

    const failure = () => {
      dispatch({
        type: types.FETCH_FEATURED_CONTENT_COMPLETED,
        data: {
          categories: [],
          uris: {},
        },
      });
    };

    lbryio
      .call("file", "list_homepage", { version: "early-access" })
      .then(success, failure);
  };
}

export function doFetchRewardedContent() {
  return function(dispatch, getState) {
    const state = getState();

    const success = nameToClaimId => {
      dispatch({
        type: types.FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: Object.values(nameToClaimId),
          success: true,
        },
      });
    };

    const failure = () => {
      dispatch({
        type: types.FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: [],
          success: false,
        },
      });
    };

    lbryio.call("reward", "list_featured").then(success, failure);
  };
}

export function doUpdateLoadStatus(uri, outpoint) {
  return function(dispatch, getState) {
    const state = getState();

    lbry
      .file_list({
        outpoint: outpoint,
        full_status: true,
      })
      .then(([fileInfo]) => {
        if (!fileInfo || fileInfo.written_bytes == 0) {
          // download hasn't started yet
          setTimeout(() => {
            dispatch(doUpdateLoadStatus(uri, outpoint));
          }, DOWNLOAD_POLL_INTERVAL);
        } else if (fileInfo.completed) {
          // TODO this isn't going to get called if they reload the client before
          // the download finished
          dispatch({
            type: types.DOWNLOADING_COMPLETED,
            data: {
              uri,
              outpoint,
              fileInfo,
            },
          });

          const badgeNumber = selectBadgeNumber(getState());
          setBadge(badgeNumber === 0 ? "" : `${badgeNumber}`);

          const totalProgress = selectTotalDownloadProgress(getState());
          setProgressBar(totalProgress);

          const notif = new window.Notification("LBRY Download Complete", {
            body: fileInfo.metadata.stream.metadata.title,
            silent: false,
          });
          notif.onclick = () => {
            ipcRenderer.send("focusWindow", "main");
          };
        } else {
          // ready to play
          const { total_bytes, written_bytes } = fileInfo;
          const progress = written_bytes / total_bytes * 100;

          dispatch({
            type: types.DOWNLOADING_PROGRESSED,
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
  return function(dispatch, getState) {
    const state = getState();

    if (!outpoint) {
      throw new Error("outpoint is required to begin a download");
    }

    const { downloadingByOutpoint = {} } = state.fileInfo;

    if (downloadingByOutpoint[outpoint]) return;

    lbry.file_list({ outpoint, full_status: true }).then(([fileInfo]) => {
      dispatch({
        type: types.DOWNLOADING_STARTED,
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
  return function(dispatch, getState) {
    const state = getState();

    dispatch(doStartDownload(uri, streamInfo.outpoint));

    lbryio
      .call("file", "view", {
        uri: uri,
        outpoint: streamInfo.outpoint,
        claim_id: streamInfo.claim_id,
      })
      .catch(() => {});

    dispatch(doClaimEligiblePurchaseRewards());
  };
}

export function doLoadVideo(uri) {
  return function(dispatch, getState) {
    const state = getState();

    dispatch({
      type: types.LOADING_VIDEO_STARTED,
      data: {
        uri,
      },
    });

    lbry
      .get({ uri })
      .then(streamInfo => {
        const timeout =
          streamInfo === null ||
          typeof streamInfo !== "object" ||
          streamInfo.error == "Timeout";

        if (timeout) {
          dispatch(doSetPlayingUri(null));
          dispatch({
            type: types.LOADING_VIDEO_FAILED,
            data: { uri },
          });

          dispatch(doOpenModal(modals.FILE_TIMEOUT, { uri }));
        } else {
          dispatch(doDownloadFile(uri, streamInfo));
        }
      })
      .catch(error => {
        dispatch(doSetPlayingUri(null));
        dispatch({
          type: types.LOADING_VIDEO_FAILED,
          data: { uri },
        });
        dispatch(doAlertError(error));
      });
  };
}

export function doPurchaseUri(uri) {
  return function(dispatch, getState) {
    const state = getState();
    const balance = selectBalance(state);
    const fileInfo = makeSelectFileInfoForUri(uri)(state);
    const downloadingByOutpoint = selectDownloadingByOutpoint(state);
    const alreadyDownloading =
      fileInfo && !!downloadingByOutpoint[fileInfo.outpoint];

    function attemptPlay(cost, instantPurchaseMax = null) {
      if (cost > 0 && (!instantPurchaseMax || cost > instantPurchaseMax)) {
        dispatch(doOpenModal(modals.AFFIRM_PURCHASE, { uri }));
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

      return Promise.resolve();
    }

    // we are already downloading the file
    if (alreadyDownloading) {
      return Promise.resolve();
    }

    const costInfo = makeSelectCostInfoForUri(uri)(state);
    const { cost } = costInfo;

    if (cost > balance) {
      dispatch(doSetPlayingUri(null));
      dispatch(doOpenModal(modals.INSUFFICIENT_CREDITS));
      return Promise.resolve();
    }

    if (
      cost == 0 ||
      !makeSelectClientSetting(settings.INSTANT_PURCHASE_ENABLED)(state)
    ) {
      attemptPlay(cost);
    } else {
      const instantPurchaseMax = makeSelectClientSetting(
        settings.INSTANT_PURCHASE_MAX
      )(state);
      if (instantPurchaseMax.currency == "LBC") {
        attemptPlay(cost, instantPurchaseMax.amount);
      } else {
        // Need to convert currency of instant purchase maximum before trying to play
        lbryio.getExchangeRates().then(({ lbc_usd }) => {
          attemptPlay(cost, instantPurchaseMax.amount / lbc_usd);
        });
      }
    }
  };
}

export function doFetchClaimsByChannel(uri, page) {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_CHANNEL_CLAIMS_STARTED,
      data: { uri, page },
    });

    lbry.claim_list_by_channel({ uri, page: page || 1 }).then(result => {
      const claimResult = result[uri] || {};
      const { claims_in_channel, returned_page } = claimResult;

      dispatch({
        type: types.FETCH_CHANNEL_CLAIMS_COMPLETED,
        data: {
          uri,
          claims: claims_in_channel || [],
          page: returned_page || undefined,
        },
      });
    });
  };
}

export function doFetchClaimCountByChannel(uri) {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_CHANNEL_CLAIM_COUNT_STARTED,
      data: { uri },
    });

    lbry.claim_list_by_channel({ uri }).then(result => {
      const claimResult = result[uri],
        totalClaims = claimResult ? claimResult.claims_in_channel : 0;

      dispatch({
        type: types.FETCH_CHANNEL_CLAIM_COUNT_COMPLETED,
        data: {
          uri,
          totalClaims,
        },
      });
    });
  };
}

export function doFetchClaimListMine() {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_CLAIM_LIST_MINE_STARTED,
    });

    lbry.claim_list_mine().then(claims => {
      dispatch({
        type: types.FETCH_CLAIM_LIST_MINE_COMPLETED,
        data: {
          claims,
        },
      });
    });
  };
}

export function doPlayUri(uri) {
  return function(dispatch, getState) {
    dispatch(doSetPlayingUri(uri));
    dispatch(doPurchaseUri(uri));
  };
}

export function doSetPlayingUri(uri) {
  return function(dispatch, getState) {
    dispatch({
      type: types.SET_PLAYING_URI,
      data: { uri },
    });
  };
}

export function doFetchChannelListMine() {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_CHANNEL_LIST_MINE_STARTED,
    });

    const callback = channels => {
      dispatch({
        type: types.FETCH_CHANNEL_LIST_MINE_COMPLETED,
        data: { claims: channels },
      });
    };

    lbry.channel_list_mine().then(callback);
  };
}

export function doCreateChannel(name, amount) {
  return function(dispatch, getState) {
    dispatch({
      type: types.CREATE_CHANNEL_STARTED,
    });

    return new Promise((resolve, reject) => {
      lbry
        .channel_new({
          channel_name: name,
          amount: parseFloat(amount),
        })
        .then(
          channelClaim => {
            channelClaim.name = name;
            dispatch({
              type: types.CREATE_CHANNEL_COMPLETED,
              data: { channelClaim },
            });
            resolve(channelClaim);
          },
          err => {
            reject(err);
          }
        );
    });
  };
}

export function doPublish(params) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      const success = claim => {
        resolve(claim);

        if (claim === true) dispatch(doFetchClaimListMine());
        else
          setTimeout(() => dispatch(doFetchClaimListMine()), 20000, {
            once: true,
          });
      };
      const failure = err => reject(err);

      lbry.publishDeprecated(params, null, success, failure);
    });
  };
}

export function doAbandonClaim(claimId, txid, nout) {
  return function(dispatch, getState) {
    const state = getState();

    dispatch({
      type: types.ABANDON_CLAIM_STARTED,
      data: {
        claimId: claimId,
        txid: txid,
        nout: nout,
      },
    });

    const success = dispatch({
      type: types.ABANDON_CLAIM_SUCCEEDED,
      data: {
        claimId: claimId,
        txid: txid,
        nout: nout,
      },
    });

    lbry
      .claim_abandon({
        txid: txid,
        nout: nout,
      })
      .then(success);
  };
}
