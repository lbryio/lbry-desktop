import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { selectBalance } from 'redux/selectors/wallet';
import RepostPage from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
});

const perform = {
  resolveUri: doResolveUri,
};

export default connect(select, perform)(RepostPage);
