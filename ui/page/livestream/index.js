import { connect } from 'react-redux';
import { doResolveUri, makeSelectTagInClaimOrChannelForUri, makeSelectClaimForUri } from 'lbry-redux';
import { doSetPlayingUri } from 'redux/actions/content';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectHasUnclaimedRefereeReward } from 'redux/selectors/rewards';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import LivestreamPage from './view';

const select = (state, props) => ({
  hasUnclaimedRefereeReward: selectHasUnclaimedRefereeReward(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  channelClaim: makeSelectClaimForUri(props.uri)(state),
  chatDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
});

export default connect(select, {
  doSetPlayingUri,
  doResolveUri,
  doUserSetReferrer,
})(LivestreamPage);
