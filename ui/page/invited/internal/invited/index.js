import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { selectUserVerifiedEmail, selectReferrer, selectSetReferrerError } from 'redux/selectors/user';
import { doClaimRefereeReward } from 'redux/actions/rewards';
import { selectHasUnclaimedRefereeReward } from 'redux/selectors/rewards';
import { doUserSetReferrerForUri } from 'redux/actions/user';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectChannelTitleForUri } from 'redux/selectors/claims';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import Invited from './view';

const select = (state, props) => {
  const { referrerUri } = props;

  return {
    userHasVerifiedEmail: selectUserVerifiedEmail(state),
    referrerSet: selectReferrer(state),
    referrerSetError: selectSetReferrerError(state),
    hasUnclaimedRefereeReward: selectHasUnclaimedRefereeReward(state),
    isSubscribed: selectIsSubscribedForUri(state, referrerUri),
    channelTitle: selectChannelTitleForUri(state, referrerUri),
  };
};

const perform = {
  doClaimRefereeReward,
  doUserSetReferrerForUri,
  doChannelSubscribe,
};

export default withRouter(connect(select, perform)(Invited));
