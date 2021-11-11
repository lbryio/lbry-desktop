import { connect } from 'react-redux';
import {
  selectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  selectClaimIsMine,
} from 'redux/selectors/claims';
import { makeSelectPendingAmountByUri } from 'redux/selectors/wallet';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { selectUser } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';

import FileValues from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    contentType: makeSelectContentTypeForUri(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    user: selectUser(state),
    pendingAmount: makeSelectPendingAmountByUri(props.uri)(state),
    claimIsMine: selectClaimIsMine(state, claim),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(FileValues);
