import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
  makeSelectIsUriResolving,
  makeSelectClaimIsMine,
  makeSelectClaimIsPending,
} from 'lbry-redux';
import { selectRewardContentClaimIds } from 'lbryinc';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
import { selectShowNsfw } from 'redux/selectors/settings';
import { makeSelectIsSubscribed, makeSelectIsNew } from 'redux/selectors/subscriptions';
import { doClearContentHistoryUri } from 'redux/actions/content';
import FileCard from './view';

const select = (state, props) => ({
  pending: makeSelectClaimIsPending(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  position: makeSelectContentPositionForUri(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  isNew: makeSelectIsNew(props.uri)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
  clearHistoryUri: uri => dispatch(doClearContentHistoryUri(uri)),
});

export default connect(
  select,
  perform
)(FileCard);
