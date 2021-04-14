import { connect } from 'react-redux';
import { makeSelectClaimForUri, doResolveUri } from 'lbry-redux';
import AdsTestPage from './view';

export default connect(
  (state) => ({
    claim: makeSelectClaimForUri('lbry://fullscreenrelease#7')(state),
  }),
  {
    doResolveUri,
  }
)(AdsTestPage);
