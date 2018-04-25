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
import { doNotify } from 'lbry-redux';
import { PHONE_COLLECTION } from 'constants/modal_types';

const select = (state, props) => {
  const selectReward = makeSelectRewardByType();

  return {
    isPending: selectIdentityVerifyIsPending(state),
    errorMessage: selectIdentityVerifyErrorMessage(state),
    reward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
  };
};

const perform = dispatch => ({
  navigate: uri => dispatch(doNavigate(uri)),
  verifyUserIdentity: token => dispatch(doUserIdentityVerify(token)),
  verifyPhone: () => dispatch(doNotify({ id: PHONE_COLLECTION })),
});

export default connect(select, perform)(UserVerify);
