import { connect } from 'react-redux';
import DownloadProgress from './view';
import { doSetPlayingUri, doStopDownload, doContinueDownloading, doPurchaseUriWrapper } from 'redux/actions/content';
import { selectFileInfosByOutpoint, SETTINGS } from 'lbry-redux';
import { selectPrimaryUri, selectPlayingUri } from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = (state) => {
  const byOutpoint = selectFileInfosByOutpoint(state);
  const runningByOutpoint = [];
  const primaryUri = selectPrimaryUri(state);
  const playingUri = selectPlayingUri(state);
  const uri = playingUri ? playingUri.uri : null;
  let primaryOutpoint = null;
  let playingOutpoint = null;

  for (const key in byOutpoint) {
    const item = byOutpoint[key];

    if (item && primaryUri && primaryUri.includes(`/${item.claim_name}`)) primaryOutpoint = item.outpoint;
    if (item && uri && uri.includes(`/${item.claim_name}`)) playingOutpoint = item.outpoint;

    if (item && item.status === 'running') {
      runningByOutpoint.push(item);
    }
  }

  return {
    byOutpoint: selectFileInfosByOutpoint(state),
    primary: {
      uri: primaryUri,
      outpoint: primaryOutpoint,
    },
    playing: {
      uri,
      outpoint: playingOutpoint,
    },
    currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  };
};

const perform = (dispatch) => ({
  pause: () => dispatch(doSetPlayingUri({ uri: null })),
  doContinueDownloading: (outpoint, force) => dispatch(doContinueDownloading(outpoint, force)),
  stopDownload: (outpoint) => dispatch(doStopDownload(outpoint)),
  download: (uri) => dispatch(doPurchaseUriWrapper(uri, false, true)),
});
export default connect(select, perform)(DownloadProgress);
