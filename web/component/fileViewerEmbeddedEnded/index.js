import { connect } from 'react-redux';
import fileViewerEmbeddedEnded from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { makeSelectTagInClaimOrChannelForUri } from 'redux/selectors/claims';
import { PREFERENCE_EMBED } from 'constants/tags';

export default connect((state, props) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  preferEmbed: makeSelectTagInClaimOrChannelForUri(props.uri, PREFERENCE_EMBED)(state),
}))(fileViewerEmbeddedEnded);
