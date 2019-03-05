import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import {
  doUserIdentityVerify,
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
  navigate: uri => dispatch(doNavigate(uri)),
  verifyUserIdentity: token => dispatch(doUserIdentityVerify(token)),
  verifyPhone: () => dispatch(doOpenModal(MODALS.PHONE_COLLECTION)),
});

export default connect(
  select,
  perform
)(UserVerify);
