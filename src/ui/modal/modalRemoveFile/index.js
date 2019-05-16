import { connect } from 'react-redux';
import { doDeleteFileAndMaybeGoBack } from 'redux/actions/file';
import {
  makeSelectTitleForUri,
  makeSelectClaimIsMine,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
} from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveFile from './view';

const select = (state, props) => ({
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  deleteFile: (fileInfo, deleteFromComputer, abandonClaim) => {
    dispatch(doDeleteFileAndMaybeGoBack(fileInfo, deleteFromComputer, abandonClaim));
  },
});

export default connect(
  select,
  perform
)(ModalRemoveFile);
