import { connect } from 'react-redux';
import { makeSelectMetadataForUri } from 'redux/selectors/claims';
import { doHideModal } from 'redux/actions/app';
import ModalFileTimeout from './view';

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalFileTimeout);
