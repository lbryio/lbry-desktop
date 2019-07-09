import { connect } from 'react-redux';
import { makeSelectShortUrlForUri, doToast } from 'lbry-redux';
import ClaimUri from './view';

const select = (state, props) => ({
  shortUrl: makeSelectShortUrlForUri(props.uri)(state),
});

export default connect(
  select,
  {
    doToast,
  }
)(ClaimUri);
