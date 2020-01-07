import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimIsPending,
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectIsUriResolving,
  selectChannelIsBlocked,
} from 'lbry-redux';

import Comment from './view';

const select = (state, props) => ({
  pending: props.channelUri && makeSelectClaimIsPending(props.channelUri)(state),
  channel: props.channelUri && makeSelectClaimForUri(props.channelUri)(state),
  isResolvingUri: props.channelUri && makeSelectIsUriResolving(props.channelUri)(state),
  thumbnail: props.channelUri && makeSelectThumbnailForUri(props.channelUri)(state),
  channelIsBlocked: props.channelUri && selectChannelIsBlocked(props.channelUri)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(Comment);
