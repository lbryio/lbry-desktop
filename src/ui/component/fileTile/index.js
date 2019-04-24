import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
  makeSelectIsUriResolving,
  makeSelectClaimIsMine,
  makeSelectThumbnailForUri,
  makeSelectTitleForUri,
  makeSelectClaimIsNsfw,
} from 'lbry-redux';
import { selectRewardContentClaimIds } from 'lbryinc';
import { selectShowNsfw } from 'redux/selectors/settings';
import { doClearPublish, doUpdatePublishForm } from 'redux/actions/publish';
import { makeSelectIsSubscribed, makeSelectIsNew } from 'redux/selectors/subscriptions';
import FileTile from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isDownloaded: !!makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
  obscureNsfw: !selectShowNsfw(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  isNew: makeSelectIsNew(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  nsfw: makeSelectClaimIsNsfw(props.uri)(state),
});

const perform = dispatch => ({
  clearPublish: () => dispatch(doClearPublish()),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  select,
  perform
)(FileTile);
