import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import REWARDS from 'rewards';
import { selectUser, selectSetReferrerPending, selectSetReferrerError } from 'redux/selectors/user';
import { doClaimRewardType } from 'redux/actions/rewards';
import { selectUnclaimedRewards } from 'redux/selectors/rewards';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import Invited from './view';

const select = (state, props) => {
  return {
    user: selectUser(state),
    referrerSetPending: selectSetReferrerPending(state),
    referrerSetError: selectSetReferrerError(state),
    rewards: selectUnclaimedRewards(state),
    isSubscribed: selectIsSubscribedForUri(state, props.fullUri),
    fullUri: props.fullUri,
    referrer: props.referrer,
  };
};

const perform = (dispatch) => ({
  claimReward: () => dispatch(doClaimRewardType(REWARDS.TYPE_REFEREE)),
  setReferrer: (referrer) => dispatch(doUserSetReferrer(referrer)),
  channelSubscribe: (uri) => dispatch(doChannelSubscribe(uri)),
});

export default withRouter(connect(select, perform)(Invited));
