import { connect } from 'react-redux';
import {
  selectEmailToVerify,
  selectUser,
  selectAccessToken,
  makeSelectIsRewardClaimPending,
  selectClaimedRewards,
  rewards as REWARD_TYPES,
  doClaimRewardType,
} from 'lbryinc';
import { selectMyChannelClaims, selectBalance, selectFetchingMyChannels } from 'lbry-redux';
import UserSignIn from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
  accessToken: selectAccessToken(state),
  channels: selectMyChannelClaims(state),
  claimedRewards: selectClaimedRewards(state),
  claimingReward: makeSelectIsRewardClaimPending()(state, {
    reward_type: REWARD_TYPES.TYPE_CONFIRM_EMAIL,
  }),
  balance: selectBalance(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

const perform = dispatch => ({
  claimReward: () =>
    dispatch(
      doClaimRewardType(REWARD_TYPES.TYPE_CONFIRM_EMAIL, {
        notifyError: false,
      })
    ),
});

export default connect(
  select,
  perform
)(UserSignIn);
