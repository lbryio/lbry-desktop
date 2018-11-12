import React from 'react';
import { connect } from 'react-redux';
import { doStartUpgrade, doCancelUpgrade } from 'redux/actions/app';
import { doHideNotification } from 'lbry-redux';
import {
  selectDownloadProgress,
  selectDownloadComplete,
  selectUpgradeDownloadPath,
} from 'redux/selectors/app';
import ModalDownloading from './view';

const select = state => ({
  downloadProgress: selectDownloadProgress(state),
  downloadComplete: selectDownloadComplete(state),
  downloadItem: selectUpgradeDownloadPath(state),
});

const perform = dispatch => ({
  startUpgrade: () => dispatch(doStartUpgrade()),
  cancelUpgrade: () => {
    dispatch(doHideNotification());
    dispatch(doCancelUpgrade());
  },
});

export default connect(
  select,
  perform
)(ModalDownloading);
