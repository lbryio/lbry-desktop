import { connect } from 'react-redux';
import { makeSelectCanonicalUrlForUri } from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import ClaimUri from './view';

const select = (state, props) => ({
  shortUrl: makeSelectCanonicalUrlForUri(props.uri)(state),
});

export default connect(select, {
  doToast,
})(ClaimUri);
