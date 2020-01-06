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
import Invited from './view';

const select = state => ({
  user: selectUser(state),
  setReferrerPending: selectSetReferrerPending(state),
  setReferrerError: selectSetReferrerError(state),
});

const perform = dispatch => ({
  claimReward: () => dispatch(doClaimRewardType(REWARDS.TYPE_REFEREE)),
  fetchUser: () => dispatch(doUserFetch()),
  setReferrer: referrer => dispatch(doUserSetReferrer(referrer)),
});

export default connect(
  select,
  perform
)(Invited);
