import * as types from 'constants/action_types'
import lbry from 'lbry'
import {
  selectCurrentUri,
} from 'selectors/app'

export function doFetchUriAvailability(uri) {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_AVAILABILITY_STARTED,
      data: { uri }
    })

    const successCallback = (availability) => {
      dispatch({
        type: types.FETCH_AVAILABILITY_COMPLETED,
        data: {
          availability,
          uri,
        }
      })
    }

    const errorCallback = () => {
      console.debug('error')
    }

    lbry.get_availability({ uri }, successCallback, errorCallback)
  }
}

export function doFetchCurrentUriAvailability() {
  return function(dispatch, getState) {
    const state = getState()
    const uri = selectCurrentUri(state)

    dispatch(doFetchUriAvailability(uri))
  }
}
