import { connect } from 'react-redux';
import DownloadProgress from './view';
import { doSetPlayingUri, doStopDownload, doUpdateDownloadingStatus } from 'redux/actions/content';
import { selectFileInfosByOutpoint } from 'lbry-redux';

const select = (state) => {
  const byOutpoint = selectFileInfosByOutpoint(state);
  const runningByOutpoint = [];

  for (const key in byOutpoint) {
    if (byOutpoint[key] && byOutpoint[key].status === 'running') runningByOutpoint.push(byOutpoint[key]);
  }

  return {
    downloadList: runningByOutpoint,
  };
};

const perform = (dispatch) => ({
  pause: () => dispatch(doSetPlayingUri({ uri: null })),
  updateDownloadingStatus: (outpoint) => dispatch(doUpdateDownloadingStatus(outpoint)),
  stopDownload: (outpoint) => dispatch(doStopDownload(outpoint)),
});
export default connect(select, perform)(DownloadProgress);
