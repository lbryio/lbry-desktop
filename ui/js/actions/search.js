import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio'
import lbryuri from 'lbryuri'
import lighthouse from 'lighthouse'
import {
  selectSearchQuery,
} from 'selectors/search'
import {
  doResolveUri,
} from 'actions/content'

export function doSearchContent(query) {
  return function(dispatch, getState) {
    const state = getState()

    if (!query) {
      return dispatch({
        type: types.SEARCH_CANCELLED,
      })
    }

    dispatch({
      type: types.SEARCH_STARTED,
      data: { query }
    })

    lighthouse.search(query).then(results => {
      results.forEach(result => {
        const uri = lbryuri.build({
          channelName: result.channel_name,
          contentName: result.name,
          claimId: result.channel_id || result.claim_id,
        })
        dispatch(doResolveUri(uri))
      })

      dispatch({
        type: types.SEARCH_COMPLETED,
        data: {
          query,
          results,
        }
      })
    })
  }
}
