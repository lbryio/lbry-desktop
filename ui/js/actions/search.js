import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio'
import lighthouse from 'lighthouse'
import {
  selectSearchQuery,
} from 'selectors/search'

export function doSearchContent(query) {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.SEARCH_STARTED,
      data: { query }
    })

    lighthouse.search(query).then(results => {
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
