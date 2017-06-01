import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doStartUpgrade,
  doCancelUpgrade,
} from 'actions/app'
import {
  selectAuthenticationIsPending,
} from 'selectors/user'
import AuthOverlay from './view'

const select = (state) => ({
  isPending: selectAuthenticationIsPending(state)
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(AuthOverlay)
