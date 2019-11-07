import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import {
  doUserIdentityVerify,
  doUserFetch,
  rewards,
  makeSelectRewardByType,
  selectIdentityVerifyIsPending,
  selectIdentityVerifyErrorMessage,
} from 'lbryinc';
import UserVerify from './view';

const select = state => {
  const selectReward = makeSelectRewardByType();

  return {
    isPending: selectIdentityVerifyIsPending(state),
    errorMessage: selectIdentityVerifyErrorMessage(state),
    reward: selectReward(state, rewards.TYPE_NEW_USER),
  };
};

const perform = dispatch => ({
  verifyUserIdentity: token => dispatch(doUserIdentityVerify(token)),
  verifyPhone: () => dispatch(doOpenModal(MODALS.PHONE_COLLECTION)),
  fetchUser: () => dispatch(doUserFetch()),
});

export default connect(
  select,
  perform
)(UserVerify);
