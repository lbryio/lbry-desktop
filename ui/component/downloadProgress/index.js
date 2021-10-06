import { connect } from 'react-redux';
import DownloadProgress from './view';
import { doSetPlayingUri, doStopDownload, doUpdateDownloadingStatus } from 'redux/actions/content';
import { selectFileInfosByOutpoint } from 'lbry-redux';
import { selectPrimaryUri, selectPlayingUri } from 'redux/selectors/content';
const select = (state) => {
  const byOutpoint = selectFileInfosByOutpoint(state);
  const runningByOutpoint = [];
  const primaryUri = selectPrimaryUri(state);
  const playingUri = selectPlayingUri(state);
  const uri = playingUri ? playingUri.uri : null;

  for (const key in byOutpoint) {
    const item = byOutpoint[key];

    if (item && item.status === 'running') {
      if (
        (!primaryUri || !primaryUri.includes(`/${item.claim_name}`)) &&
        (!uri || !uri.includes(`/${item.claim_name}`))
      ) {
        runningByOutpoint.push(item);
      }
    }
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
