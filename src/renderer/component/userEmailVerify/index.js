import React from 'react';
import { connect } from 'react-redux';
import { doUserEmailVerify } from 'redux/actions/user';
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
  verifyUserEmail: code => dispatch(doUserEmailVerify(code)),
});

export default connect(select, perform)(UserEmailVerify);
