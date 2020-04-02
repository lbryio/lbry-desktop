import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
  makeSelectPendingAmountByUri,
  makeSelectClaimIsMine,
} from 'lbry-redux';
import { selectUser } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';

import FileValues from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  user: selectUser(state),
  pendingAmount: makeSelectPendingAmountByUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(FileValues);
