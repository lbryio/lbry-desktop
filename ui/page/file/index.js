import { connect } from 'react-redux';
import { doRemoveUnreadSubscription } from 'redux/actions/subscriptions';
import { doSetContentHistoryItem } from 'redux/actions/content';
import { withRouter } from 'react-router';
import {
  doFetchFileInfo,
  makeSelectFileInfoForUri,
  makeSelectMetadataForUri,
  makeSelectChannelForClaimUri,
  makeSelectClaimIsNsfw,
} from 'lbry-redux';
import { makeSelectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import FilePage from './view';
import { makeSelectCommentForCommentId } from 'redux/selectors/comments';

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
    isSubscribed: makeSelectIsSubscribed(props.uri)(state),
    channelUri: makeSelectChannelForClaimUri(props.uri, true)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
  };
};

const perform = dispatch => ({
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  setViewed: uri => dispatch(doSetContentHistoryItem(uri)),
  markSubscriptionRead: (channel, uri) => dispatch(doRemoveUnreadSubscription(channel, uri)),
});

export default withRouter(connect(select, perform)(FilePage));
