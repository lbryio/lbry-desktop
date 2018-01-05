import React from 'react';
import { connect } from 'react-redux';
import { doUserEmailVerify, doUserEmailVerifyFailure } from 'redux/actions/user';
import {
  selectEmailVerifyIsPending,
  selectEmailToVerify,
  selectEmailVerifyErrorMessage,
} from 'redux/selectors/user';
import UserEmailVerify from './view';

const select = state => ({
  isPending: selectEmailVerifyIsPending(state),
  email: selectEmailToVerify(state),
  errorMessage: selectEmailVerifyErrorMessage(state),
});

const perform = dispatch => ({
  verifyUserEmail: (code, recaptcha) => dispatch(doUserEmailVerify(code, recaptcha)),
  verifyUserEmailFailure: error => dispatch(doUserEmailVerifyFailure(error)),
});

export default connect(select, perform)(UserEmailVerify);
