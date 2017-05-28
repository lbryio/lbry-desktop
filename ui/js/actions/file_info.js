import * as types from 'constants/action_types'
import lbry from 'lbry'
import {
  doFetchClaimListMine
} from 'actions/content'
import {
  selectClaimsByUri,
  selectClaimListMineIsPending,
} from 'selectors/claims'
import {
  selectFileListIsPending,
  selectAllFileInfos,
  selectUrisLoading,
} from 'selectors/file_info'
import {
  doCloseModal,
} from 'actions/app'

const {
  shell,
} = require('electron')

export function doFetchFileInfo(uri) {
  return function(dispatch, getState) {
    const state = getState()
    const claim = selectClaimsByUri(state)[uri]
    const outpoint = claim ? `${claim.txid}:${claim.nout}` : null
    const alreadyFetching = !!selectUrisLoading(state)[uri]

    if (!alreadyFetching) {
      dispatch({
        type: types.FETCH_FILE_INFO_STARTED,
        data: {
          outpoint,
        }
      })

      lbry.file_list({outpoint: outpoint, full_status: true}).then(fileInfos => {

        dispatch({
          type: types.FETCH_FILE_INFO_COMPLETED,
          data: {
            outpoint,
            fileInfo: fileInfos && fileInfos.length ? fileInfos[0] : null,
          }
        })
      })
    }
  }
}

export function doFileList() {
  return function(dispatch, getState) {
    const state = getState()
    const isPending = selectFileListIsPending(state)

    if (!isPending) {
      dispatch({
        type: types.FILE_LIST_STARTED,
      })

      lbry.file_list().then((fileInfos) => {
        dispatch({
          type: types.FILE_LIST_COMPLETED,
          data: {
            fileInfos,
          }
        })
      })
    }
  }
}

export function doOpenFileInShell(fileInfo) {
  return function(dispatch, getState) {
    shell.openItem(fileInfo.download_path)
  }
}

export function doOpenFileInFolder(fileInfo) {
  return function(dispatch, getState) {
    shell.showItemInFolder(fileInfo.download_path)
  }
}

export function doDeleteFile(outpoint, deleteFromComputer) {
  return function(dispatch, getState) {

    dispatch({
      type: types.FILE_DELETE,
      data: {
        outpoint
      }
    })

    lbry.file_delete({
      outpoint: outpoint,
      delete_target_file: deleteFromComputer,
    })

    dispatch(doCloseModal())
  }
}


export function doFetchFileInfosAndPublishedClaims() {
  return function(dispatch, getState) {
    const state = getState(),
          isClaimListMinePending = selectClaimListMineIsPending(state),
          isFileInfoListPending = selectFileListIsPending(state)

    if (isClaimListMinePending === undefined) {
      dispatch(doFetchClaimListMine())
    }

    if (isFileInfoListPending === undefined) {
      dispatch(doFileList())
    }
  }
}

