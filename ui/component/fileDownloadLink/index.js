import { connect } from 'react-redux';
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
  makeSelectClaimIsMine,
  makeSelectClaimForUri,
} from 'lbry-redux';
import { doOpenModal, doAnalyticsView } from 'redux/actions/app';
import { doSetPlayingUri, doPlayUri } from 'redux/actions/content';
import FileDownloadLink from './view';

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  downloading: makeSelectDownloadingForUri(props.uri)(state),
  loading: makeSelectLoadingForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  pause: () => dispatch(doSetPlayingUri(null)),
  download: uri => dispatch(doPlayUri(uri, false, true, () => dispatch(doAnalyticsView(uri)))),
});

export default connect(
  select,
  perform
)(FileDownloadLink);
