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
