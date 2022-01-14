import { connect } from 'react-redux';
import { doDeleteFileAndMaybeGoBack } from 'redux/actions/file';
import {
  makeSelectTitleForUri,
  selectClaimForUri,
  makeSelectIsAbandoningClaimForUri,
  makeSelectClaimIsMine,
} from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveFile from './view';

const select = (state, props) => ({
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  claim: selectClaimForUri(state, props.uri),
  isAbandoning: makeSelectIsAbandoningClaimForUri(props.uri)(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  doResolveUri: (uri) => dispatch(doResolveUri(uri)),
  deleteFile: (uri, deleteFromComputer, abandonClaim, doGoBack, claim) => {
    dispatch(doDeleteFileAndMaybeGoBack(uri, deleteFromComputer, abandonClaim, doGoBack, claim));
  },
});

export default connect(select, perform)(ModalRemoveFile);
