import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveBlocked from './view';
import { doToggleBlockChannel, selectBlockedChannels } from 'lbry-redux';

const select = (state, props) => ({
  blockedChannels: selectBlockedChannels(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  toggleBlockChannel: uri => dispatch(doToggleBlockChannel(uri)),
});

export default connect(select, perform)(ModalRemoveBlocked);
