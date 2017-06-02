import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doUserEmailDecline
} from 'actions/user'
import {
  selectAuthenticationIsPending,
  selectEmailNewDeclined,
  selectUser,
} from 'selectors/user'
import AuthOverlay from './view'

const select = (state) => ({
  isPending: selectAuthenticationIsPending(state),
  isEmailDeclined: selectEmailNewDeclined(state),
  user: selectUser(state),
})

const perform = (dispatch) => ({
  userEmailDecline: () => dispatch(doUserEmailDecline())
})

export default connect(select, perform)(AuthOverlay)
