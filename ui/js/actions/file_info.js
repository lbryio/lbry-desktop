import * as types from 'constants/action_types'
import lbry from 'lbry'
import {
  selectCurrentUri,
} from 'selectors/app'
import {
  selectCurrentUriClaimOutpoint,
} from 'selectors/claims'

export function doFetchCurrentUriFileInfo() {
  return function(dispatch, getState) {
    const state = getState()
    const uri = selectCurrentUri(state)
    const outpoint = selectCurrentUriClaimOutpoint(state)

    dispatch({
      type: types.FETCH_FILE_INFO_STARTED,
      data: {
        uri,
        outpoint,
      }
    })

    lbry.file_list({ outpoint: outpoint, full_status: true }).then(([fileInfo]) => {
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
