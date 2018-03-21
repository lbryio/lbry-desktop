import { connect } from 'react-redux';
import { doQuit, doQuitAnyDaemon } from 'redux/actions/app';
import ModalIncompatibleDaemon from './view';

const perform = dispatch => ({
  quit: () => dispatch(doQuit()),
  quitAnyDaemon: () => dispatch(doQuitAnyDaemon()),
});

export default connect(null, perform)(ModalIncompatibleDaemon);
