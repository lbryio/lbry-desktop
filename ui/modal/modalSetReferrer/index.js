import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUserSetReferrer, selectSetReferrerError, selectSetReferrerPending } from 'lbryinc';
import ModalSetReferrer from './view';

const select = state => ({
  referrerSetPending: selectSetReferrerPending(state),
  referrerSetError: selectSetReferrerError(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  setReferrer: (referrer, doClaim) => dispatch(doUserSetReferrer(referrer, doClaim)),
});

export default connect(
  select,
  perform
)(ModalSetReferrer);
