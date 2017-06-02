import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio'
import lbryuri from 'lbryuri'
import rewards from 'rewards'
import {
  selectBalance,
} from 'selectors/wallet'
import {
  selectFileInfoForUri,
  selectUrisDownloading,
} from 'selectors/file_info'
import {
  selectResolvingUris
} from 'selectors/content'
import {
  selectCostInfoForUri,
} from 'selectors/cost_info'
import {
  selectClaimsByUri,
} from 'selectors/claims'
import {
  doOpenModal,
} from 'actions/app'

export function doResolveUri(uri) {
  return function(dispatch, getState) {

    uri = lbryuri.normalize(uri)

    const state = getState()
    const alreadyResolving = selectResolvingUris(state).indexOf(uri) !== -1

    if (!alreadyResolving) {
      dispatch({
        type: types.RESOLVE_URI_STARTED,
        data: { uri }
      })

      lbry.resolve({ uri }).then((resolutionInfo) => {
        const {
          claim,
          certificate,
        } = resolutionInfo ? resolutionInfo : { claim : null, certificate: null }

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
}

export function doCancelResolveUri(uri) {
  return function(dispatch, getState) {
    lbry.cancelResolve({ uri })
    dispatch({
      type: types.RESOLVE_URI_CANCELED,
      data: { uri }
    })
  }
}

export function doFetchFeaturedUris() {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.FETCH_FEATURED_CONTENT_STARTED,
    })

    const success = ({ Categories, Uris }) => {

      let featuredUris = {}

      Categories.forEach((category) => {
        if (Uris[category] && Uris[category].length) {
          featuredUris[category] = Uris[category]
        }
      })

      dispatch({
        type: types.FETCH_FEATURED_CONTENT_COMPLETED,
        data: {
          categories: Categories,
          uris: featuredUris,
        }
      })
    }

    const failure = () => {
      dispatch({
        type: types.FETCH_FEATURED_CONTENT_COMPLETED,
        data: {
          categories: [],
          uris: {}
        }
      })
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
        // TODO this isn't going to get called if they reload the client before
        // the download finished
        dispatch({
          type: types.DOWNLOADING_COMPLETED,
          data: {
            uri,
            outpoint,
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
            outpoint,
            fileInfo,
            progress,
          }
        })
        setTimeout(() => { dispatch(doUpdateLoadStatus(uri, outpoint)) }, 250)
      }
    })
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
          outpoint: streamInfo.outpoint,
          fileInfo,
        }
      })

      dispatch(doUpdateLoadStatus(uri, streamInfo.outpoint))
    })

    lbryio.call('file', 'view', {
      uri: uri,
      outpoint: streamInfo.outpoint,
      claim_id: streamInfo.claim_id,
    }).catch(() => {})

    rewards.claimEligiblePurchaseRewards()

  }
}

export function doLoadVideo(uri) {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.LOADING_VIDEO_STARTED,
      data: {
        uri
      }
    })

    lbry.get({ uri }).then(streamInfo => {
      const timeout = streamInfo === null ||
        typeof streamInfo !== 'object' ||
        streamInfo.error == 'Timeout'

      if(timeout) {
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

export function doPurchaseUri(uri, purchaseModalName) {
  return function(dispatch, getState) {
    const state = getState()
    const balance = selectBalance(state)
    const fileInfo = selectFileInfoForUri(state, { uri })
    const downloadingByUri = selectUrisDownloading(state)
    const alreadyDownloading = !!downloadingByUri[uri]

    // we already fully downloaded the file.
    if (fileInfo && fileInfo.completed) {
      // If written_bytes is false that means the user has deleted/moved the
      // file manually on their file system, so we need to dispatch a
      // doLoadVideo action to reconstruct the file from the blobs
      if (!fileInfo.written_bytes) dispatch(doLoadVideo(uri))

      return Promise.resolve()
    }

    // we are already downloading the file
    if (alreadyDownloading) {
      return Promise.resolve()
    }

    const costInfo = selectCostInfoForUri(state, { uri })
    const { cost } = costInfo

    // the file is free or we have partially downloaded it
    if (cost <= 0.01 || (fileInfo && fileInfo.download_directory)) {
      dispatch(doLoadVideo(uri))
      return Promise.resolve()
    }

    if (cost > balance) {
      dispatch(doOpenModal('notEnoughCredits'))
    } else {
      dispatch(doOpenModal(purchaseModalName))
    }

    return Promise.resolve()
  }
}

export function doFetchClaimsByChannel(uri) {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_CHANNEL_CLAIMS_STARTED,
      data: { uri }
    })

    lbry.resolve({ uri }).then((resolutionInfo) => {
      const {
        claims_in_channel,
      } = resolutionInfo ? resolutionInfo : { claims_in_channel: [] }

      dispatch({
        type: types.FETCH_CHANNEL_CLAIMS_COMPLETED,
        data: {
          uri,
          claims: claims_in_channel
        }
      })
    })
  }
}

export function doFetchClaimListMine() {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_CLAIM_LIST_MINE_STARTED
    })


    lbry.claim_list_mine().then((claims) => {
      dispatch({
        type: types.FETCH_CLAIM_LIST_MINE_COMPLETED,
        data: {
          claims
        }
      })
    })
  }
}