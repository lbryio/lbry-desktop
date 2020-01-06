import { connect } from 'react-redux';
import { doRemoveUnreadSubscription } from 'redux/actions/subscriptions';
import { doSetContentHistoryItem } from 'redux/actions/content';
import {
  doFetchFileInfo,
  makeSelectClaimIsMine,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
  makeSelectChannelForClaimUri,
  selectBalance,
  makeSelectMediaTypeForUri,
} from 'lbry-redux';
import { doFetchViewCount, makeSelectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import FilePage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowMatureContent(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  channelUri: makeSelectChannelForClaimUri(props.uri, true)(state),
  balance: selectBalance(state),
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
});

const perform = dispatch => ({
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  setViewed: uri => dispatch(doSetContentHistoryItem(uri)),
  markSubscriptionRead: (channel, uri) => dispatch(doRemoveUnreadSubscription(channel, uri)),
  fetchViewCount: claimId => dispatch(doFetchViewCount(claimId)),
});

export default connect(
  select,
  perform
)(FilePage);
