import { connect } from 'react-redux';
import {
  selectClaimIsMine,
  selectClaimForUri,
  selectHasChannels,
  selectIsStreamPlaceholderForUri,
  makeSelectTagInClaimOrChannelForUri,
} from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import { doEditForChannel } from 'redux/actions/publish';
import { selectCostInfoForUri } from 'lbryinc';
import { doClearPlayingUri, doDownloadUri } from 'redux/actions/content';
import { doToast } from 'redux/actions/notifications';
import { doOpenModal } from 'redux/actions/app';
import FileActions from './view';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { DISABLE_DOWNLOAD_BUTTON_TAG } from 'constants/tags';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    costInfo: selectCostInfoForUri(state, uri),
    hasChannels: selectHasChannels(state),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, uri),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    disableDownloadButton: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_DOWNLOAD_BUTTON_TAG)(state),
  };
};

const perform = {
  doOpenModal,
  doEditForChannel,
  doClearPlayingUri,
  doToast,
  doDownloadUri,
};

export default connect(select, perform)(FileActions);
