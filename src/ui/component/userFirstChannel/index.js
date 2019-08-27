import { connect } from 'react-redux';
import { selectUser, selectEmailToVerify, rewards as REWARD_TYPES, doClaimRewardType } from 'lbryinc';
import { doCreateChannel, selectCreatingChannel, selectMyChannelClaims } from 'lbry-redux';
import UserSignUp from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
  creatingChannel: selectCreatingChannel(state),
  channels: selectMyChannelClaims(state),
});

const perform = dispatch => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  claimReward: cb =>
    dispatch(
      doClaimRewardType(REWARD_TYPES.TYPE_REWARD_CODE, {
        notifyError: true,
        successCallback: cb,
        params: { code: 'sean-test' },
      })
    ),
});

export default connect(
  select,
  perform
)(UserSignUp);
