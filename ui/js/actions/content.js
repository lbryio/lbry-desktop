import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio';

export function doResolveUri(dispatch, uri) {
  dispatch({
    type: types.RESOLVE_URI_STARTED,
    data: { uri }
  })

  lbry.resolve({uri: uri}).then((resolutionInfo) => {
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
        Uris[category].forEach((uri) => doResolveUri(dispatch, uri))
      })
    }

    const failure = () => {
    }

    lbryio.call('discover', 'list', { version: "early-access" } )
      .then(success, failure)
  }
}
