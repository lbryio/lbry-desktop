import { connect } from 'react-redux';
import { makeSelectTagInClaimOrChannelForUri, selectClaimForUri } from 'redux/selectors/claims';
import { doSetPlayingUri } from 'redux/actions/content';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import { getChannelIdFromClaim } from 'util/claim';
import LivestreamPage from './view';

const select = (state, props) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  channelClaimId: getChannelIdFromClaim(selectClaimForUri(state, props.uri)),
  chatDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
});

export default connect(select, {
  doSetPlayingUri,
  doUserSetReferrer,
})(LivestreamPage);
