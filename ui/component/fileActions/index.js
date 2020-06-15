import { connect } from 'react-redux';
import { makeSelectClaimIsMine, makeSelectFileInfoForUri, makeSelectClaimForUri, doPrepareEdit } from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import fs from 'fs';
import FileActions from './view';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  prepareEdit: (publishData, uri, fileInfo) => dispatch(doPrepareEdit(publishData, uri, fileInfo, fs)),
});

export default connect(select, perform)(FileActions);
