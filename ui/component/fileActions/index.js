import { connect } from 'react-redux';
import {
  makeSelectClaimIsMine,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  doPrepareEdit,
  selectMyChannelClaims,
  makeSelectClaimIsStreamPlaceholder,
  makeSelectTagInClaimOrChannelForUri,
} from 'lbry-redux';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { doSetPlayingUri } from 'redux/actions/content';
import { doToast } from 'redux/actions/notifications';
import { doOpenModal, doSetActiveChannel, doSetIncognito } from 'redux/actions/app';
import fs from 'fs';
import FileActions from './view';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  myChannels: selectMyChannelClaims(state),
  isLivestreamClaim: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
  reactionsDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
});

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
});

export default connect(select, perform)(FileActions);
