import { connect } from 'react-redux';
import { selectClaimIsMine, selectClaimForUri, makeSelectClaimWasPurchased } from 'redux/selectors/claims';
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
  makeSelectStreamingUrlForUri,
} from 'redux/selectors/file_info';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { doOpenModal, doAnalyticsView } from 'redux/actions/app';
import { doSetPlayingUri, doPlayUri } from 'redux/actions/content';
import FileDownloadLink from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    downloading: makeSelectDownloadingForUri(props.uri)(state),
    loading: makeSelectLoadingForUri(props.uri)(state),
    claimIsMine: selectClaimIsMine(state, claim),
    claim,
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
    streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  pause: () => dispatch(doSetPlayingUri({ uri: null })),
  download: (uri) => dispatch(doPlayUri(uri, false, true, () => dispatch(doAnalyticsView(uri)))),
});

export default connect(select, perform)(FileDownloadLink);
