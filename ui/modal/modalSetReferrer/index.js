import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { selectSetReferrerError, selectSetReferrerPending } from 'redux/selectors/user';
import { doUserSetReferrerForUri, doUserSetReferrerReset } from 'redux/actions/user';
import ModalSetReferrer from './view';

const select = (state) => ({
  referrerSetPending: selectSetReferrerPending(state),
  referrerSetError: selectSetReferrerError(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  doUserSetReferrerForUri: (referrerUri) => dispatch(doUserSetReferrerForUri(referrerUri)),
  resetReferrerError: () => dispatch(doUserSetReferrerReset()),
});

export default connect(select, perform)(ModalSetReferrer);
