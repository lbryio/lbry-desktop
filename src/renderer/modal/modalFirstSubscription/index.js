import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import ModalFirstSubscription from './view';

const perform = dispatch => () => ({
  closeModal: () => dispatch(doHideModal()),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(
  null,
  perform
)(ModalFirstSubscription);
