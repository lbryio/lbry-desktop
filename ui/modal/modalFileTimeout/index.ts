//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectMetadataForUri } from 'redux/selectors/claims';
import { doHideModal } from 'redux/actions/app';
import ModalFileTimeout from './view';

const select = (state: unknown, props: unknown) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = (dispatch: unknown) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalFileTimeout);
