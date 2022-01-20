import { connect } from 'react-redux';
import { doSetContentHistoryItem, doSetPrimaryUri, clearPosition } from 'redux/actions/content';
import { withRouter } from 'react-router-dom';
import {
  makeSelectMetadataForUri,
  makeSelectClaimIsNsfw,
  makeSelectTagInClaimOrChannelForUri,
} from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { doFetchFileInfo } from 'redux/actions/file_info';
import { makeSelectCollectionForId } from 'redux/selectors/collections';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import * as SETTINGS from 'constants/settings';
import { selectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent, makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri, makeSelectContentPositionForUri } from 'redux/selectors/content';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';

import FilePage from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  return {
    linkedCommentId: urlParams.get('lc'),
    costInfo: selectCostInfoForUri(state, props.uri),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    obscureNsfw: !selectShowMatureContent(state),
    isMature: makeSelectClaimIsNsfw(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    videoTheaterMode: makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)(state),
    commentsDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionId,
    position: makeSelectContentPositionForUri(props.uri)(state),
  };
};

const perform = (dispatch) => ({
  fetchFileInfo: (uri) => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: (uri) => dispatch(doFetchCostInfoForUri(uri)),
  setViewed: (uri) => dispatch(doSetContentHistoryItem(uri)),
  setPrimaryUri: (uri) => dispatch(doSetPrimaryUri(uri)),
  clearPosition: (uri) => dispatch(clearPosition(uri)),
});

export default withRouter(connect(select, perform)(FilePage));
