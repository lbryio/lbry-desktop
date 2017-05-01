import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio'
import lbryuri from 'lbryuri'
import {
  selectCurrentUri,
} from 'selectors/app'
import {
  selectBalance,
} from 'selectors/wallet'
import {
  selectSearchTerm,
} from 'selectors/content'
import {
  selectCurrentUriFileInfo,
  selectDownloadingByUri,
} from 'selectors/file_info'
import {
  selectCurrentUriCostInfo,
} from 'selectors/cost_info'
import {
  selectCurrentResolvedUriClaimOutpoint,
} from 'selectors/content'
import {
  selectClaimsByUri,
} from 'selectors/claims'
import {
  doOpenModal,
} from 'actions/app'
import {
  doFetchCostInfoForUri,
} from 'actions/cost_info'
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

      dispatch(doFetchCostInfoForUri(uri))
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

        fileInfos.forEach(fileInfo => {
          const uri = lbryuri.build({
            channelName: fileInfo.channel_name,
            contentName: fileInfo.name,
          })
          const claim = selectClaimsByUri(state)[uri]
          if (!claim) dispatch(doResolveUri(uri))
        })

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
      dispatch({
        type: types.FETCH_MY_CLAIMS_COMPLETED,
        data: {
          claims: claimInfos,
        }
      })
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
        Uris[category].forEach((uri) => {
          dispatch(doResolveUri(lbryuri.normalize(uri)))
        })
      })
    }

    const failure = () => {
    }

    lbryio.call('discover', 'list', { version: "early-access" } )
      .then(success, failure)
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

    lbry.file_list({ outpoint: streamInfo.outpoint, full_status: true }).then(([fileInfo]) => {
      dispatch({
        type: types.DOWNLOADING_STARTED,
        data: {
          uri,
          fileInfo,
        }
      })
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
    const downloadingByUri = selectDownloadingByUri(state)
    const alreadyDownloading = !!downloadingByUri[uri]
    const { cost } = costInfo

    // we already fully downloaded the file
    if (fileInfo && fileInfo.completed) {
      return Promise.resolve()
    }

    // we are already downloading the file
    if (alreadyDownloading) {
      return Promise.resolve()
    }

    // the file is free or we have partially downloaded it
    if (cost <= 0.01 || fileInfo.download_directory) {
      dispatch(doLoadVideo())
      return Promise.resolve()
    }

    if (cost > balance) {
      dispatch(doOpenModal('notEnoughCredits'))
    } else {
      dispatch(doOpenModal('affirmPurchase'))
    }

    return Promise.resolve()
  }
}
