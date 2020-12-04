import { connect } from 'react-redux';

import { doResolveUri, selectBalance } from 'lbry-redux';

import RepostPage from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(RepostPage);
