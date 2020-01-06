import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import {
  makeSelectClaimIsMine,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  doPrepareEdit,
  makeSelectTitleForUri,
  makeSelectMetadataForUri,
  makeSelectThumbnailForUri,
} from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doOpenModal } from 'redux/actions/app';
import fs from 'fs';
import LayoutWrapperNonDocument from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  supportOption: makeSelectClientSetting(SETTINGS.SUPPORT_OPTION)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  prepareEdit: (publishData, uri, fileInfo) => dispatch(doPrepareEdit(publishData, uri, fileInfo, fs)),
});

export default connect(
  select,
  perform
)(LayoutWrapperNonDocument);
