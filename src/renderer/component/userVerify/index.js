import React from 'react';
import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doUserIdentityVerify } from 'redux/actions/user';
import rewards from 'rewards';
import { makeSelectRewardByType } from 'redux/selectors/rewards';
import {
  selectIdentityVerifyIsPending,
  selectIdentityVerifyErrorMessage,
} from 'redux/selectors/user';
import UserVerify from './view';
import { selectCurrentModal } from 'redux/selectors/app';
import { doOpenModal } from 'redux/actions/app';
import { PHONE_COLLECTION } from 'constants/modal_types';

const select = state => {
  const selectReward = makeSelectRewardByType();

  return {
    isPending: selectIdentityVerifyIsPending(state),
    errorMessage: selectIdentityVerifyErrorMessage(state),
    reward: selectReward(state, rewards.TYPE_NEW_USER),
    modal: selectCurrentModal(state),
  };
};

const perform = dispatch => ({
  navigate: uri => dispatch(doNavigate(uri)),
  verifyUserIdentity: token => dispatch(doUserIdentityVerify(token)),
  verifyPhone: () => dispatch(doOpenModal(PHONE_COLLECTION)),
});

export default connect(select, perform)(UserVerify);
