import { connect } from 'react-redux';
import { selectCanonicalUrlForUri } from 'redux/selectors/claims';
import { doToast } from 'redux/actions/notifications';
import ClaimUri from './view';

const select = (state, props) => ({
  shortUrl: selectCanonicalUrlForUri(state, props.uri),
});

export default connect(select, {
  doToast,
})(ClaimUri);
