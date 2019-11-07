import { connect } from 'react-redux';
import { makeSelectCanonicalUrlForUri, doToast } from 'lbry-redux';
import ClaimUri from './view';

const select = (state, props) => ({
  shortUrl: makeSelectCanonicalUrlForUri(props.uri)(state),
});

export default connect(
  select,
  {
    doToast,
  }
)(ClaimUri);
