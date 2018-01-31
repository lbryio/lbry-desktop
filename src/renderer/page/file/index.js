import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doFetchFileInfo } from 'redux/actions/file_info';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { selectRewardContentClaimIds, selectPlayingUri } from 'redux/selectors/content';
import { doFetchCostInfoForUri } from 'redux/actions/cost_info';
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from 'redux/selectors/claims';
import { makeSelectCostInfoForUri } from 'redux/selectors/cost_info';
import { selectShowNsfw } from 'redux/selectors/settings';
import { selectMediaPaused } from 'redux/selectors/media';
import FilePage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
  playingUri: selectPlayingUri(state),
  isPaused: selectMediaPaused(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
});

export default connect(select, perform)(FilePage);
