import { LBRY_URL_FOR_LIVESTREAM } from 'constants/livestream';
import { connect } from 'react-redux';
import { doResolveUri, makeSelectClaimForUri } from 'lbry-redux';
import LivestreamPage from './view';

const select = state => ({
  //   uri: LBRY_URL_FOR_LIVESTREAM,
  //   claim: makeSelectClaimForUri(LBRY_URL_FOR_LIVESTREAM)(state),
});

export default connect(select, {
  doResolveUri,
})(LivestreamPage);
