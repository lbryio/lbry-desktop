import { connect } from 'react-redux';
import { doResolveUri, makeSelectClaimForUri } from 'lbry-redux';
import { doSetPlayingUri } from 'redux/actions/content';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectHasUnclaimedRefereeReward } from 'redux/selectors/rewards';
import LivestreamPage from './view';

const select = (state, props) => ({
  hasUnclaimedRefereeReward: selectHasUnclaimedRefereeReward(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  channelClaim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, {
  doSetPlayingUri,
  doResolveUri,
  doUserSetReferrer,
})(LivestreamPage);
