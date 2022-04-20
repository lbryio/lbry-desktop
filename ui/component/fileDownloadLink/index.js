import { connect } from 'react-redux';
import { selectClaimIsMine, selectClaimForUri } from 'redux/selectors/claims';
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
  makeSelectStreamingUrlForUri,
} from 'redux/selectors/file_info';
import { selectCostInfoForUri } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import { doSetPlayingUri, doDownloadUri } from 'redux/actions/content';
import FileDownloadLink from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    downloading: makeSelectDownloadingForUri(props.uri)(state),
    loading: makeSelectLoadingForUri(props.uri)(state),
    claimIsMine: selectClaimIsMine(state, claim),
    claim,
    costInfo: selectCostInfoForUri(state, props.uri),
    streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  pause: () => dispatch(doSetPlayingUri({ uri: null })),
  download: (uri) => dispatch(doDownloadUri(uri)),
});

export default connect(select, perform)(FileDownloadLink);
