import { connect } from 'react-redux';
import {
  selectUser,
  doClaimRewardType,
  doUserSetReferrer,
  selectSetReferrerPending,
  selectSetReferrerError,
  rewards as REWARDS,
  selectUnclaimedRewards,
} from 'lbryinc';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import Invited from './view';
import { withRouter } from 'react-router';

const select = (state, props) => {
  return {
    user: selectUser(state),
    referrerSetPending: selectSetReferrerPending(state),
    referrerSetError: selectSetReferrerError(state),
    rewards: selectUnclaimedRewards(state),
    isSubscribed: makeSelectIsSubscribed(props.fullUri)(state),
    fullUri: props.fullUri,
    referrer: props.referrer,
  };
};

const perform = dispatch => ({
  claimReward: () => dispatch(doClaimRewardType(REWARDS.TYPE_REFEREE)),
  setReferrer: referrer => dispatch(doUserSetReferrer(referrer)),
  channelSubscribe: uri => dispatch(doChannelSubscribe(uri)),
});

export default withRouter(
  connect(
    select,
    perform
  )(Invited)
);
