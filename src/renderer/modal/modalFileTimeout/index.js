import { connect } from 'react-redux';
import { doCloseModal, makeSelectMetadataForUri } from 'lbry-redux';
import ModalFileTimeout from './view';

const select = state => ({
  // eslint-disable-next-line no-undef
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalFileTimeout);
