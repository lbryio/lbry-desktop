import { connect } from 'react-redux';
import { doStartUpgrade, doCancelUpgrade, doHideModal } from 'redux/actions/app';
import { selectDownloadProgress, selectDownloadComplete, selectUpgradeDownloadPath } from 'redux/selectors/app';
import ModalDownloading from './view';

const select = state => ({
  downloadProgress: selectDownloadProgress(state),
  downloadComplete: selectDownloadComplete(state),
  downloadItem: selectUpgradeDownloadPath(state),
});

const perform = dispatch => ({
  startUpgrade: () => dispatch(doStartUpgrade()),
  cancelUpgrade: () => {
    dispatch(doHideModal());
    dispatch(doCancelUpgrade());
  },
});

export default connect(
  select,
  perform
)(ModalDownloading);
