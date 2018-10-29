import { connect } from 'react-redux';
import { doHideNotification, makeSelectMetadataForUri } from 'lbry-redux';
import ModalFileTimeout from './view';

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
});

export default connect(select, perform)(ModalFileTimeout);
