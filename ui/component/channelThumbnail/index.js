import { connect } from 'react-redux';
import { makeSelectThumbnailForUri, doResolveUri, makeSelectClaimForUri, makeSelectIsUriResolving } from 'lbry-redux';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolving: makeSelectIsUriResolving(props.uri)(state),
});

export default connect(select, {
  doResolveUri,
})(ChannelThumbnail);
