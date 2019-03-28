import * as ACTIONS from 'constants/action_types';
// @if TARGET='app'
import { shell } from 'electron';
// @endif
import {
  Lbry,
  batchActions,
  doAbandonClaim,
  selectMyClaimsOutpoints,
  selectFileInfosByOutpoint,
} from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';

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
  };
}

export function doDeleteFileAndGoBack(fileInfo, deleteFromComputer, abandonClaim) {
  return dispatch => {
    const actions = [];
    actions.push(doHideModal());
    actions.push(doDeleteFile(fileInfo, deleteFromComputer, abandonClaim));
    dispatch(batchActions(...actions));
  };
}
