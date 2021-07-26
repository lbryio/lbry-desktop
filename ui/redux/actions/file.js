import * as ACTIONS from 'constants/action_types';
// @if TARGET='app'
import { shell } from 'electron';
// @endif
import {
  Lbry,
  batchActions,
  doAbandonClaim,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  ABANDON_STATES,
} from 'lbry-redux';
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
  return (dispatch) => {
    const success = shell.openPath(path);
    if (!success) {
      dispatch(doOpenFileInFolder(path));
    }
  };
}

export function doDeleteFile(outpoint, deleteFromComputer, abandonClaim, cb) {
  return (dispatch) => {
    if (abandonClaim) {
      const [txid, nout] = outpoint.split(':');
      dispatch(doAbandonClaim(txid, Number(nout), cb));
    }

    // @if TARGET='app'
    Lbry.file_delete({
      outpoint,
      delete_from_download_dir: deleteFromComputer,
    });

    dispatch({
      type: ACTIONS.FILE_DELETE,
      data: {
        outpoint,
      },
    });
    // @endif
  };
}

export function doDeleteFileAndMaybeGoBack(uri, deleteFromComputer, abandonClaim, doGoBack = true) {
  return (dispatch, getState) => {
    const state = getState();
    const playingUri = selectPlayingUri(state);
    const { outpoint } = makeSelectFileInfoForUri(uri)(state) || '';
    const { nout, txid } = makeSelectClaimForUri(uri)(state);
    const claimOutpoint = `${txid}:${nout}`;
    const actions = [];

    actions.push(
      doDeleteFile(outpoint || claimOutpoint, deleteFromComputer, abandonClaim, (abandonState) => {
        if (abandonState === ABANDON_STATES.DONE) {
          if (doGoBack) {
            dispatch(goBack());
          }
        }
      }),
      doHideModal(),
    );

    if (playingUri && playingUri.uri === uri) {
      actions.push(doSetPlayingUri({ uri: null }));
    }
    // it would be nice to stay on the claim if you just want to delete it
    // we need to alter autoplay to not start downloading again after you delete it

    dispatch(batchActions(...actions));
  };
}
