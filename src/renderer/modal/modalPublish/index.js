import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import ModalSendTip from './view';
import { doClearPublish } from 'redux/actions/publish';
import { doNavigate } from 'redux/actions/navigation';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
  clearPublish: () => dispatch(doClearPublish()),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(null, perform)(ModalSendTip);
