import { connect } from 'react-redux';
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
  makeSelectClaimIsMine,
} from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { doSetPlayingUri, doPlayUri } from 'redux/actions/content';
import FileDownloadLink from './view';

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  downloading: makeSelectDownloadingForUri(props.uri)(state),
  loading: makeSelectLoadingForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  pause: () => dispatch(doSetPlayingUri(null)),
  download: uri => dispatch(doPlayUri(uri, false, true)),
});

export default connect(
  select,
  perform
)(FileDownloadLink);
