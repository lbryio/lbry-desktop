import { connect } from 'react-redux';
import { Lbryuri, doResolveUri, makeSelectIsUriResolving, makeSelectClaimForUri } from 'lbry-redux';
import UriIndicator from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  uri: Lbryuri.normalize(props.uri),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(UriIndicator);
