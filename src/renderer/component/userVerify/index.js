import { connect } from 'react-redux';
import { doNotify, MODALS } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doUserIdentityVerify } from 'redux/actions/user';
import rewards from 'rewards';
import { makeSelectRewardByType } from 'redux/selectors/rewards';
import {
  selectIdentityVerifyIsPending,
  selectIdentityVerifyErrorMessage,
} from 'redux/selectors/user';
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
  verifyPhone: () => dispatch(doNotify({ id: MODALS.PHONE_COLLECTION })),
});

export default connect(
  select,
  perform
)(UserVerify);
