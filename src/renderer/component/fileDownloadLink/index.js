import { connect } from 'react-redux';
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
  makeSelectCostInfoForUri,
} from 'lbry-redux';
import { doOpenFileInShell } from 'redux/actions/file';
import { doPurchaseUri, doStartDownload } from 'redux/actions/content';
import { doPause } from 'redux/actions/media';
import FileDownloadLink from './view';

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  /* availability check is disabled due to poor performance, TBD if it dies forever or requires daemon fix */
  downloading: makeSelectDownloadingForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  loading: makeSelectLoadingForUri(props.uri)(state),
});

const perform = dispatch => ({
  openInShell: path => dispatch(doOpenFileInShell(path)),
  purchaseUri: uri => dispatch(doPurchaseUri(uri)),
  restartDownload: (uri, outpoint) => dispatch(doStartDownload(uri, outpoint)),
  doPause: () => dispatch(doPause()),
});

export default connect(select, perform)(FileDownloadLink);
