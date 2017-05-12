import * as types from 'constants/action_types'
import {
  selectCurrentUri,
} from 'selectors/app'
import lbry from 'lbry'

export function doFetchCostInfoForUri(uri) {
  return function(dispatch, getState) {
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
    }).catch(() => {
      dispatch({
        type: types.FETCH_COST_INFO_COMPLETED,
        data: {
          uri,
          costInfo: null
        }
      })
    })
  }
}

