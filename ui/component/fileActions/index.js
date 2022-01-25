import { connect } from 'react-redux';
import {
  selectClaimIsMine,
  selectClaimForUri,
  selectHasChannels,
  selectIsStreamPlaceholderForUri,
  makeSelectTagInClaimOrChannelForUri,
} from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri, makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { doPrepareEdit } from 'redux/actions/publish';
import { selectCostInfoForUri } from 'lbryinc';
import { doSetPlayingUri, doPlayUri } from 'redux/actions/content';
import { doToast } from 'redux/actions/notifications';
import { doOpenModal, doSetActiveChannel, doSetIncognito, doAnalyticsView } from 'redux/actions/app';
import fs from 'fs';
import FileActions from './view';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { DISABLE_DOWNLOAD_BUTTON_TAG } from 'constants/tags';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    costInfo: selectCostInfoForUri(state, props.uri),
    hasChannels: selectHasChannels(state),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, props.uri),
    streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
    disableDownloadButton: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_DOWNLOAD_BUTTON_TAG)(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  prepareEdit: (publishData, uri, fileInfo) => {
    if (publishData.signing_channel) {
      dispatch(doSetIncognito(false));
      dispatch(doSetActiveChannel(publishData.signing_channel.claim_id));
    } else {
      dispatch(doSetIncognito(true));
    }

    dispatch(doPrepareEdit(publishData, uri, fileInfo, fs));
  },
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  doToast: (options) => dispatch(doToast(options)),
  download: (uri) => dispatch(doPlayUri(uri, false, true, () => dispatch(doAnalyticsView(uri)))),
});

export default connect(select, perform)(FileActions);
