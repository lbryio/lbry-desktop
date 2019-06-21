import { connect } from 'react-redux';

import {
  doResolveUri,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectMetadataItemForUri,
} from 'lbry-redux';

import ChannelTooltip from './view';

const select = (state, props) => {
  return {
    uri: props.uri,
    claim: makeSelectClaimForUri(props.uri)(state),
    title: makeSelectTitleForUri(props.uri)(state),
    thumbnail: makeSelectThumbnailForUri(props.uri)(state),
    description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
    isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  };
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(ChannelTooltip);
