import * as ACTIONS from 'constants/action_types';
// @if TARGET='app'
import { shell } from 'electron';
// @endif
import { Lbry, batchActions, doAbandonClaim, selectMyClaimsOutpoints, makeSelectFileInfoForUri } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import { goBack } from 'connected-react-router';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectPlayingUri } from 'redux/selectors/content';

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
      const [txid, nout] = outpoint.split(':');

      dispatch(doAbandonClaim(txid, Number(nout)));
    }

    dispatch({
      type: ACTIONS.FILE_DELETE,
      data: {
        outpoint,
      },
    });
  };
}

export function doDeleteFileAndMaybeGoBack(uri, deleteFromComputer, abandonClaim) {
  return (dispatch, getState) => {
    const state = getState();
    const playingUri = selectPlayingUri(state);
    const { outpoint } = makeSelectFileInfoForUri(uri)(state) || '';
    const actions = [];
    actions.push(doHideModal());
    actions.push(doDeleteFile(outpoint, deleteFromComputer, abandonClaim));

    if (playingUri === uri) {
      actions.push(doSetPlayingUri(null));
    }

    if (abandonClaim) {
      actions.push(goBack());
    }

    dispatch(batchActions(...actions));
  };
}
