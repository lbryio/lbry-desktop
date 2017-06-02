import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doUserEmailVerify
} from 'actions/user'
import {
  selectEmailVerifyIsPending,
  selectEmailNewExistingEmail,
  selectEmailVerifyErrorMessage,
} from 'selectors/user'
import UserEmailVerify from './view'

const select = (state) => ({
  isPending: selectEmailVerifyIsPending(state),
  email: selectEmailNewExistingEmail,
  errorMessage: selectEmailVerifyErrorMessage(state),
})

const perform = (dispatch) => ({
  verifyUserEmail: (email, code) => dispatch(doUserEmailVerify(email, code))
})

export default connect(select, perform)(UserEmailVerify)
