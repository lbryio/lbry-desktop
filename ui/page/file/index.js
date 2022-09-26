import { connect } from 'react-redux';
import { doSetContentHistoryItem, doSetPrimaryUri, clearPosition } from 'redux/actions/content';
import { withRouter } from 'react-router-dom';
import {
  selectClaimIsNsfwForUri,
  selectIsStreamPlaceholderForUri,
  selectClaimForUri,
  selectClaimWasPurchasedForUri,
  selectPurchaseTagForUri,
  selectPreorderTagForUri,
  selectRentalTagForUri,
} from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { LINKED_COMMENT_QUERY_PARAM, THREAD_COMMENT_QUERY_PARAM } from 'constants/comment';
import * as SETTINGS from 'constants/settings';
import { selectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent, selectClientSetting } from 'redux/selectors/settings';
import {
  makeSelectFileRenderModeForUri,
  selectContentPositionForUri,
  selectPlayingCollectionId,
  selectIsUriCurrentlyPlaying,
} from 'redux/selectors/content';
import { selectCommentsListTitleForUri, selectCommentsDisabledSettingForChannelId } from 'redux/selectors/comments';
import { doToggleAppDrawer, doSetMainPlayerDimension } from 'redux/actions/app';
import { getChannelIdFromClaim } from 'util/claim';
import { doFileGetForUri } from 'redux/actions/file';
import { doCheckIfPurchasedClaimId } from 'redux/actions/stripe';

import FilePage from './view';

const select = (state, props) => {
  const { uri } = props;
  const { search } = location;

  const urlParams = new URLSearchParams(search);
  const playingCollectionId = selectPlayingCollectionId(state);
  const claim = selectClaimForUri(state, uri);
  const channelId = getChannelIdFromClaim(claim);

  return {
    playingCollectionId,
    linkedCommentId: urlParams.get(LINKED_COMMENT_QUERY_PARAM),
    threadCommentId: urlParams.get(THREAD_COMMENT_QUERY_PARAM),
    costInfo: selectCostInfoForUri(state, uri),
    obscureNsfw: !selectShowMatureContent(state),
    isMature: selectClaimIsNsfwForUri(state, uri),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
    commentSettingDisabled: selectCommentsDisabledSettingForChannelId(state, channelId),
    isLivestream: selectIsStreamPlaceholderForUri(state, uri),
    position: selectContentPositionForUri(state, uri),
    audioVideoDuration: claim?.value?.video?.duration || claim?.value?.audio?.duration,
    commentsListTitle: selectCommentsListTitleForUri(state, uri),
    claimWasPurchased: selectClaimWasPurchasedForUri(state, uri),
    isUriPlaying: selectIsUriCurrentlyPlaying(state, uri),
    purchaseTag: selectPurchaseTagForUri(state, props.uri),
    preorderTag: selectPreorderTagForUri(state, props.uri),
    rentalTag: selectRentalTagForUri(state, props.uri),
    claimId: claim.claim_id,
  };
};

const perform = {
  doFetchCostInfoForUri,
  doSetContentHistoryItem,
  doSetPrimaryUri,
  clearPosition,
  doToggleAppDrawer,
  doFileGetForUri,
  doSetMainPlayerDimension,
  doCheckIfPurchasedClaimId,
};

export default withRouter(connect(select, perform)(FilePage));
