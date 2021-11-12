import { connect } from 'react-redux';
import { selectThumbnailForUri, selectClaimForUri, makeSelectIsUriResolving } from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: selectThumbnailForUri(state, props.uri),
  claim: selectClaimForUri(state, props.uri),
  isResolving: makeSelectIsUriResolving(props.uri)(state),
});

export default connect(select, {
  doResolveUri,
})(ChannelThumbnail);
