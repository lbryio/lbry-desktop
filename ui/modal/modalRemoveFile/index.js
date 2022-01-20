import { connect } from 'react-redux';
import { doDeleteFileAndMaybeGoBack } from 'redux/actions/file';
import {
  selectTitleForUri,
  selectClaimForUri,
  makeSelectIsAbandoningClaimForUri,
  selectClaimIsMineForUri,
} from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveFile from './view';

const select = (state, props) => ({
  claimIsMine: selectClaimIsMineForUri(state, props.uri),
  title: selectTitleForUri(state, props.uri),
  claim: selectClaimForUri(state, props.uri),
  isAbandoning: makeSelectIsAbandoningClaimForUri(props.uri)(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  doResolveUri: (uri) => dispatch(doResolveUri(uri)),
  deleteFile: (uri, deleteFromComputer, abandonClaim, doGoBack) => {
    dispatch(doDeleteFileAndMaybeGoBack(uri, deleteFromComputer, abandonClaim, doGoBack));
  },
});

export default connect(select, perform)(ModalRemoveFile);
