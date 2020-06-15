import { connect } from 'react-redux';
import { makeSelectRewardByClaimCode, makeSelectIsRewardClaimPending } from 'redux/selectors/rewards';
import { doClaimRewardType } from 'redux/actions/rewards';

import RewardLink from './view';

const select = (state, props) => ({
  isPending: makeSelectIsRewardClaimPending()(state, props),
  reward: makeSelectRewardByClaimCode()(state, props.claim_code),
});

const perform = dispatch => ({
  claimReward: reward =>
    dispatch(doClaimRewardType(reward.reward_type, { notifyError: true, params: { claim_code: reward.claim_code } })),
});

export default connect(select, perform)(RewardLink);
