import * as ACTIONS from 'constants/action_types';
import { shell } from 'electron';
import {
  Lbry,
  batchActions,
  doAbandonClaim,
  selectMyClaimsOutpoints,
  selectFileInfosByOutpoint,
  selectTotalDownloadProgress,
  doHideNotification,
} from 'lbry-redux';
import { doHistoryBack } from 'redux/actions/navigation';
import setProgressBar from 'util/setProgressBar';

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
    actions.push(doHideNotification());
    actions.push(doHistoryBack());
    actions.push(doDeleteFile(fileInfo, deleteFromComputer, abandonClaim));
    dispatch(batchActions(...actions));
  };
}
