import { connect } from 'react-redux';
import { selectModal } from 'redux/selectors/app';
import { doHideModal } from 'redux/actions/app';
import { selectError } from 'redux/selectors/notifications'; // RENAME THIS 'selectNotificationError'
import ModalRouter from './view';

const select = (state, props) => ({
  modal: selectModal(state),
  error: selectError(state),
});

const perform = {
  doHideModal,
};

export default connect(select, perform)(ModalRouter);
