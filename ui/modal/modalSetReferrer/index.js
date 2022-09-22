import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { selectSetReferrerError, selectSetReferrerPending } from 'redux/selectors/user';
import { doUserSetReferrer, doUserSetReferrerReset } from 'redux/actions/user';
import ModalSetReferrer from './view';

const select = (state) => ({
  referrerSetPending: selectSetReferrerPending(state),
  referrerSetError: selectSetReferrerError(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  doUserSetReferrer: (referrerUri) => dispatch(doUserSetReferrer(referrerUri)),
  resetReferrerError: () => dispatch(doUserSetReferrerReset()),
});

export default connect(select, perform)(ModalSetReferrer);
