import { connect } from 'react-redux';
import { selectUser, selectEmailToVerify } from 'lbryinc';
import { doCreateChannel, selectCreatingChannel, selectMyChannelClaims, selectCreateChannelError } from 'lbry-redux';
import UserFirstChannel from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
  channels: selectMyChannelClaims(state),
  creatingChannel: selectCreatingChannel(state),
  createChannelError: selectCreateChannelError(state),
});

const perform = dispatch => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
});

export default connect(
  select,
  perform
)(UserFirstChannel);
