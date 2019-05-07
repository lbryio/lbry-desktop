import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import { selectRewardContentClaimIds, selectPlayingUri } from 'redux/selectors/content';
import { doRemoveUnreadSubscription } from 'redux/actions/subscriptions';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSetContentHistoryItem } from 'redux/actions/content';
import {
  doFetchFileInfo,
  makeSelectClaimIsMine,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  makeSelectChannelForClaimUri,
  selectBalance,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectClaimIsNsfw,
} from 'lbry-redux';
import { doFetchViewCount, makeSelectViewCountForUri, makeSelectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowNsfw, makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { doPrepareEdit } from 'redux/actions/publish';
import { doOpenModal } from 'redux/actions/app';
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
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  autoplay: makeSelectClientSetting(settings.AUTOPLAY)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  channelUri: makeSelectChannelForClaimUri(props.uri, true)(state),
  viewCount: makeSelectViewCountForUri(props.uri)(state),
  balance: selectBalance(state),
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  nsfw: makeSelectClaimIsNsfw(props.uri)(state),
});

const perform = dispatch => ({
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  prepareEdit: (publishData, uri) => dispatch(doPrepareEdit(publishData, uri)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  setViewed: uri => dispatch(doSetContentHistoryItem(uri)),
  markSubscriptionRead: (channel, uri) => dispatch(doRemoveUnreadSubscription(channel, uri)),
  fetchViewCount: claimId => dispatch(doFetchViewCount(claimId)),
});

export default connect(
  select,
  perform
)(FilePage);
