import { connect } from 'react-redux';
import { selectThumbnailForUri, selectClaimForUri, selectIsUriResolving } from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: selectThumbnailForUri(state, props.uri),
  claim: selectClaimForUri(state, props.uri),
  isResolving: selectIsUriResolving(state, props.uri),
});

export default connect(select, {
  doResolveUri,
})(ChannelThumbnail);
