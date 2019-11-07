import { connect } from 'react-redux';
import { doDeleteFileAndMaybeGoBack } from 'redux/actions/file';
import { makeSelectTitleForUri, makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveFile from './view';

const select = (state, props) => ({
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  deleteFile: (uri, deleteFromComputer, abandonClaim) => {
    dispatch(doDeleteFileAndMaybeGoBack(uri, deleteFromComputer, abandonClaim));
  },
});

export default connect(
  select,
  perform
)(ModalRemoveFile);
