import { connect } from 'react-redux';
import { normalizeURI } from 'util/lbryURI';
import { doResolveUri } from 'redux/actions/claims';
import { selectIsUriResolving, selectClaimForUri } from 'redux/selectors/claims';
import { selectOdyseeMembershipForChannelId } from 'redux/selectors/memberships';
import { getChannelIdFromClaim } from 'util/claim';
import UriIndicator from './view';

const select = (state, props) => {
  let uri = null;
  try {
    uri = normalizeURI(props.uri);
  } catch {}

  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    odyseeMembership: selectOdyseeMembershipForChannelId(state, getChannelIdFromClaim(claim)),
    isResolvingUri: selectIsUriResolving(state, props.uri),
    uri,
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(UriIndicator);
