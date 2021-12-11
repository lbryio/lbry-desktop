import { connect } from 'react-redux';

import { doResolveUri } from 'redux/actions/claims';
import { selectBalance } from 'redux/selectors/wallet';
import RepostPage from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
});

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(RepostPage);
