import React from 'react';
import { connect } from 'react-redux';
import { doUserFieldVerify, doUserFieldVerifyFailure } from 'redux/actions/user';
import {
  selectEmailVerifyIsPending,
  selectEmailToVerify,
  selectEmailVerifyErrorMessage,
} from 'redux/selectors/user';
import UserFieldVerify from './view';

const select = state => ({
  isPending: selectEmailVerifyIsPending(state),
  email: selectEmailToVerify(state),
  errorMessage: selectEmailVerifyErrorMessage(state),
});

const perform = dispatch => ({
  verifyUserEmail: (code, recaptcha) => dispatch(doUserFieldVerify(code, recaptcha)),
  verifyUserEmailFailure: error => dispatch(doUserFieldVerifyFailure(error)),
});

export default connect(select, perform)(UserFieldVerify);
