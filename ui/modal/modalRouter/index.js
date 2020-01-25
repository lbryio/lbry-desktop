import { connect } from 'react-redux';
import { selectModal } from 'redux/selectors/app';
import { doOpenModal, doHideModal } from 'redux/actions/app';
import { selectError } from 'lbry-redux';
import ModalRouter from './view';

const select = (state, props) => ({
  modal: selectModal(state),
  error: selectError(state),
});

const perform = dispatch => ({
  openModal: props => dispatch(doOpenModal(props)),
  hideModal: props => dispatch(doHideModal(props)),
});

export default connect(
  select,
  perform
)(ModalRouter);
