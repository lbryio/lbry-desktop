import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUserSetReferrer } from 'lbryinc';
import ModalSetReferrer from './view';

const select = state => ({});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  submitReferrer: referrer => dispatch(doUserSetReferrer(referrer)),
});

export default connect(
  select,
  perform
)(ModalSetReferrer);
