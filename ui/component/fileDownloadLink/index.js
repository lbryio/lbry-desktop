import { connect } from 'react-redux';
import { selectClaimIsMine, selectClaimForUri, selectProtectedContentTagForUri } from 'redux/selectors/claims';
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
  selectStreamingUrlForUri,
} from 'redux/selectors/file_info';
import { selectCostInfoForUri } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import { doClearPlayingUri, doDownloadUri } from 'redux/actions/content';
import { selectIsProtectedContentLockedFromUserForId } from 'redux/selectors/memberships';
import FileDownloadLink from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    costInfo: selectCostInfoForUri(state, props.uri),
    downloading: makeSelectDownloadingForUri(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    loading: makeSelectLoadingForUri(props.uri)(state),
    streamingUrl: selectStreamingUrlForUri(state, props.uri),
    contentRestrictedFromUser: claim && selectIsProtectedContentLockedFromUserForId(state, claim.claim_id),
    isProtectedContent: Boolean(selectProtectedContentTagForUri(state, props.uri)),
  };
};

const perform = (dispatch) => ({
  download: (uri) => dispatch(doDownloadUri(uri)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  pause: () => dispatch(doClearPlayingUri()),
});

export default connect(select, perform)(FileDownloadLink);
