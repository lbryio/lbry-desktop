import { connect } from 'react-redux';
import { normalizeURI } from 'util/lbryURI';
import { doResolveUri } from 'redux/actions/claims';
import { selectIsUriResolving, selectClaimForUri } from 'redux/selectors/claims';
import UriIndicator from './view';

const select = (state, props) => {
  let uri = null;
  try {
    uri = normalizeURI(props.uri);
  } catch {}

  return {
    claim: selectClaimForUri(state, props.uri),
    isResolvingUri: selectIsUriResolving(state, props.uri),
    uri,
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(UriIndicator);
