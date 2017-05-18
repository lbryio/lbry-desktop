import * as types from 'constants/action_types'
import lbry from 'lbry'
import {
  selectClaimsByUri,
} from 'selectors/claims'
import {
  selectIsFileListPending,
  selectAllFileInfos,
  selectLoadingByUri,
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
    const alreadyFetching = !!selectLoadingByUri(state)[uri]

    if (!alreadyFetching) {
      dispatch({
        type: types.FETCH_FILE_INFO_STARTED,
        data: {
          outpoint,
        }
      })

      lbry.file_list({outpoint: outpoint, full_status: true}).then(([fileInfo]) => {
        dispatch({
          type: types.FETCH_FILE_INFO_COMPLETED,
          data: {
            outpoint,
            fileInfo,
          }
        })
      })
    }
  }
}

export function doFileList(uri) {
  return function(dispatch, getState) {
    const state = getState()
    const isPending = selectIsFileListPending(state)

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

export function doDeleteFile(uri, fileInfo, deleteFromComputer) {
  return function(dispatch, getState) {
    dispatch({
      type: types.DELETE_FILE_STARTED,
      data: {
        uri,
        fileInfo,
        deleteFromComputer,
      }
    })

    const successCallback = () => {
      dispatch({
        type: types.DELETE_FILE_COMPLETED,
        data: {
          uri,
        }
      })
      dispatch(doCloseModal())
    }

    lbry.removeFile(fileInfo.outpoint, deleteFromComputer, successCallback)
  }
}


export function doFetchDownloadedContent() {
  return function(dispatch, getState) {
    const state = getState(),
          fileInfos = selectAllFileInfos(state)

    dispatch({
      type: types.FETCH_DOWNLOADED_CONTENT_STARTED,
    })

    lbry.claim_list_mine().then((myClaimInfos) => {

      const myClaimOutpoints = myClaimInfos.map(({txid, nout}) => txid + ':' + nout);

      dispatch({
        type: types.FETCH_DOWNLOADED_CONTENT_COMPLETED,
        data: {
          fileInfos: fileInfos.filter(({outpoint}) => !myClaimOutpoints.includes(outpoint)),
        }
      })
    });
  }
}

export function doFetchPublishedContent() {
  return function(dispatch, getState) {
    const state = getState(),
          fileInfos = selectAllFileInfos(state)

    dispatch({
      type: types.FETCH_PUBLISHED_CONTENT_STARTED,
    })

    lbry.claim_list_mine().then((claimInfos) => {
      dispatch({
        type: types.FETCH_MY_CLAIMS_COMPLETED,
        data: {
          claims: claimInfos,
        }
      })

      const myClaimOutpoints = claimInfos.map(({txid, nout}) => txid + ':' + nout)

      dispatch({
        type: types.FETCH_PUBLISHED_CONTENT_COMPLETED,
        data: {
          fileInfos: fileInfos.filter(({outpoint}) => myClaimOutpoints.includes(outpoint)),
        }
      })
    })
  }
}

