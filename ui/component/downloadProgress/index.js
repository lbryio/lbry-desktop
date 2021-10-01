import { connect } from 'react-redux';
import DownloadProgress from './view';
import { doSetPlayingUri, doStopDownload } from 'redux/actions/content';
const select = (state) => {
  // console.log('DownloadProgress select state', state.fileInfo);

  return {
    downloadList: state.fileInfo.byOutpoint,
  };
};

const perform = (dispatch) => ({
  pause: () => dispatch(doSetPlayingUri({ uri: null })),
  stopDownload: (outpoint, sd_hash) => dispatch(doStopDownload(outpoint, sd_hash)),
});
export default connect(select, perform)(DownloadProgress);
