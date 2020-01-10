import { connect } from 'react-redux';
import {
  selectUser,
  doClaimRewardType,
  doUserFetch,
  doUserSetReferrer,
  selectSetReferrerPending,
  selectSetReferrerError,
  rewards as REWARDS,
  selectUnclaimedRewards,
} from 'lbryinc';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import Invited from './view';
import { withRouter } from 'react-router';

const select = state => ({
  user: selectUser(state),
  referrerSetPending: selectSetReferrerPending(state),
  referrerSetError: selectSetReferrerError(state),
  rewards: selectUnclaimedRewards(state),
});

const perform = dispatch => ({
  claimReward: () => dispatch(doClaimRewardType(REWARDS.TYPE_REFEREE)),
  fetchUser: () => dispatch(doUserFetch()),
  setReferrer: referrer => dispatch(doUserSetReferrer(referrer)),
  channelSubscribe: uri => dispatch(doChannelSubscribe(uri)),
});

export default withRouter(
  connect(
    select,
    perform
  )(Invited)
);
