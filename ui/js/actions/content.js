import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio'
import {
  selectCurrentUri,
} from 'selectors/app'
import {
  selectBalance,
} from 'selectors/wallet'
import {
  selectSearchTerm,
  selectCurrentUriCostInfo,
  selectCurrentUriFileInfo,
} from 'selectors/content'
import {
  selectCurrentResolvedUriClaimOutpoint,
} from 'selectors/content'
import {
  doOpenModal,
} from 'actions/app'
import batchActions from 'util/batchActions'

export function doResolveUri(uri) {
  return function(dispatch, getState) {
    dispatch({
      type: types.RESOLVE_URI_STARTED,
      data: { uri }
    })

    lbry.resolve({ uri }).then((resolutionInfo) => {
      const {
        claim,
        certificate,
      } = resolutionInfo

      dispatch({
        type: types.RESOLVE_URI_COMPLETED,
        data: {
          uri,
          claim,
          certificate,
        }
      })
    })
  }
}

export function doFetchCurrentUriFileInfo() {
  return function(dispatch, getState) {
    const state = getState()
    const uri = selectCurrentUri(state)
    const outpoint = selectCurrentResolvedUriClaimOutpoint(state)

    dispatch({
      type: types.FETCH_FILE_INFO_STARTED,
      data: {
        uri,
        outpoint,
      }
    })

    lbry.file_list({ outpoint }).then(([fileInfo]) => {
      dispatch({
        type: types.FETCH_FILE_INFO_COMPLETED,
        data: {
          uri,
          fileInfo,
        }
      })
    })
  }
}

export function doFetchDownloadedContent() {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.FETCH_DOWNLOADED_CONTENT_STARTED,
    })

    lbry.claim_list_mine().then((myClaimInfos) => {
      lbry.file_list().then((fileInfos) => {
        const myClaimOutpoints = myClaimInfos.map(({txid, nout}) => txid + ':' + nout);

        dispatch({
          type: types.FETCH_DOWNLOADED_CONTENT_COMPLETED,
          data: {
            fileInfos: fileInfos.filter(({outpoint}) => !myClaimOutpoints.includes(outpoint)),
          }
        })
      });
    });
  }
}

export function doFetchPublishedContent() {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.FETCH_PUBLISHED_CONTENT_STARTED,
    })

    lbry.claim_list_mine().then((claimInfos) => {
      lbry.file_list().then((fileInfos) => {
        const myClaimOutpoints = claimInfos.map(({txid, nout}) => txid + ':' + nout)

        dispatch({
          type: types.FETCH_PUBLISHED_CONTENT_COMPLETED,
          data: {
            fileInfos: fileInfos.filter(({outpoint}) => myClaimOutpoints.includes(outpoint)),
          }
        })
      })
    })
  }
}

export function doFetchFeaturedContent() {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.FETCH_FEATURED_CONTENT_STARTED,
    })

    const success = ({ Categories, Uris }) => {
      dispatch({
        type: types.FETCH_FEATURED_CONTENT_COMPLETED,
        data: {
          categories: Categories,
          uris: Uris,
        }
      })

      Object.keys(Uris).forEach((category) => {
        Uris[category].forEach((uri) => dispatch(doResolveUri(uri)))
      })
    }

    const failure = () => {
    }

    lbryio.call('discover', 'list', { version: "early-access" } )
      .then(success, failure)
  }
}

export function doFetchCurrentUriCostInfo() {
  return function(dispatch, getState) {
    const state = getState()
    const uri = selectCurrentUri(state)

    dispatch({
      type: types.FETCH_COST_INFO_STARTED,
      data: {
        uri,
      }
    })

    lbry.getCostInfo(uri).then(costInfo => {
      dispatch({
        type: types.FETCH_COST_INFO_COMPLETED,
        data: {
          uri,
          costInfo,
        }
      })
    })
  }
}

export function doUpdateLoadStatus(uri, outpoint) {
  return function(dispatch, getState) {
    const state = getState()

    lbry.file_list({
      outpoint: outpoint,
      full_status: true,
    }).then(([fileInfo]) => {
      if(!fileInfo || fileInfo.written_bytes == 0) {
        // download hasn't started yet
        setTimeout(() => { dispatch(doUpdateLoadStatus(uri, outpoint)) }, 250)
      } else if (fileInfo.completed) {
        dispatch({
          type: types.DOWNLOADING_COMPLETED,
          data: {
            uri,
            fileInfo,
          }
        })
      } else {
        // ready to play
        const {
          total_bytes,
          written_bytes,
        } = fileInfo
        const progress = (written_bytes / total_bytes) * 100

        dispatch({
          type: types.DOWNLOADING_PROGRESSED,
          data: {
            uri,
            fileInfo,
            progress,
          }
        })
        setTimeout(() => { dispatch(doUpdateLoadStatus(uri, outpoint)) }, 250)
      }
    })
  }
}

export function doPlayVideo(uri) {
  return {
    type: types.PLAY_VIDEO_STARTED,
    data: { uri }
  }
}

export function doDownloadFile(uri, streamInfo) {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.DOWNLOADING_STARTED,
      data: {
        uri,
      }
    })

    lbryio.call('file', 'view', {
      uri: uri,
      outpoint: streamInfo.outpoint,
      claimId: streamInfo.claim_id,
    }).catch(() => {})
    dispatch(doUpdateLoadStatus(uri, streamInfo.outpoint))
  }
}

export function doLoadVideo() {
  return function(dispatch, getState) {
    const state = getState()
    const uri = selectCurrentUri(state)

    dispatch({
      type: types.LOADING_VIDEO_STARTED,
      data: {
        uri
      }
    })

    lbry.get({ uri }).then(streamInfo => {
      if (streamInfo === null || typeof streamInfo !== 'object') {
        dispatch({
          type: types.LOADING_VIDEO_FAILED,
          data: { uri }
        })
        dispatch(doOpenModal('timedOut'))
      } else {
        dispatch(doDownloadFile(uri, streamInfo))
      }
    })
  }
}

export function doWatchVideo() {
  return function(dispatch, getState) {
    const state = getState()
    const uri = selectCurrentUri(state)
    const balance = selectBalance(state)
    const fileInfo = selectCurrentUriFileInfo(state)
    const costInfo = selectCurrentUriCostInfo(state)
    const { cost } = costInfo

    // TODO does > 0 mean the file is downloaded? We don't have the total_bytes
    if (fileInfo.written_bytes > 0) {
      dispatch(doPlayVideo(uri))
    } else {
      if (cost > balance) {
        dispatch(doOpenModal('notEnoughCredits'))
      } else if (cost <= 0.01) {
        dispatch(doLoadVideo())
      } else {
        dispatch(doOpenModal('affirmPurchase'))
      }
    }
  }
}
