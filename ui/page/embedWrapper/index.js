import { connect } from 'react-redux';
import EmbedWrapperPage from './view';
import { doResolveUri, makeSelectClaimForUri, buildURI } from 'lbry-redux';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { claimName, claimId } = params;
  const uri = claimName && claimId ? buildURI({ claimName, claimId }) : '';
  return {
    uri,
    claim: makeSelectClaimForUri(uri)(state),
  };
};

const perform = dispatch => {
  return {
    resolveUri: uri => dispatch(doResolveUri(uri)),
  };
};

export default connect(select, perform)(EmbedWrapperPage);
