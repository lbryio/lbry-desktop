import { connect } from 'react-redux';
import { selectUser, selectEmailToVerify } from 'redux/selectors/user';
import { selectCreatingChannel, selectMyChannelClaims, selectCreateChannelError } from 'redux/selectors/claims';
import { doCreateChannel } from 'redux/actions/claims';
import { doOpenModal } from 'redux/actions/app';
import UserFirstChannel from './view';

const select = (state) => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
  channels: selectMyChannelClaims(state),
  creatingChannel: selectCreatingChannel(state),
  createChannelError: selectCreateChannelError(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  createChannel: (name, amount, optionalParams) => dispatch(doCreateChannel(name, amount, optionalParams)),
});

export default connect(select, perform)(UserFirstChannel);
