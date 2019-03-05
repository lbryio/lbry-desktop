import { connect } from 'react-redux';
import { makeSelectRewardByType, makeSelectIsRewardClaimPending, doClaimRewardType } from 'lbryinc';
import { doNavigate } from 'redux/actions/navigation';
import RewardLink from './view';

const select = (state, props) => ({
  isPending: makeSelectIsRewardClaimPending()(state, props),
  reward: makeSelectRewardByType()(state, props.reward_type),
});

const perform = dispatch => ({
  claimReward: reward => dispatch(doClaimRewardType(reward.reward_type, { notifyError: true })),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(
  select,
  perform
)(RewardLink);
