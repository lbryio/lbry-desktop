import { connect } from 'react-redux';
import ChannelCreate from './view';
import { selectBalance, doCreateChannel } from 'lbry-redux';

const select = state => ({
  balance: selectBalance(state),
});

const perform = dispatch => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
});

export default connect(
  select,
  perform
)(ChannelCreate);
