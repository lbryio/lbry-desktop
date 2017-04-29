import * as types from 'constants/action_types'
import lbry from 'lbry'

export function doFetchUriAvailability(uri) {
  return function(dispatch, getState) {
    dispatch({
      type: types.FETCH_AVAILABILITY_STARTED,
      data: { uri }
    })

    lbry.get_availability({ uri }, (availability) => {
      dispatch({
        type: types.FETCH_AVAILABILITY_COMPLETED',
        data: {
          availability,
          uri,
        }
      })
    }
  }
}
