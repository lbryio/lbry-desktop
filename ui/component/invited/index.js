import { connect } from 'react-redux';
import {
  selectUser,
  doClaimRewardType,
  doUserFetch,
  doUserSetReferrer,
  selectSetReferrerPending,
  selectSetReferrerError,
  rewards as REWARDS,
} from 'lbryinc';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import Invited from './view';
import { withRouter } from 'react-router';

const select = state => ({
  user: selectUser(state),
  setReferrerPending: selectSetReferrerPending(state),
  setReferrerError: selectSetReferrerError(state),
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
