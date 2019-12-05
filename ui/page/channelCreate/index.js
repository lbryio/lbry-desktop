import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import ChannelCreatePage from './view';
import { withRouter } from 'react-router';

const select = state => ({
  balance: selectBalance(state),
});

export default withRouter(connect(select, null)(ChannelCreatePage));
