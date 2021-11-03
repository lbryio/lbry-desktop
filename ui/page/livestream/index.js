import { connect } from 'react-redux';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import { doClaimSearch } from 'redux/actions/claims';
import { doSetPlayingUri } from 'redux/actions/content';
import { doUserSetReferrer } from 'redux/actions/user';
import { makeSelectTagInClaimOrChannelForUri, makeSelectClaimForUri } from 'redux/selectors/claims';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import LivestreamPage from './view';

const select = (state, props) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  channelClaim: makeSelectClaimForUri(props.uri)(state),
  chatDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
});

const perform = (dispatch) => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  doClaimSearch: (options, cb) => dispatch(doClaimSearch(options, cb)),
  setReferrer: (referrer) => dispatch(doUserSetReferrer(referrer)),
});

export default connect(select, perform)(LivestreamPage);
