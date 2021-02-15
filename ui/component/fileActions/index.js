import { connect } from 'react-redux';
import {
  makeSelectClaimIsMine,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  doPrepareEdit,
  selectMyChannelClaims,
} from 'lbry-redux';
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
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  prepareEdit: (publishData, uri, fileInfo) => {
    if (publishData.signing_channel) {
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
