import * as types from 'constants/action_types'
import lbryio from 'lbryio'

export function doAuthenticate() {
  return function(dispatch, getState) {
    dispatch({
      type: types.AUTHENTICATION_STARTED,
    })
    lbryio.authenticate().then((user) => {
      dispatch({
        type: types.AUTHENTICATION_SUCCESS,
        data: { user }
      })
    }).catch((error) => {
      dispatch({
        type: types.AUTHENTICATION_FAILURE,
        data: { error }
      })
    })
  }
}