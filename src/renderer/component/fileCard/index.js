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
import { doNavigate } from 'redux/actions/navigation';
import {
  selectRewardContentClaimIds,
  makeSelectContentPositionForUri,
} from 'redux/selectors/content';
import { selectShowNsfw } from 'redux/selectors/settings';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
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
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  clearHistoryUri: uri => dispatch(doClearContentHistoryUri(uri)),
});

export default connect(
  select,
  perform
)(FileCard);
