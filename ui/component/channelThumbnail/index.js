import { connect } from 'react-redux';
import { makeSelectThumbnailForUri, doResolveUri, makeSelectClaimForUri } from 'lbry-redux';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, {
  doResolveUri,
})(ChannelThumbnail);
