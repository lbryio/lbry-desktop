import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import ChannelCreatePage from './view';

const select = state => ({
  balance: selectBalance(state),
});

export default connect(select, null)(ChannelCreatePage);
