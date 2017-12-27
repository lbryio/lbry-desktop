import React from 'react';
import { connect } from 'react-redux';
import { doUserEmailVerify, doUserEmailVerifyFailure } from 'redux/actions/user';
import {
  selectEmailVerifyIsPending,
  selectEmailToVerify,
  selectEmailVerifyErrorMessage,
} from 'redux/selectors/user';
import UserEmailVerify from './view';
import rewards from 'rewards';
import { makeSelectRewardAmountByType } from 'redux/selectors/rewards';

const select = state => ({
  isPending: selectEmailVerifyIsPending(state),
  email: selectEmailToVerify(state),
  errorMessage: selectEmailVerifyErrorMessage(state),
  rewardAmount: makeSelectRewardAmountByType()(state, {
    reward_type: rewards.TYPE_CONFIRM_EMAIL,
  }),
});

const perform = dispatch => ({
  verifyUserEmail: (code, recaptcha) => dispatch(doUserEmailVerify(code, recaptcha)),
  verifyUserEmailFailure: error => dispatch(doUserEmailVerifyFailure(error)),
});

export default connect(select, perform)(UserEmailVerify);
