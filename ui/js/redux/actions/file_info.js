import * as types from "constants/action_types";
import lbry from "lbry";
import { doFetchClaimListMine, doAbandonClaim, doResolveUri } from "redux/actions/content";
import {
  selectClaimsByUri,
  selectIsFetchingClaimListMine,
  selectMyClaimsOutpoints,
} from "redux/selectors/claims";
import {
  selectIsFetchingFileList,
  selectFileInfosBySdHash,
  selectFetchingSdHash,
  selectTotalDownloadProgress,
  selectSdHashesByOutpoint,
} from "redux/selectors/file_info";
import { doCloseModal } from "redux/actions/app";
import { doNavigate, doHistoryBack } from "redux/actions/navigation";
import setProgressBar from "util/setProgressBar";
import batchActions from "util/batchActions";

const { shell } = require("electron");

export function doFetchFileInfo(uri) {
  return function(dispatch, getState) {
    const state = getState();
    const claim = selectClaimsByUri(state)[uri];
    const sd_hash = claim.value.stream.source.source;
    const alreadyFetching = !!selectFetchingSdHash(state)[sd_hash];

    if (!alreadyFetching) {
      dispatch({
        type: types.FETCH_FILE_INFO_STARTED,
        data: {
          sd_hash,
        },
      });

      lbry
        .file_list({ sd_hash: sd_hash, full_status: true })
        .then(fileInfos => {
          dispatch({
            type: types.FETCH_FILE_INFO_COMPLETED,
            data: {
              sd_hash,
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

export function doOpenFileInShell(path) {
  return function(dispatch, getState) {
    const success = shell.openItem(path);
    if (!success) {
      dispatch(doOpenFileInFolder(path));
    }
  };
}

export function doOpenFileInFolder(path) {
  return function(dispatch, getState) {
    shell.showItemInFolder(path);
  };
}

export function doDeleteFile(outpoint, deleteFromComputer, abandonClaim) {
  return function(dispatch, getState) {
    const state = getState();
    const sdHash = selectSdHashesByOutpoint(state)[outpoint];

    lbry.file_delete({
      outpoint: outpoint,
      delete_from_download_dir: deleteFromComputer,
    });

    // If the file is for a claim we published then also abandom the claim
    const myClaimsOutpoints = selectMyClaimsOutpoints(state);
    if (abandonClaim && myClaimsOutpoints.indexOf(outpoint) !== -1) {
      const bySdHash = selectFileInfosBySdHash(state);
      const fileInfo = bySdHash[sd_hash];

      if (fileInfo) {
        txid = fileInfo.outpoint.slice(0, -2);
        nout = fileInfo.outpoint.slice(-1);

        dispatch(doAbandonClaim(txid, nout));
      }
    }

    dispatch({
      type: types.FILE_DELETE,
      data: {
        sdHash,
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
