import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doResolveUri } from 'redux/actions/claims';
import ModalRepost from './view';

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(null, perform)(ModalRepost);
