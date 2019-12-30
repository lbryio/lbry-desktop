import { connect } from 'react-redux';
import EmbedWrapperPage from './view';
import { doResolveUri, makeSelectClaimForUri } from 'lbry-redux';
import { generateStreamUrl } from 'util/lbrytv';

const select = (state, props) => {
  const PROTOCOL = 'lbry://';
  const { match } = props;
  const { params } = match;
  const { claimName, claimId } = params;
  const uri = PROTOCOL + claimName + (claimId ? `#${claimId}` : '');
  return {
    uri,
    claim: makeSelectClaimForUri(uri)(state),
    streamUrl: generateStreamUrl(claimName, claimId),
  };
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(EmbedWrapperPage);
