import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio';

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
    }

    const failure = () => {
    }

    lbryio.call('discover', 'list', { version: "early-access" } )
      .then(success, failure)
  }
}
