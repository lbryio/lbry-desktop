//@ts-nocheck
import {connect} from 'react-redux';
import { doQuitAnyDaemon } from 'redux/actions/app';
import ModalIncompatibleDaemon from './view';

const perform = (dispatch: unknown) => ({
  quitAnyDaemon: () => dispatch(doQuitAnyDaemon()),
});

export default connect(
  null,
  perform
)(ModalIncompatibleDaemon);
