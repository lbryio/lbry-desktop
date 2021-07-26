import { connect } from 'react-redux';
import { doDeleteFileAndMaybeGoBack } from 'redux/actions/file';
import {
  makeSelectTitleForUri,
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsAbandoningClaimForUri,
} from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveFile from './view';
import { makeSelectSigningIsMine } from 'redux/selectors/content';

const select = (state, props) => ({
  claimIsMine: makeSelectSigningIsMine(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isAbandoning: makeSelectIsAbandoningClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  doResolveUri: (uri) => dispatch(doResolveUri(uri)),
  deleteFile: (uri, deleteFromComputer, abandonClaim) => {
    dispatch(doDeleteFileAndMaybeGoBack(uri, deleteFromComputer, abandonClaim, false));
  },
});

export default connect(select, perform)(ModalRemoveFile);
