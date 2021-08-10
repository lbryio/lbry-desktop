import { connect } from 'react-redux';
import { doSetContentHistoryItem, doSetPrimaryUri } from 'redux/actions/content';
import { withRouter } from 'react-router-dom';
import {
  doFetchFileInfo,
  makeSelectFileInfoForUri,
  makeSelectMetadataForUri,
  makeSelectClaimIsNsfw,
  SETTINGS,
  makeSelectTagInClaimOrChannelForUri,
  makeSelectClaimIsStreamPlaceholder,
  makeSelectCollectionForId,
  COLLECTIONS_CONSTS,
} from 'lbry-redux';
import { makeSelectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent, makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';

import FilePage from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  return {
    linkedCommentId: urlParams.get('lc'),
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    obscureNsfw: !selectShowMatureContent(state),
    isMature: makeSelectClaimIsNsfw(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    videoTheaterMode: makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)(state),
    commentsDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
    isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionId,
  };
};

const perform = (dispatch) => ({
  fetchFileInfo: (uri) => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: (uri) => dispatch(doFetchCostInfoForUri(uri)),
  setViewed: (uri) => dispatch(doSetContentHistoryItem(uri)),
  setPrimaryUri: (uri) => dispatch(doSetPrimaryUri(uri)),
});

export default withRouter(connect(select, perform)(FilePage));
