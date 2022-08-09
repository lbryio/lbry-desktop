import { connect } from 'react-redux';
import { selectUser, selectEmailToVerify } from 'redux/selectors/user';
import { selectCreatingChannel, selectMyChannelClaims, selectCreateChannelError } from 'redux/selectors/claims';
import { doCreateChannel } from 'redux/actions/claims';
import UserFirstChannel from './view';

const select = (state) => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
  channels: selectMyChannelClaims(state),
  creatingChannel: selectCreatingChannel(state),
  createChannelError: selectCreateChannelError(state),
});

const perform = (dispatch) => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
});

export default connect(select, perform)(UserFirstChannel);
