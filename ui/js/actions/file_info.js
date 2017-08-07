import * as types from "constants/action_types";
import lbry from "lbry";
import { doFetchClaimListMine } from "actions/content";
import {
  selectClaimsByUri,
  selectIsFetchingClaimListMine,
  selectMyClaimsOutpoints,
} from "selectors/claims";
import {
  selectIsFetchingFileList,
  selectFileInfosByOutpoint,
  selectUrisLoading,
  selectTotalDownloadProgress,
} from "selectors/file_info";
import { doCloseModal, doHistoryBack } from "actions/app";
import setProgressBar from "util/setProgressBar";
import batchActions from "util/batchActions";

const { shell } = require("electron");

export function doFetchFileInfo(uri) {
  return function(dispatch, getState) {
    const state = getState();
    const claim = selectClaimsByUri(state)[uri];
    const outpoint = claim ? `${claim.txid}:${claim.nout}` : null;
    const alreadyFetching = !!selectUrisLoading(state)[uri];

    if (!alreadyFetching) {
      dispatch({
        type: types.FETCH_FILE_INFO_STARTED,
        data: {
          outpoint,
        },
      });

      lbry
        .file_list({ outpoint: outpoint, full_status: true })
        .then(fileInfos => {
          dispatch({
            type: types.FETCH_FILE_INFO_COMPLETED,
            data: {
              outpoint,
              fileInfo: fileInfos && fileInfos.length ? fileInfos[0] : null,
            },
          });
        });
    }
  };
}

export function doFileList() {
  return function(dispatch, getState) {
    const state = getState();
    const isFetching = selectIsFetchingFileList(state);

    if (!isFetching) {
      dispatch({
        type: types.FILE_LIST_STARTED,
      });

      lbry.file_list().then(fileInfos => {
        dispatch({
          type: types.FILE_LIST_SUCCEEDED,
          data: {
            fileInfos,
          },
        });
      });
    }
  };
}

export function doOpenFileInShell(fileInfo) {
  return function(dispatch, getState) {
    const success = shell.openItem(fileInfo.download_path);
    if (!success) {
      dispatch(doOpenFileInFolder(fileInfo));
    }
  };
}

export function doOpenFileInFolder(fileInfo) {
  return function(dispatch, getState) {
    shell.showItemInFolder(fileInfo.download_path);
  };
}

export function doDeleteFile(outpoint, deleteFromComputer, abandonClaim) {
  return function(dispatch, getState) {
    const state = getState();

    lbry.file_delete({
      outpoint: outpoint,
      delete_from_download_dir: deleteFromComputer,
    });

    // If the file is for a claim we published then also abandom the claim
    const myClaimsOutpoints = selectMyClaimsOutpoints(state);
    if (abandonClaim && myClaimsOutpoints.indexOf(outpoint) !== -1) {
      const byOutpoint = selectFileInfosByOutpoint(state);
      const fileInfo = byOutpoint[outpoint];

      if (fileInfo) {
        dispatch({
          type: types.ABANDON_CLAIM_STARTED,
          data: {
            claimId: fileInfo.claim_id,
          },
        });

        const success = dispatch({
          type: types.ABANDON_CLAIM_SUCCEEDED,
          data: {
            claimId: fileInfo.claim_id,
          },
        });
        lbry.claim_abandon({ claim_id: fileInfo.claim_id }).then(success);
      }
    }

    dispatch({
      type: types.FILE_DELETE,
      data: {
        outpoint,
      },
    });

    const totalProgress = selectTotalDownloadProgress(getState());
    setProgressBar(totalProgress);
  };
}

export function doDeleteFileAndGoBack(
  fileInfo,
  deleteFromComputer,
  abandonClaim
) {
  return function(dispatch, getState) {
    const actions = [];
    actions.push(doCloseModal());
    actions.push(doHistoryBack());
    actions.push(doDeleteFile(fileInfo, deleteFromComputer, abandonClaim));
    dispatch(batchActions(...actions));
  };
}

export function doFetchFileInfosAndPublishedClaims() {
  return function(dispatch, getState) {
    const state = getState(),
      isFetchingClaimListMine = selectIsFetchingClaimListMine(state),
      isFetchingFileInfo = selectIsFetchingFileList(state);

    if (!isFetchingClaimListMine) dispatch(doFetchClaimListMine());
    if (!isFetchingFileInfo) dispatch(doFileList());
  };
}
