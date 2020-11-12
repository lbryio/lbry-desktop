import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doToggleBlockChannel } from 'redux/actions/blocked';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import ModalRemoveBlocked from './view';

const select = (state, props) => ({
  blockedChannels: selectBlockedChannels(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  toggleBlockChannel: uri => dispatch(doToggleBlockChannel(uri)),
});

export default connect(select, perform)(ModalRemoveBlocked);
