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
import {
  doNavigate,
} from 'actions/app'
import {
  selectCurrentPage,
} from 'selectors/app'

export function doSearchContent(query) {
  return function(dispatch, getState) {
    const state = getState()
    const page = selectCurrentPage(state)


    if (!query) {
      return dispatch({
        type: types.SEARCH_CANCELLED,
      })
    }

    dispatch({
      type: types.SEARCH_STARTED,
      data: { query }
    })

    if(page != 'discover' && query != undefined) dispatch(doNavigate('discover'))

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

export function doActivateSearch() {
  return function(dispatch, getState) {
    const state = getState()
    const page = selectCurrentPage(state)
    const query = selectSearchQuery(state)

    if(page != 'discover' && query != undefined) dispatch(doNavigate('discover'))

    dispatch({
      type: types.ACTIVATE_SEARCH,
    })
  }
}

export function doDeactivateSearch() {
  return {
    type: types.DEACTIVATE_SEARCH,
  }
}
