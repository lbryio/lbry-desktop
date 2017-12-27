import * as ACTIONS from 'constants/action_types';
import { shell } from 'electron';
import Lbry from 'lbry';
import { doCloseModal } from 'redux/actions/app';
import { doAbandonClaim, doFetchClaimListMine } from 'redux/actions/content';
import { doHistoryBack } from 'redux/actions/navigation';
import {
  selectClaimsByUri,
  selectIsFetchingClaimListMine,
  selectMyClaimsOutpoints,
} from 'redux/selectors/claims';
import {
  selectFileInfosByOutpoint,
  selectIsFetchingFileList,
  selectTotalDownloadProgress,
  selectUrisLoading,
} from 'redux/selectors/file_info';
import batchActions from 'util/batchActions';
import setProgressBar from 'util/setProgressBar';

export function doFetchFileInfo(uri) {
  return (dispatch, getState) => {
    const state = getState();
    const claim = selectClaimsByUri(state)[uri];
    const outpoint = claim ? `${claim.txid}:${claim.nout}` : null;
    const alreadyFetching = !!selectUrisLoading(state)[uri];

    if (!alreadyFetching) {
      dispatch({
        type: ACTIONS.FETCH_FILE_INFO_STARTED,
        data: {
          outpoint,
        },
      });

      Lbry.file_list({ outpoint, full_status: true }).then(fileInfos => {
        dispatch({
          type: ACTIONS.FETCH_FILE_INFO_COMPLETED,
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
  return (dispatch, getState) => {
    const state = getState();
    const isFetching = selectIsFetchingFileList(state);

    if (!isFetching) {
      dispatch({
        type: ACTIONS.FILE_LIST_STARTED,
      });

      Lbry.file_list().then(fileInfos => {
        dispatch({
          type: ACTIONS.FILE_LIST_SUCCEEDED,
          data: {
            fileInfos,
          },
        });
      });
    }
  };
}

export function doOpenFileInFolder(path) {
  return () => {
    shell.showItemInFolder(path);
  };
}

export function doOpenFileInShell(path) {
  return dispatch => {
    const success = shell.openItem(path);
    if (!success) {
      dispatch(doOpenFileInFolder(path));
    }
  };
}

export function doDeleteFile(outpoint, deleteFromComputer, abandonClaim) {
  return (dispatch, getState) => {
    const state = getState();

    Lbry.file_delete({
      outpoint,
      delete_from_download_dir: deleteFromComputer,
    });

    // If the file is for a claim we published then also abandon the claim
    const myClaimsOutpoints = selectMyClaimsOutpoints(state);
    if (abandonClaim && myClaimsOutpoints.indexOf(outpoint) !== -1) {
      const byOutpoint = selectFileInfosByOutpoint(state);
      const fileInfo = byOutpoint[outpoint];

      if (fileInfo) {
        const txid = fileInfo.outpoint.slice(0, -2);
        const nout = Number(fileInfo.outpoint.slice(-1));

        dispatch(doAbandonClaim(txid, nout));
      }
    }

    dispatch({
      type: ACTIONS.FILE_DELETE,
      data: {
        outpoint,
      },
    });

    const totalProgress = selectTotalDownloadProgress(getState());
    setProgressBar(totalProgress);
  };
}

export function doDeleteFileAndGoBack(fileInfo, deleteFromComputer, abandonClaim) {
  return dispatch => {
    const actions = [];
    actions.push(doCloseModal());
    actions.push(doHistoryBack());
    actions.push(doDeleteFile(fileInfo, deleteFromComputer, abandonClaim));
    dispatch(batchActions(...actions));
  };
}

export function doFetchFileInfosAndPublishedClaims() {
  return (dispatch, getState) => {
    const state = getState();
    const isFetchingClaimListMine = selectIsFetchingClaimListMine(state);
    const isFetchingFileInfo = selectIsFetchingFileList(state);

    if (!isFetchingClaimListMine) dispatch(doFetchClaimListMine());
    if (!isFetchingFileInfo) dispatch(doFileList());
  };
}
