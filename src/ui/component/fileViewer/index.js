import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import { doChangeVolume } from 'redux/actions/app';
import { selectVolume } from 'redux/selectors/app';
import { doPlayUri, doSetPlayingUri, savePosition } from 'redux/actions/content';
import { doClaimEligiblePurchaseRewards, makeSelectCostInfoForUri } from 'lbryinc';
import {
  makeSelectMetadataForUri,
  makeSelectContentTypeForUri,
  makeSelectClaimForUri,
  makeSelectFileInfoForUri,
  makeSelectLoadingForUri,
  makeSelectDownloadingForUri,
  selectSearchBarFocused,
  makeSelectFirstRecommendedFileForUri,
  makeSelectClaimIsNsfw,
  makeSelectThumbnailForUri,
} from 'lbry-redux';
import { makeSelectClientSetting, selectShowNsfw } from 'redux/selectors/settings';
import { selectPlayingUri, makeSelectContentPositionForUri } from 'redux/selectors/content';
import { selectFileInfoErrors } from 'redux/selectors/file_info';
import FileViewer from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  isLoading: makeSelectLoadingForUri(props.uri)(state),
  isDownloading: makeSelectDownloadingForUri(props.uri)(state),
  playingUri: selectPlayingUri(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  volume: selectVolume(state),
  position: makeSelectContentPositionForUri(props.uri)(state),
  autoplay: makeSelectClientSetting(settings.AUTOPLAY)(state),
  searchBarFocused: selectSearchBarFocused(state),
  fileInfoErrors: selectFileInfoErrors(state),
  nextFileToPlay: makeSelectFirstRecommendedFileForUri(props.uri)(state),
  nsfw: makeSelectClaimIsNsfw(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
});

const perform = dispatch => ({
  play: uri => dispatch(doPlayUri(uri)),
  cancelPlay: () => dispatch(doSetPlayingUri(null)),
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
  savePosition: (claimId, outpoint, position) => dispatch(savePosition(claimId, outpoint, position)),
});

export default connect(
  select,
  perform
)(FileViewer);
