import * as types from 'constants/action_types'
import lbryio from 'lbryio'
import {
  setLocal
} from 'utils'
import {
  doFetchRewards
} from 'actions/rewards'

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

export function doUserEmailNew(email) {
  return function(dispatch, getState) {
    dispatch({
      type: types.USER_EMAIL_NEW_STARTED,
    })
    lbryio.call('user_email', 'new', { email }, 'post').then(() => {
      dispatch({
        type: types.USER_EMAIL_NEW_SUCCESS,
        data: { email }
      })
    }, (error) => {
      if (error.xhr && (error.xhr.status == 409 || error.message == "This email is already in use")) {
        dispatch({
          type: types.USER_EMAIL_NEW_EXISTS,
          data: { email }
        })
      } else {
        dispatch({
          type: types.USER_EMAIL_NEW_FAILURE,
          data: { error: error.message }
        })
      }
    });
  }
}

export function doUserEmailDecline() {
  return function(dispatch, getState) {
    setLocal('user_email_declined', true)
    dispatch({
      type: types.USER_EMAIL_DECLINE,
    })
  }
}