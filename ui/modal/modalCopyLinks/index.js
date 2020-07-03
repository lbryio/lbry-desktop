import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { makeSelectClaimForUri } from 'lbry-redux';
import ModalCopyLinks from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalCopyLinks);
