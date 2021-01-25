import { connect } from 'react-redux';
import { doSetContentHistoryItem, doSetPrimaryUri } from 'redux/actions/content';
import { withRouter } from 'react-router';
import {
  doFetchFileInfo,
  makeSelectFileInfoForUri,
  makeSelectMetadataForUri,
  makeSelectClaimIsNsfw,
  SETTINGS,
  makeSelectClaimIsMine,
  makeSelectClaimForUri,
} from 'lbry-redux';
import { makeSelectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent, makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { makeSelectCommentForCommentId } from 'redux/selectors/comments';
import FilePage from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const linkedCommentId = urlParams.get('lc');

  return {
    linkedComment: makeSelectCommentForCommentId(linkedCommentId)(state),
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    obscureNsfw: !selectShowMatureContent(state),
    isMature: makeSelectClaimIsNsfw(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    videoTheaterMode: makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  };
};

const perform = dispatch => ({
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  setViewed: uri => dispatch(doSetContentHistoryItem(uri)),
  setPrimaryUri: uri => dispatch(doSetPrimaryUri(uri)),
});

export default withRouter(connect(select, perform)(FilePage));
